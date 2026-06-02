import { PlateDenomination, UnitSystem } from '../types';

export const KG_PLATES: PlateDenomination[] = [
  { weight: 25, color: 'plate-red', name: '25 kg', width: 3 },
  { weight: 20, color: 'plate-blue', name: '20 kg', width: 2.5 },
  { weight: 15, color: 'plate-yellow', name: '15 kg', width: 2 },
  { weight: 10, color: 'plate-green', name: '10 kg', width: 1.5 },
  { weight: 5, color: 'plate-white', name: '5 kg', width: 1.2 },
  { weight: 2.5, color: 'plate-black', name: '2.5 kg', width: 1 },
  { weight: 1.25, color: 'plate-silver', name: '1.25 kg', width: 0.8 },
];

export const LBS_PLATES: PlateDenomination[] = [
  { weight: 55, color: 'plate-red', name: '55 lbs', width: 3 },
  { weight: 45, color: 'plate-blue', name: '45 lbs', width: 2.5 },
  { weight: 35, color: 'plate-yellow', name: '35 lbs', width: 2 },
  { weight: 25, color: 'plate-green', name: '25 lbs', width: 1.5 },
  { weight: 10, color: 'plate-white', name: '10 lbs', width: 1.2 },
  { weight: 5, color: 'plate-black', name: '5 lbs', width: 1 },
  { weight: 2.5, color: 'plate-silver', name: '2.5 lbs', width: 0.8 },
];

export const KG_TO_LBS = 2.20462;
export const LBS_TO_KG = 0.453592;

export const DEFAULT_BARBELL_KG = 20;
export const DEFAULT_BARBELL_LBS = 45;

export const BARBELL_CONFIGS = {
  kg: {
    technique: { weight: 15, name: 'Technique Bar (15 kg)' },
    standard: { weight: 20, name: 'Standard Bar (20 kg)' },
    squat: { weight: 25, name: 'Squat Bar (25 kg)' },
    custom: { weight: 20, name: 'Custom Bar' },
  },
  lbs: {
    technique: { weight: 35, name: 'Technique Bar (35 lbs)' },
    standard: { weight: 45, name: 'Standard Bar (45 lbs)' },
    squat: { weight: 55, name: 'Squat Bar (55 lbs)' },
    custom: { weight: 45, name: 'Custom Bar' },
  },
};

export function getPlatesByUnit(unit: UnitSystem): PlateDenomination[] {
  return unit === 'kg' ? KG_PLATES : LBS_PLATES;
}

export function convertWeight(weight: number, fromUnit: UnitSystem, toUnit: UnitSystem): number {
  if (fromUnit === toUnit) return weight;
  if (fromUnit === 'kg' && toUnit === 'lbs') {
    return Math.round(weight * KG_TO_LBS * 2) / 2; // Round to nearest 0.5
  }
  return Math.round(weight * LBS_TO_KG * 2) / 2;
}
