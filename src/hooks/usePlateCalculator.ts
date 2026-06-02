import { useState, useMemo } from 'react';
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

export function usePlateCalculator() {
  const [unit, setUnit] = useState<UnitSystem>('kg');
  const [targetWeightState, setTargetWeightState] = useState<string>('');
  const [manualPlates, setManualPlatesState] = useState<LoadedPlate[]>([]);
  const [barType, setBarType] = useState<BarType>('standard');
  const [customBarWeight, setCustomBarWeight] = useState<string>('');
  const [maxPlateConfig, setMaxPlateConfig] = useState<MaxPlateConfig>({
    enabled: false,
    maxPlateWeight: null,
  });
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'true';
  });

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

  const toggleUnit = () => {
    const newUnit = unit === 'kg' ? 'lbs' : 'kg';

    if (targetWeightState) {
      const currentWeight = parseFloat(targetWeightState);
      const convertedWeight = convertWeight(currentWeight, unit, newUnit);
      setTargetWeightState(convertedWeight.toString());
    }

    if (customBarWeight) {
      const currentCustom = parseFloat(customBarWeight);
      const convertedCustom = convertWeight(currentCustom, unit, newUnit);
      setCustomBarWeight(convertedCustom.toString());
    }

    if (maxPlateConfig.enabled && maxPlateConfig.maxPlateWeight) {
      const convertedMaxPlate = convertWeight(maxPlateConfig.maxPlateWeight, unit, newUnit);
      const availablePlates = getPlatesByUnit(newUnit);
      const closestPlate = availablePlates.reduce((prev, curr) =>
        Math.abs(curr.weight - convertedMaxPlate) < Math.abs(prev.weight - convertedMaxPlate) ? curr : prev
      );
      setMaxPlateConfig({ enabled: true, maxPlateWeight: closestPlate.weight });
    }

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

      // Sync target weight to the new manual total so warmup, percentage tools all update
      const newTotal = calculateTotalWeight(newPlates, barbellConfig.weight);
      setTargetWeightState(String(newTotal));

      return newPlates;
    });
  };

  const clearBar = () => {
    setManualPlatesState([]);
    setTargetWeightState('');
  };

  const unlockPremium = () => {
    setIsPremiumUnlocked(true);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  return {
    unit,
    toggleUnit,
    targetWeight: targetWeightState,
    setTargetWeight,
    manualPlates,
    manualAddPlate,
    clearBar,
    barType,
    setBarType,
    customBarWeight,
    setCustomBarWeight,
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
