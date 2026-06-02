import { UnitSystem } from '../types';

interface WeightInputProps {
  value: string;
  onChange: (value: string) => void;
  unit: UnitSystem;
}

export function WeightInput({ value, onChange, unit }: WeightInputProps) {
  return (
    <div className="mb-3">
      <label className="block text-xs text-gray-400 mb-1 font-medium">
        Target Weight
      </label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={unit === 'kg' ? '0' : '0'}
          className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg px-4 py-2.5 text-3xl font-bold text-white text-center focus:outline-none focus:border-neon-green focus:ring-2 focus:ring-neon-green/20 transition-all placeholder-slate-600"
          step="2.5"
          min="0"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-gray-500 font-semibold">
          {unit.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
