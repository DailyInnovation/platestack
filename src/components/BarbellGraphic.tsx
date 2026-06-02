import { LoadedPlate } from '../types';
import { useMemo } from 'react';

interface BarbellGraphicProps {
  platesPerSide: LoadedPlate[];
  barbellWeight: number;
  totalWeight: number;
  unit: 'kg' | 'lbs';
}

export function BarbellGraphic({ platesPerSide, barbellWeight, totalWeight, unit }: BarbellGraphicProps) {
  const getColorClass = (color: string): string => {
    const colorMap: Record<string, string> = {
      'plate-red': 'bg-gradient-to-b from-red-600 to-red-800 border-red-400',
      'plate-blue': 'bg-gradient-to-b from-blue-600 to-blue-800 border-blue-400',
      'plate-yellow': 'bg-gradient-to-b from-yellow-400 to-yellow-600 border-yellow-300',
      'plate-green': 'bg-gradient-to-b from-green-600 to-green-800 border-green-400',
      'plate-white': 'bg-gradient-to-b from-gray-100 to-gray-300 border-gray-400',
      'plate-black': 'bg-gradient-to-b from-slate-800 to-slate-950 border-slate-700',
      'plate-silver': 'bg-gradient-to-b from-gray-300 to-gray-500 border-gray-400',
    };
    return colorMap[color] || 'bg-gray-500 border-gray-400';
  };

  const totalPlateCount = useMemo(() => {
    return platesPerSide.reduce((sum, plate) => sum + plate.count, 0);
  }, [platesPerSide]);

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 bg-gradient-to-b from-neon-green to-emerald-600 rounded-full"></div>
          <div>
            <div className="text-xs text-gray-400">Total Weight</div>
            <div className="text-xl font-bold text-white">
              {totalWeight} <span className="text-sm text-gray-400">{unit.toUpperCase()}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">Bar</div>
          <div className="text-sm font-semibold text-gray-300">{barbellWeight} {unit}</div>
        </div>
      </div>

      <div className="relative bg-slate-950 rounded-xl p-3 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-green/5 via-transparent to-neon-cyan/5"></div>

        <div className="relative flex items-center justify-center gap-1">
          {/* Left plates */}
          <div className="flex items-center justify-end" style={{ minWidth: '80px' }}>
            {[...platesPerSide].reverse().map((plate, idx) => {
              const elements = [];
              for (let i = 0; i < plate.count; i++) {
                elements.push(
                  <div
                    key={`${plate.weight}-${idx}-${i}`}
                    className={`rounded-sm border-2 ${getColorClass(plate.color)} shadow-lg transition-all duration-300 animate-slide-up`}
                    style={{
                      height: `${Math.min(48 + plate.weight * 0.8, 64)}px`,
                      width: `${12 * plate.width}px`,
                      marginRight: '2px',
                    }}
                  />
                );
              }
              return elements;
            })}
          </div>

          {/* Left sleeve */}
          <div className="h-6 w-12 bg-gradient-to-r from-gray-600 to-gray-500 rounded-l border-2 border-gray-400 shadow-inner flex items-center">
            <div className="w-2 h-4 bg-gray-700 ml-1.5 rounded"></div>
          </div>

          {/* Bar */}
          <div className="h-3 w-20 bg-gradient-to-b from-gray-500 to-gray-700 rounded-full border border-gray-400 shadow-lg relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"></div>
          </div>

          {/* Right sleeve */}
          <div className="h-6 w-12 bg-gradient-to-l from-gray-600 to-gray-500 rounded-r border-2 border-gray-400 shadow-inner flex items-center justify-end">
            <div className="w-2 h-4 bg-gray-700 mr-1.5 rounded"></div>
          </div>

          {/* Right plates */}
          <div className="flex items-center justify-start" style={{ minWidth: '80px' }}>
            {platesPerSide.map((plate, idx) => {
              const elements = [];
              for (let i = 0; i < plate.count; i++) {
                elements.push(
                  <div
                    key={`${plate.weight}-${idx}-r-${i}`}
                    className={`rounded-sm border-2 ${getColorClass(plate.color)} shadow-lg transition-all duration-300 animate-slide-up`}
                    style={{
                      height: `${Math.min(48 + plate.weight * 0.8, 64)}px`,
                      width: `${12 * plate.width}px`,
                      marginLeft: '2px',
                    }}
                  />
                );
              }
              return elements;
            })}
          </div>
        </div>

        {totalPlateCount === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-xs text-gray-600 font-medium">Empty Bar</div>
          </div>
        )}
      </div>

      {platesPerSide.length > 0 && (
        <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
          {platesPerSide.map((plate) => (
            <div key={plate.weight} className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded text-xs">
              <span className="text-gray-300 font-semibold">
                {plate.weight} {unit}
              </span>
              <span className="text-gray-500">×</span>
              <span className="text-neon-green font-bold">{plate.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
