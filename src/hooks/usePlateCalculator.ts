import { useState, useEffect, useMemo } from 'react';
import { UnitSystem, LoadedPlate, BarType, WarmupSet, PercentageRow, MaxPlateConfig } from '../types';
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
  generateWarmupSets,
  generatePercentageMatrix,
} from '../utils/calculations';

const STORAGE_KEY = 'platestack_premium_unlocked';

export function usePlateCalculator() {
  const [unit, setUnit] = useState<UnitSystem>('kg');
  const [targetWeight, setTargetWeight] = useState<string>('');
  const [manualPlates, setManualPlates] = useState<LoadedPlate[]>([]);
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

  const platesPerSide = useMemo(() => {
    if (manualPlates.length > 0) {
      return manualPlates;
    }

    const weight = parseFloat(targetWeight);
    if (!weight || weight <= barbellConfig.weight) {
      return [];
    }

    const maxWeight = maxPlateConfig.enabled ? maxPlateConfig.maxPlateWeight : undefined;
    return calculatePlatesPerSide(weight, barbellConfig.weight, currentPlates, maxWeight);
  }, [targetWeight, manualPlates, barbellConfig, currentPlates, maxPlateConfig]);

  const totalWeight = useMemo(() => {
    if (manualPlates.length > 0) {
      return calculateTotalWeight(manualPlates, barbellConfig.weight);
    }
    return parseFloat(targetWeight) || barbellConfig.weight;
  }, [targetWeight, manualPlates, barbellConfig]);

  const warmupSets = useMemo(() => {
    if (!targetWeight) return [];
    const weight = parseFloat(targetWeight);
    if (!weight) return [];
    const maxWeight = maxPlateConfig.enabled ? maxPlateConfig.maxPlateWeight : undefined;
    return generateWarmupSets(weight, barbellConfig.weight, currentPlates, maxWeight);
  }, [targetWeight, barbellConfig, currentPlates, maxPlateConfig]);

  const percentageMatrix = useMemo(() => {
    if (!targetWeight) return [];
    const weight = parseFloat(targetWeight);
    if (!weight) return [];
    const maxWeight = maxPlateConfig.enabled ? maxPlateConfig.maxPlateWeight : undefined;
    return generatePercentageMatrix(weight, barbellConfig.weight, currentPlates, maxWeight);
  }, [targetWeight, barbellConfig, currentPlates, maxPlateConfig]);

  // Clear manual plates when target weight changes
  useEffect(() => {
    if (targetWeight && manualPlates.length > 0) {
      setManualPlates([]);
    }
  }, [targetWeight]);

  const toggleUnit = () => {
    const newUnit = unit === 'kg' ? 'lbs' : 'kg';

    if (targetWeight) {
      const currentWeight = parseFloat(targetWeight);
      const convertedWeight = convertWeight(currentWeight, unit, newUnit);
      setTargetWeight(convertedWeight.toString());
    }

    if (customBarWeight) {
      const currentCustom = parseFloat(customBarWeight);
      const convertedCustom = convertWeight(currentCustom, unit, newUnit);
      setCustomBarWeight(convertedCustom.toString());
    }

    // Convert max plate weight if set
    if (maxPlateConfig.enabled && maxPlateConfig.maxPlateWeight) {
      const convertedMaxPlate = convertWeight(maxPlateConfig.maxPlateWeight, unit, newUnit);
      const availablePlates = getPlatesByUnit(newUnit);
      const closestPlate = availablePlates.reduce((prev, curr) =>
        Math.abs(curr.weight - convertedMaxPlate) < Math.abs(prev.weight - convertedMaxPlate) ? curr : prev
      );
      setMaxPlateConfig({
        enabled: true,
        maxPlateWeight: closestPlate.weight,
      });
    }

    // Reset manual plates on unit change
    setManualPlates([]);
    setUnit(newUnit);
  };

  const manualAddPlate = (plateWeight: number): void => {
    const plate = currentPlates.find(p => p.weight === plateWeight);
    if (!plate) return;

    // Check if plate respects max plate config
    if (maxPlateConfig.enabled && maxPlateConfig.maxPlateWeight && plateWeight > maxPlateConfig.maxPlateWeight) {
      return;
    }

    setManualPlates(prev => {
      const existing = prev.find(p => p.weight === plateWeight);
      if (existing) {
        return prev.map(p =>
          p.weight === plateWeight ? { ...p, count: p.count + 1 } : p
        );
      }
      return [...prev, { ...plate, count: 1 }];
    });

    setTargetWeight('');
  };

  const clearBar = () => {
    setManualPlates([]);
    setTargetWeight('');
  };

  const unlockPremium = () => {
    setIsPremiumUnlocked(true);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  return {
    unit,
    toggleUnit,
    targetWeight,
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
    warmupSets,
    percentageMatrix,
    isPremiumUnlocked,
    unlockPremium,
    maxPlateConfig,
    setMaxPlateConfig,
  };
}
