import { useState, useMemo, useEffect } from 'react';
import { UnitSystem, LoadedPlate, BarType, MaxPlateConfig } from '../types';
import {
  getPlatesByUnit,
  DEFAULT_BARBELL_KG,
  DEFAULT_BARBELL_LBS,
  BARBELL_CONFIGS,
  convertWeight,
} from '../utils/plates';
import {
  calculatePlatesPerSide,
  calculateTotalWeight,
} from '../utils/calculations';

const STORAGE_KEY = 'platestack_premium_unlocked';
const SETTINGS_KEY = 'platestack_settings';
const VALIDATION_CACHE_KEY = 'platestack_validation_ts';
const VALIDATION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Gumroad license keys are shaped: 8-8-8-8 hex chars (e.g. A1B2C3D4-E5F6A7B8-C9D0E1F2-A3B4C5D6)
const LICENSE_KEY_RE = /^[0-9a-f]{8}-[0-9a-f]{8}-[0-9a-f]{8}-[0-9a-f]{8}$/i;

function isValidLicenseKey(val: string | null): boolean {
  return !!val && LICENSE_KEY_RE.test(val.trim());
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveSettings(patch: Record<string, unknown>) {
  try {
    const existing = loadSettings() || {};
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...existing, ...patch }));
  } catch {}
}

