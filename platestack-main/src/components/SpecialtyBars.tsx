import { Dumbbell } from 'lucide-react';
import { BarType } from '../types';

interface SpecialtyBarsProps {
  barType: BarType;
  onBarTypeChange: (type: BarType) => void;
  customBarWeight: string;
  onCustomBarWeightChange: (weight: string) => void;
  unit: 'kg' | 'lbs';
}

export function SpecialtyBars({
  barType,
  onBarTypeChange,
  customBarWeight,
  onCustomBarWeightChange,
  unit,
}: SpecialtyBarsProps) {
  const barOptions = [
    { type: 'technique' as BarType, label: unit === 'kg' ? '15 kg' : '35 lbs', desc: 'Technique' },
    { type: 'standard' as BarType, label: unit === 'kg' ? '20 kg' : '45 lbs', desc: 'Standard' },
    { type: 'squat' as BarType, label: unit === 'kg' ? '25 kg' : '55 lbs', desc: 'Squat' },
    { type: 'custom' as BarType, label: 'Custom', desc: 'Custom' },
  ];

  return (
    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
      <div className="flex items-center gap-2 mb-2">
        <Dumbbell className="w-4 h-4 text-blue-500" />
        <h3 className="text-sm font-bold text-white">Specialty Bars</h3>
      </div>
      <div className="grid grid-cols-4 gap-2 mb-2">
        {barOptions.map((option) => (
          <button
            key={option.type}
            onClick={() => onBarTypeChange(option.type)}
            className={`p-2 rounded-lg border-2 transition-all text-xs font-semibold ${
              barType === option.type
                ? 'bg-neon-green/20 border-neon-green text-neon-green'
                : 'bg-slate-900 border-slate-700 text-gray-400 hover:border-slate-600'
            }`}
          >
            <div className="text-[10px] text-gray-500">{option.desc}</div>
            <div>{option.label}</div>
          </button>
        ))}
      </div>
      {barType === 'custom' && (
        <div className="mt-2">
          <input
            type="number"
            value={customBarWeight}
            onChange={(e) => onCustomBarWeightChange(e.target.value)}
            placeholder={`Enter weight in ${unit}`}
            className="w-full bg-slate-900 border-2 border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-cyan transition-all"
            step="0.5"
          />
        </div>
      )}
    </div>
  );
}
