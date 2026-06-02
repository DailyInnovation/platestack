import { MaxPlateConfig, PlateDenomination } from '../types';
import { Sliders } from 'lucide-react';

interface MaxPlateSelectorProps {
  maxPlateConfig: MaxPlateConfig;
  onMaxPlateChange: (config: MaxPlateConfig) => void;
  plates: PlateDenomination[];
  unit: 'kg' | 'lbs';
}

export function MaxPlateSelector({
  maxPlateConfig,
  onMaxPlateChange,
  plates,
  unit,
}: MaxPlateSelectorProps) {
  const handleToggle = () => {
    if (maxPlateConfig.enabled) {
      onMaxPlateChange({ enabled: false, maxPlateWeight: null });
    } else {
      // Default to second largest plate when enabling
      const defaultMax = plates.length > 1 ? plates[1].weight : plates[0].weight;
      onMaxPlateChange({ enabled: true, maxPlateWeight: defaultMax });
    }
  };

  const handleMaxPlateWeightChange = (weight: number) => {
    onMaxPlateChange({ enabled: true, maxPlateWeight: weight });
  };

  return (
    <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-purple-500" />
          <h3 className="text-sm font-bold text-white">Max Plate Limit</h3>
        </div>
        <button
          onClick={handleToggle}
          className={`relative w-10 h-5 rounded-full transition-all duration-300 ${
            maxPlateConfig.enabled
              ? 'bg-neon-green'
              : 'bg-slate-700'
          }`}
          aria-label="Toggle max plate limit"
        >
          <div
            className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300 ${
              maxPlateConfig.enabled
                ? 'left-[calc(100%-18px)] bg-white'
                : 'left-0.5 bg-gray-400'
            }`}
          />
        </button>
      </div>

      {maxPlateConfig.enabled && (
        <div className="space-y-2">
          <label className="text-xs text-gray-400">Maximum plate to use</label>
          <div className="grid grid-cols-4 gap-1.5">
            {plates.slice(1).map((plate) => (
              <button
                key={plate.weight}
                onClick={() => handleMaxPlateWeightChange(plate.weight)}
                className={`py-2 px-2 rounded text-xs font-semibold transition-all ${
                  maxPlateConfig.maxPlateWeight === plate.weight
                    ? 'bg-neon-green text-slate-900 border-2 border-neon-green'
                    : 'bg-slate-900 text-gray-400 border-2 border-slate-700 hover:border-slate-600'
                }`}
              >
                {plate.weight}
              </button>
            ))}
          </div>
          {maxPlateConfig.maxPlateWeight && (
            <div className="text-xs text-gray-500 mt-1">
              Only using plates up to {maxPlateConfig.maxPlateWeight} {unit}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
