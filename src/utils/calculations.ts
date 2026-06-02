import { LoadedPlate, PlateDenomination, BarbellConfig, WarmupSet, PercentageRow } from '../types';

export function calculatePlatesPerSide(
  targetWeight: number,
  barbellWeight: number,
  plates: PlateDenomination[],
  maxPlateWeight?: number | null
): LoadedPlate[] {
  if (targetWeight <= barbellWeight) {
    return [];
  }

  const weightPerSide = (targetWeight - barbellWeight) / 2;
  const result: LoadedPlate[] = [];
  let remainingWeight = weightPerSide;

  // Filter plates based on max plate weight if specified
  const availablePlates = maxPlateWeight
    ? plates.filter(p => p.weight <= maxPlateWeight)
    : plates;

  for (const plate of availablePlates) {
    if (remainingWeight < plate.weight) continue;

    const count = Math.floor(remainingWeight / plate.weight);
    if (count > 0) {
      result.push({
        ...plate,
        count,
      });
      remainingWeight -= plate.weight * count;
    }

    if (remainingWeight < 0.5) break;
  }

  return result;
}

export function calculateTotalWeight(
  platesPerSide: LoadedPlate[],
  barbellWeight: number
): number {
  const platesWeight = platesPerSide.reduce((sum, plate) => {
    return sum + plate.weight * plate.count * 2;
  }, 0);
  return barbellWeight + platesWeight;
}

export function generateWarmupSets(
  targetWeight: number,
  barbellWeight: number,
  plates: PlateDenomination[],
  maxPlateWeight?: number | null
): WarmupSet[] {
  const percentages = [0.4, 0.55, 0.7, 0.85];

  return percentages.map(percentage => {
    const weight = Math.round((targetWeight * percentage) / 2.5) * 2.5;
    const warmupPlates = calculatePlatesPerSide(weight, barbellWeight, plates, maxPlateWeight);

    return {
      percentage: Math.round(percentage * 100),
      weight,
      plates: warmupPlates,
    };
  });
}

export function generatePercentageMatrix(
  targetWeight: number,
  barbellWeight: number,
  plates: PlateDenomination[],
  maxPlateWeight?: number | null
): PercentageRow[] {
  const percentages = [65, 75, 85, 95];

  return percentages.map(percentage => {
    const weight = Math.round((targetWeight * (percentage / 100)) / 2.5) * 2.5;
    const percentPlates = calculatePlatesPerSide(weight, barbellWeight, plates, maxPlateWeight);

    return {
      percentage,
      weight,
      plates: percentPlates,
    };
  });
}