export function usePlateCalculator() {
  const [unit, setUnit] = useState<UnitSystem>(() => {
    const s = loadSettings();
    return (s?.unit as UnitSystem) || 'kg';
  });
  const [targetWeightState, setTargetWeightState] = useState<string>('');
  const [manualPlates, setManualPlatesState] = useState<LoadedPlate[]>([]);
  const [barType, setBarType] = useState<BarType>(() => {
    const s = loadSettings();
    return (s?.barType as BarType) || 'standard';
  });
  const [customBarWeight, setCustomBarWeight] = useState<string>(() => {
    const s = loadSettings();
    return s?.customBarWeight || '';
  });
  const [maxPlateConfig, setMaxPlateConfigState] = useState<MaxPlateConfig>(() => {
    const s = loadSettings();
    return s?.maxPlateConfig || { enabled: false, maxPlateWeight: null };
  });
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isValidLicenseKey(stored);
  });

  // Silently re-validate stored key against Gumroad on mount.
  // Skips the API call if a successful validation was cached within the last 24 hours
  // so the app works fully offline after first use.
  // Revokes access if subscription was cancelled, refunded, or disputed.
  // Fails open on network errors so users aren't locked out by connectivity issues.
  useEffect(() => {
    const storedKey = localStorage.getItem(STORAGE_KEY);
    if (!isValidLicenseKey(storedKey)) return;

    const lastValidated = Number(localStorage.getItem(VALIDATION_CACHE_KEY) || 0);
    if (Date.now() - lastValidated < VALIDATION_TTL_MS) return; // still fresh — skip

    fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        product_id: '-_fGsvjLsZgrpthpDfoH0g==',
        license_key: storedKey!.trim(),
        increment_uses_count: 'false',
      }).toString(),
    })
      .then(r => r.json())
      .then(data => {
        if (!data.success) { revoke(); return; }
        const p = data.purchase;
        const dead =
          p.refunded ||
          (p.disputed && !p.dispute_won) ||
          p.subscription_ended_at != null ||
          p.subscription_cancelled_at != null;
        if (dead) { revoke(); return; }
        localStorage.setItem(VALIDATION_CACHE_KEY, String(Date.now())); // cache success
      })
      .catch(() => { /* network failure — keep access, retry next session */ });

    function revoke() {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(VALIDATION_CACHE_KEY);
      setIsPremiumUnlocked(false);
    }
  }, []);

  const currentPlates = getPlatesByUnit(unit);

  const barbellConfig = useMemo(() => {
    if (barType === 'custom' && customBarWeight) {
      return {
        weight: parseFloat(customBarWeight) || (unit === 'kg' ? DEFAULT_BARBELL_KG : DEFAULT_BARBELL_LBS),
        name: `Custom Bar (${customBarWeight} ${unit})`,
      };
    }
    return BARBELL_CONFIGS[unit][barType];
  }, [unit, barType, customBarWeight]);

  // When user types a target weight → clear manual plates so auto-calculation takes over
  const setTargetWeight = (val: string) => {
    setManualPlatesState([]);
    setTargetWeightState(val);
  };

  const platesPerSide = useMemo(() => {
    if (manualPlates.length > 0) {
      return manualPlates;
    }
    const weight = parseFloat(targetWeightState);
    if (!weight || weight <= barbellConfig.weight) {
      return [];
    }
    const maxWeight = maxPlateConfig.enabled ? maxPlateConfig.maxPlateWeight : undefined;
    return calculatePlatesPerSide(weight, barbellConfig.weight, currentPlates, maxWeight);
  }, [targetWeightState, manualPlates, barbellConfig, currentPlates, maxPlateConfig]);

  const totalWeight = useMemo(() => {
    if (manualPlates.length > 0) {
      return calculateTotalWeight(manualPlates, barbellConfig.weight);
    }
    return parseFloat(targetWeightState) || barbellConfig.weight;
  }, [targetWeightState, manualPlates, barbellConfig]);

  // When max plate limit changes, remove any manual plates that now violate it
  const setMaxPlateConfig = (config: MaxPlateConfig) => {
    saveSettings({ maxPlateConfig: config });
    setMaxPlateConfigState(config);
    if (config.enabled && config.maxPlateWeight != null) {
      setManualPlatesState(prev => {
        const filtered = prev.filter(p => p.weight <= config.maxPlateWeight!);
        if (filtered.length !== prev.length) {
          if (filtered.length > 0) {
            const newTotal = calculateTotalWeight(filtered, barbellConfig.weight);
            setTargetWeightState(String(newTotal));
          } else {
            setTargetWeightState('');
          }
        }
        return filtered;
      });
    }
  };

  const toggleUnit = () => {
    const newUnit = unit === 'kg' ? 'lbs' : 'kg';

    if (targetWeightState) {
      const currentWeight = parseFloat(targetWeightState);
      const convertedWeight = convertWeight(currentWeight, unit, newUnit);
      setTargetWeightState(convertedWeight.toString());
    }

    let newCustomBarWeight = customBarWeight;
    if (customBarWeight) {
      const currentCustom = parseFloat(customBarWeight);
      const convertedCustom = convertWeight(currentCustom, unit, newUnit);
      newCustomBarWeight = convertedCustom.toString();
      setCustomBarWeight(newCustomBarWeight);
    }

    let newMaxPlateConfig = maxPlateConfig;
    if (maxPlateConfig.enabled && maxPlateConfig.maxPlateWeight) {
      const convertedMaxPlate = convertWeight(maxPlateConfig.maxPlateWeight, unit, newUnit);
      const availablePlates = getPlatesByUnit(newUnit);
      const closestPlate = availablePlates.reduce((prev, curr) =>
        Math.abs(curr.weight - convertedMaxPlate) < Math.abs(prev.weight - convertedMaxPlate) ? curr : prev
      );
      newMaxPlateConfig = { enabled: true, maxPlateWeight: closestPlate.weight };
      setMaxPlateConfigState(newMaxPlateConfig);
    }

    saveSettings({ unit: newUnit, customBarWeight: newCustomBarWeight, maxPlateConfig: newMaxPlateConfig });
    setManualPlatesState([]);
    setUnit(newUnit);
  };

  // When plates are manually tapped → add plate and sync target weight to new total
  const manualAddPlate = (plateWeight: number): void => {
    const plate = currentPlates.find(p => p.weight === plateWeight);
    if (!plate) return;
    if (maxPlateConfig.enabled && maxPlateConfig.maxPlateWeight && plateWeight > maxPlateConfig.maxPlateWeight) return;

    setManualPlatesState(prev => {
      const existing = prev.find(p => p.weight === plateWeight);
      const newPlates = existing
        ? prev.map(p => p.weight === plateWeight ? { ...p, count: p.count + 1 } : p)
        : [...prev, { ...plate, count: 1 }];

      const newTotal = calculateTotalWeight(newPlates, barbellConfig.weight);
      setTargetWeightState(String(newTotal));
      return newPlates;
    });
  };

  // Add a custom weight plate not in the standard denominations list
  const manualAddCustomPlate = (plateWeight: number): void => {
    if (isNaN(plateWeight) || plateWeight <= 0) return;
    if (maxPlateConfig.enabled && maxPlateConfig.maxPlateWeight && plateWeight > maxPlateConfig.maxPlateWeight) return;

    const customPlate = {
      weight: plateWeight,
      color: 'plate-silver',
      name: `${plateWeight} ${unit}`,
      width: 0.8,
    };

    setManualPlatesState(prev => {
      const existing = prev.find(p => p.weight === plateWeight);
      const newPlates = existing
        ? prev.map(p => p.weight === plateWeight ? { ...p, count: p.count + 1 } : p)
        : [...prev, { ...customPlate, count: 1 }];

      const newTotal = calculateTotalWeight(newPlates, barbellConfig.weight);
      setTargetWeightState(String(newTotal));
      return newPlates;
    });
  };

  const clearBar = () => {
    setManualPlatesState([]);
    setTargetWeightState('');
  };

  const unlockPremium = (licenseKey: string) => {
    setIsPremiumUnlocked(true);
    localStorage.setItem(STORAGE_KEY, licenseKey.trim());
  };

  const setBarTypePersisted = (bt: BarType) => {
    saveSettings({ barType: bt });
    setBarType(bt);
  };

  const setCustomBarWeightPersisted = (w: string) => {
    saveSettings({ customBarWeight: w });
    setCustomBarWeight(w);
  };

  return {
    unit,
    toggleUnit,
    targetWeight: targetWeightState,
    setTargetWeight,
    manualPlates,
    manualAddPlate,
    manualAddCustomPlate,
    clearBar,
    barType,
    setBarType: setBarTypePersisted,
    customBarWeight,
    setCustomBarWeight: setCustomBarWeightPersisted,
    barbellConfig,
    platesPerSide,
    totalWeight,
    currentPlates,
    isPremiumUnlocked,
    unlockPremium,
    maxPlateConfig,
    setMaxPlateConfig,
  };
}
