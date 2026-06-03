import { useState, useRef } from 'react';
import { PlateDenomination, MaxPlateConfig } from '../types';
import { RotateCcw, Plus, Check, X } from 'lucide-react';

interface PlateButtonsProps {
  plates: PlateDenomination[];
  savedCustomPlates: number[];
  onAddPlate: (weight: number) => void;
  onAddCustomPlate: (weight: number) => void;
  onAddSavedCustomPlate: (weight: number) => void;
  onRemoveSavedCustomPlate: (weight: number) => void;
  onClearBar: () => void;
  maxPlateConfig?: MaxPlateConfig;
  unit: string;
}

export function PlateButtons({
  plates,
  savedCustomPlates = [],
  onAddPlate,
  onAddCustomPlate,
  onAddSavedCustomPlate,
  onRemoveSavedCustomPlate,
  onClearBar,
  maxPlateConfig,
  unit,
}: PlateButtonsProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleOpenCustom = () => {
    setShowCustomInput(true);
    setCustomValue('');
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleConfirmCustom = () => {
    const val = parseFloat(customValue);
    if (!isNaN(val) && val > 0) {
      onAddSavedCustomPlate(val);
    }
    setShowCustomInput(false);
    setCustomValue('');
  };

  const handleCancelCustom = () => {
    setShowCustomInput(false);
    setCustomValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleConfirmCustom();
    if (e.key === 'Escape') handleCancelCustom();
  };

  const canAddMore = savedCustomPlates.length < 6;

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

      {/* Standard plates */}
      <div className="grid grid-cols-4 gap-2">
        {plates.map((plate) => {
          const isDisabled = !!(maxPlateConfig?.enabled && maxPlateConfig.maxPlateWeight != null && plate.weight > maxPlateConfig.maxPlateWeight);
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

      {/* Custom plates row */}
      {(savedCustomPlates.length > 0 || canAddMore) && (
        <div className="mt-2 grid grid-cols-4 gap-2">
          {/* Saved custom plate buttons */}
          {savedCustomPlates.map((weight) => {
            const isDisabled = !!(maxPlateConfig?.enabled && maxPlateConfig.maxPlateWeight != null && weight > maxPlateConfig.maxPlateWeight);
            return (
              <div key={weight} className="relative group">
                <button
                  onClick={() => !isDisabled && onAddCustomPlate(weight)}
                  disabled={isDisabled}
                  className={`w-full py-2.5 px-2 rounded-lg border-2 font-bold text-xs transition-all shadow-lg ${
                    isDisabled
                      ? 'bg-slate-800 border-slate-700 text-slate-600 cursor-not-allowed opacity-40'
                      : 'bg-violet-700 hover:bg-violet-600 border-violet-500 active:scale-95'
                  }`}
                >
                  <span className="block leading-tight">{weight}</span>
                  <span className="block text-[9px] font-normal opacity-70">{unit}</span>
                </button>
                {/* Remove button — appears on hover */}
                <button
                  onClick={() => onRemoveSavedCustomPlate(weight)}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-slate-900 border border-slate-600 text-slate-400 hover:text-red-400 hover:border-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10"
                  title="Remove custom plate"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            );
          })}

          {/* Add new custom plate input / button */}
          {canAddMore && (
            showCustomInput ? (
              <div className="col-span-2 flex items-center gap-1">
                <input
                  ref={inputRef}
                  type="number"
                  value={customValue}
                  onChange={e => setCustomValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={unit}
                  className="w-full py-2 px-2 rounded-lg border-2 border-violet-500/60 bg-slate-900 text-white text-xs font-bold text-center focus:outline-none focus:border-violet-400"
                  min="0.25"
                  step="0.25"
                />
                <button
                  onClick={handleConfirmCustom}
                  className="p-1.5 rounded-lg bg-violet-700/30 border border-violet-500/60 text-violet-300 hover:bg-violet-700/50 transition-all active:scale-95 shrink-0"
                >
                  <Check className="w-3 h-3" />
                </button>
                <button
                  onClick={handleCancelCustom}
                  className="p-1.5 rounded-lg bg-slate-800 border border-slate-600 text-gray-400 hover:text-gray-200 transition-all active:scale-95 shrink-0"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleOpenCustom}
                className="py-2.5 px-2 rounded-lg border-2 border-dashed border-slate-600 hover:border-violet-500/60 text-slate-500 hover:text-violet-400 font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Custom
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
