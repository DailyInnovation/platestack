export type UnitSystem = 'kg' | 'lbs';

export interface Plate {
  weight: number;
  color: string;
  name: string;
  width: number; // Visual width multiplier for rendering
}

export interface PlateDenomination {
  weight: number;
  color: string;
  name: string;
  width: number;
}

export interface LoadedPlate extends Plate {
  count: number;
}

export interface BarbellConfig {
  weight: number;
  name: string;
}

export interface PlateCalculation {
  plates: LoadedPlate[];
  totalWeight: number;
  platesPerSide: LoadedPlate[];
}

export interface WarmupSet {
  percentage: number;
  weight: number;
  plates: LoadedPlate[];
}

export interface PercentageRow {
  percentage: number;
  weight: number;
  plates: LoadedPlate[];
}

export type BarType = 'technique' | 'standard' | 'squat' | 'custom';

export interface MaxPlateConfig {
  enabled: boolean;
  maxPlateWeight: number | null;
}
