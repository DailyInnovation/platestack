import { WarmupSet } from '../types';
import { Flame } from 'lucide-react';

interface WarmupBuilderProps {
  warmupSets: WarmupSet[];
  unit: 'kg' | 'lbs';
}

export function WarmupBuilder({ warmupSets, unit }: WarmupBuilderProps) {
  if (warmupSets.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
        <div className="flex items-center gap-2 mb-2">
          <Flame className="w-4 h-4 text-orange-500" />
          <h3 className="text-sm font-bold text-white">Warmup Builder</h3>
        </div>
        <p className="text-xs text-gray-500">Enter target weight to see warmup sets</p>
      </div>
    );
  }

  const getPlateColorClass = (color: string): string => {
    const colorMap: Record<string, string> = {
      'plate-red': 'bg-red-600',
      'plate-blue': 'bg-blue-600',
      'plate-yellow': 'bg-yellow-500',
      'plate-green': 'bg-green-600',
      'plate-white': 'bg-gray-100',
      'plate-black': 'bg-slate-800',
      'plate-silver': 'bg-gray-400',
    };
    return colorMap[color] || 'bg-gray-500';
  };

  return (
    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
      <div className="flex items-center gap-2 mb-2">
        <Flame className="w-4 h-4 text-orange-500" />
        <h3 className="text-sm font-bold text-white">Warmup Builder</h3>
      </div>
      <div className="space-y-2">
        {warmupSets.map((set, idx) => (
          <div key={idx} className="bg-slate-900/50 rounded p-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center font-bold text-xs text-white">
                {set.percentage}%
              </div>
              <div>
                <div className="text-xs text-gray-400">Set {idx + 1}</div>
                <div className="text-sm font-bold text-white">{set.weight} {unit}</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {set.plates.map((plate, pIdx) => (
                <div
                  key={pIdx}
                  className={`rounded-sm ${getPlateColorClass(plate.color)} border border-white/20`}
                  style={{
                    width: `${8 * plate.width}px`,
                    height: '20px',
                  }}
                  title={`${plate.weight} × ${plate.count}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
