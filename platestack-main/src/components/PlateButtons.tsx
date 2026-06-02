import { PlateDenomination, MaxPlateConfig } from '../types';
import { Minus, RotateCcw } from 'lucide-react';

interface PlateButtonsProps {
  plates: PlateDenomination[];
  onAddPlate: (weight: number) => void;
  onClearBar: () => void;
  maxPlateConfig?: MaxPlateConfig;
}

export function PlateButtons({ plates, onAddPlate, onClearBar, maxPlateConfig }: PlateButtonsProps) {
  const getColorClass = (color: string): string => {
    const colorMap: Record<string, string> = {
      'plate-red': 'bg-red-600 hover:bg-red-500 border-red-400',
      'plate-blue': 'bg-blue-600 hover:bg-blue-500 border-blue-400',
      'plate-yellow': 'bg-yellow-500 hover:bg-yellow-400 border-yellow-300',
      'plate-green': 'bg-green-600 hover:bg-green-500 border-green-400',
      'plate-white': 'bg-gray-100 hover:bg-white border-gray-300 text-gray-900',
      'plate-black': 'bg-slate-800 hover:bg-slate-700 border-slate-600',
      'plate-silver': 'bg-gray-400 hover:bg-gray-300 border-gray-300',
    };
    return colorMap[color] || 'bg-gray-500 hover:bg-gray-400 border-gray-400';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs text-gray-400 font-medium">Tap to Load Plates</label>
        <button
          onClick={onClearBar}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-red-600/50 text-red-400 hover:text-red-300 rounded-lg text-xs font-semibold transition-all active:scale-95"
        >
          <RotateCcw className="w-3 h-3" />
          Clear Bar
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {plates.map((plate) => {
          const isDisabled = maxPlateConfig?.enabled && maxPlateConfig.maxPlateWeight && plate.weight > maxPlateConfig.maxPlateWeight;

          return (
            <button
              key={plate.weight}
              onClick={() => !isDisabled && onAddPlate(plate.weight)}
              disabled={isDisabled}
              className={`py-2.5 px-2 rounded-lg border-2 font-bold text-xs transition-all shadow-lg ${
                isDisabled
                  ? 'bg-slate-800 border-slate-700 text-slate-600 cursor-not-allowed opacity-40'
                  : `${getColorClass(plate.color)} active:scale-95`
              }`}
            >
              {plate.weight}
            </button>
          );
        })}
      </div>
    </div>
  );
}
