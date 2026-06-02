import { UnitSystem } from '../types';

interface UnitToggleProps {
  unit: UnitSystem;
  onToggle: () => void;
}

export function UnitToggle({ unit, onToggle }: UnitToggleProps) {
  return (
    <div className="flex items-center justify-center gap-3 mb-3">
      <span className={`text-sm font-semibold ${unit === 'kg' ? 'text-neon-green' : 'text-gray-400'}`}>
        KG
      </span>
      <button
        onClick={onToggle}
        className="relative w-14 h-7 bg-slate-700 rounded-full transition-all duration-300 shadow-inner"
        aria-label="Toggle unit system"
      >
        <div
          className={`absolute top-0.5 w-6 h-6 rounded-full transition-all duration-300 shadow-lg ${
            unit === 'kg'
              ? 'left-0.5 bg-gradient-to-br from-neon-green to-emerald-600'
              : 'left-[calc(100%-26px)] bg-gradient-to-br from-neon-cyan to-cyan-600'
          }`}
        />
      </button>
      <span className={`text-sm font-semibold ${unit === 'lbs' ? 'text-neon-cyan' : 'text-gray-400'}`}>
        LBS
      </span>
    </div>
  );
}
