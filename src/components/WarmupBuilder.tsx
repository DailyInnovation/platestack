import { WarmupSet } from '../types';
import { Flame, Trophy, Info } from 'lucide-react';

interface WarmupBuilderProps {
  warmupSets: WarmupSet[];
  unit: 'kg' | 'lbs';
  targetWeight?: string;
}

const PHASE_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  'Activation': { bg: 'from-sky-600 to-sky-800',    text: 'text-sky-400',    bar: 'bg-sky-500' },
  'Build':      { bg: 'from-amber-500 to-amber-700', text: 'text-amber-400',  bar: 'bg-amber-500' },
  'Primer':     { bg: 'from-orange-500 to-red-600',  text: 'text-orange-400', bar: 'bg-orange-500' },
  'Final Prep': { bg: 'from-red-600 to-red-800',     text: 'text-red-400',    bar: 'bg-red-500' },
};

const getPlateColorClass = (color: string): string => {
  const colorMap: Record<string, string> = {
    'plate-red': 'bg-red-600',
    'plate-blue': 'bg-blue-600',
    'plate-yellow': 'bg-yellow-500',
    'plate-green': 'bg-green-600',
    'plate-white': 'bg-gray-100',
    'plate-black': 'bg-slate-700',
    'plate-silver': 'bg-gray-400',
  };
  return colorMap[color] || 'bg-gray-500';
};

export function WarmupBuilder({ warmupSets, unit, targetWeight }: WarmupBuilderProps) {
  const topSetWeight = parseFloat(targetWeight || '0');

  if (warmupSets.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
        <div className="flex items-center gap-2 mb-2">
          <Flame className="w-4 h-4 text-orange-500" />
          <h3 className="text-sm font-bold text-white">Warmup Builder</h3>
        </div>
        <p className="text-xs text-gray-500">Enter target weight to generate your warmup protocol</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-500" />
          <h3 className="text-sm font-bold text-white">Warmup Protocol</h3>
        </div>
        <span className="text-xs text-gray-500 font-medium">CNS Ramp</span>
      </div>

      {/* Protocol tip */}
      <div className="flex items-start gap-2 bg-slate-900/60 rounded-lg px-3 py-2">
        <Info className="w-3 h-3 text-neon-cyan mt-0.5 flex-shrink-0" />
        <p className="text-[10px] text-gray-400 leading-relaxed">
          <span className="text-neon-cyan font-semibold">Science-backed: </span>
          Heavier loads with fewer reps prime your nervous system without pre-fatiguing muscles — reps taper 5→3→2→1 as weight climbs to your top set.
        </p>
      </div>

      {/* Warmup sets */}
      <div className="space-y-2">
        {warmupSets.map((set, idx) => {
          const colors = PHASE_COLORS[set.label] || PHASE_COLORS['Activation'];
          const progressWidth = set.percentage;

          return (
            <div key={idx} className="bg-slate-900/60 rounded-lg overflow-hidden">
              {/* Progress bar strip */}
              <div className="h-0.5 bg-slate-800">
                <div
                  className={`h-full ${colors.bar} transition-all duration-500`}
                  style={{ width: `${progressWidth}%` }}
                />
              </div>

              <div className="p-2.5 flex items-center gap-3">
                {/* Phase badge */}
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colors.bg} flex flex-col items-center justify-center flex-shrink-0 shadow-lg`}>
                  <span className="text-[11px] font-black text-white leading-none">{set.percentage}%</span>
                  <span className="text-[9px] text-white/70 mt-0.5">{set.reps} rep{set.reps > 1 ? 's' : ''}</span>
                </div>

                {/* Weight + label */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wide ${colors.text}`}>{set.label}</span>
                    <span className="text-[9px] text-gray-600">· Set {idx + 1}</span>
                  </div>
                  <div className="text-base font-black text-white leading-tight">
                    {set.weight} <span className="text-xs text-gray-400 font-normal">{unit}</span>
                  </div>
                  {/* Plate chips */}
                  {set.plates.length > 0 && (
                    <div className="flex items-center gap-1 mt-1 flex-wrap">
                      {set.plates.map((plate, pIdx) => (
                        <span key={pIdx} className="text-[9px] bg-slate-800 border border-slate-700 rounded px-1 py-0.5 text-gray-400">
                          {plate.weight}×{plate.count}
                        </span>
                      ))}
                    </div>
                  )}
                  {set.plates.length === 0 && (
                    <span className="text-[9px] text-gray-600">Empty bar</span>
                  )}
                </div>

                {/* Mini plate visual */}
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  {set.plates.slice(0, 4).map((plate, pIdx) => (
                    <div
                      key={pIdx}
                      className={`rounded-sm ${getPlateColorClass(plate.color)} border border-white/20`}
                      style={{ width: `${7 * plate.width}px`, height: '22px' }}
                      title={`${plate.weight} × ${plate.count}`}
                    />
                  ))}
                  {set.plates.length > 4 && (
                    <span className="text-[9px] text-gray-600 ml-0.5">+{set.plates.length - 4}</span>
                  )}
                  {set.plates.length === 0 && (
                    <div className="w-8 h-2 bg-slate-700 rounded-full" />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Top Set row */}
        {topSetWeight > 0 && (
          <div className="bg-gradient-to-r from-neon-green/10 to-emerald-500/10 border border-neon-green/30 rounded-lg overflow-hidden">
            <div className="h-0.5 bg-neon-green" />
            <div className="p-2.5 flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-green to-emerald-600 flex flex-col items-center justify-center flex-shrink-0 shadow-lg shadow-neon-green/20">
                <Trophy className="w-4 h-4 text-slate-900" />
                <span className="text-[9px] font-black text-slate-900 mt-0.5">TOP</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-neon-green">Top Set</span>
                  <span className="text-[9px] text-gray-600">· 100%</span>
                </div>
                <div className="text-base font-black text-white leading-tight">
                  {topSetWeight} <span className="text-xs text-gray-400 font-normal">{unit}</span>
                </div>
                <span className="text-[9px] text-gray-500">As programmed — rest 3–5 min after final prep</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
