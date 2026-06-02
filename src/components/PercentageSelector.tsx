import { useState, useMemo } from 'react';
import { Percent } from 'lucide-react';
import { PlateDenomination, LoadedPlate } from '../types';
import { calculatePlatesPerSide } from '../utils/calculations';

interface PercentageSelectorProps {
  targetWeight: string;
  barbellWeight: number;
  plates: PlateDenomination[];
  unit: 'kg' | 'lbs';
  maxPlateWeight?: number | null;
}

function MiniBarbell({ platesPerSide, unit }: { platesPerSide: LoadedPlate[]; unit: string }) {
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

  const isEmpty = platesPerSide.length === 0;

  return (
    <div className="relative bg-slate-950 rounded-xl p-3 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 via-transparent to-neon-green/5" />
      <div className="relative flex items-center justify-center gap-1">
        {/* Left plates */}
        <div className="flex items-center justify-end" style={{ minWidth: '72px' }}>
          {[...platesPerSide].reverse().map((plate, idx) => {
            const elements = [];
            for (let i = 0; i < plate.count; i++) {
              elements.push(
                <div
                  key={`L-${plate.weight}-${idx}-${i}`}
                  className={`rounded-sm border-2 ${getColorClass(plate.color)} shadow-lg transition-all duration-300`}
                  style={{
                    height: `${Math.min(40 + plate.weight * 0.6, 56)}px`,
                    width: `${10 * plate.width}px`,
                    marginRight: '2px',
                  }}
                />
              );
            }
            return elements;
          })}
        </div>

        {/* Left sleeve */}
        <div className="h-5 w-10 bg-gradient-to-r from-gray-600 to-gray-500 rounded-l border-2 border-gray-400 shadow-inner flex items-center">
          <div className="w-1.5 h-3 bg-gray-700 ml-1 rounded" />
        </div>

        {/* Bar */}
        <div className="h-2.5 w-16 bg-gradient-to-b from-gray-500 to-gray-700 rounded-full border border-gray-400 shadow-lg relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />
        </div>

        {/* Right sleeve */}
        <div className="h-5 w-10 bg-gradient-to-l from-gray-600 to-gray-500 rounded-r border-2 border-gray-400 shadow-inner flex items-center justify-end">
          <div className="w-1.5 h-3 bg-gray-700 mr-1 rounded" />
        </div>

        {/* Right plates */}
        <div className="flex items-center justify-start" style={{ minWidth: '72px' }}>
          {platesPerSide.map((plate, idx) => {
            const elements = [];
            for (let i = 0; i < plate.count; i++) {
              elements.push(
                <div
                  key={`R-${plate.weight}-${idx}-${i}`}
                  className={`rounded-sm border-2 ${getColorClass(plate.color)} shadow-lg transition-all duration-300`}
                  style={{
                    height: `${Math.min(40 + plate.weight * 0.6, 56)}px`,
                    width: `${10 * plate.width}px`,
                    marginLeft: '2px',
                  }}
                />
              );
            }
            return elements;
          })}
        </div>
      </div>

      {isEmpty && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-gray-600 font-medium">Empty Bar</span>
        </div>
      )}

      {/* Plate legend */}
      {platesPerSide.length > 0 && (
        <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
          {platesPerSide.map((plate) => (
            <div key={plate.weight} className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded text-xs">
              <span className="text-gray-300 font-semibold">{plate.weight} {unit}</span>
              <span className="text-gray-500">×</span>
              <span className="text-neon-cyan font-bold">{plate.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function PercentageSelector({
  targetWeight,
  barbellWeight,
  plates,
  unit,
  maxPlateWeight,
}: PercentageSelectorProps) {
  const [percentage, setPercentage] = useState<number>(80);

  const result = useMemo(() => {
    const tw = parseFloat(targetWeight);
    if (!tw) return null;
    const weight = Math.round((tw * (percentage / 100)) / 2.5) * 2.5;
    const perSide = calculatePlatesPerSide(weight, barbellWeight, plates, maxPlateWeight);
    return { weight, perSide };
  }, [targetWeight, percentage, barbellWeight, plates, maxPlateWeight]);

  const hasTarget = !!parseFloat(targetWeight);

  return (
    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 space-y-3">
      <div className="flex items-center gap-2">
        <Percent className="w-4 h-4 text-neon-cyan" />
        <h3 className="text-sm font-bold text-white">Percentage Calculator</h3>
      </div>

      {!hasTarget ? (
        <p className="text-xs text-gray-500">Enter a target weight to use the percentage calculator</p>
      ) : (
        <>
          {/* Slider + display */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Percentage of target</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={percentage}
                  onChange={(e) => {
                    const v = Math.min(100, Math.max(1, parseInt(e.target.value) || 1));
                    setPercentage(v);
                  }}
                  className="w-14 text-center bg-slate-900 border border-slate-600 rounded px-1 py-0.5 text-sm font-bold text-neon-cyan focus:outline-none focus:border-neon-cyan"
                />
                <span className="text-sm font-bold text-neon-cyan">%</span>
              </div>
            </div>

            <input
              type="range"
              min={1}
              max={100}
              value={percentage}
              onChange={(e) => setPercentage(parseInt(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #00ff88 0%, #00ff88 ${percentage}%, #334155 ${percentage}%, #334155 100%)`,
              }}
            />

            <div className="flex justify-between text-xs text-gray-600">
              <span>1%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-slate-900/60 rounded-lg px-3 py-2">
                <div>
                  <div className="text-xs text-gray-400">{percentage}% of {parseFloat(targetWeight)} {unit}</div>
                  <div className="text-xl font-black text-white">
                    {result.weight} <span className="text-sm text-gray-400">{unit.toUpperCase()}</span>
                  </div>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <div>Bar: {barbellWeight} {unit}</div>
                </div>
              </div>

              <MiniBarbell platesPerSide={result.perSide} unit={unit} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
