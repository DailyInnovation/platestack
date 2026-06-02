import { PercentageRow } from '../types';
import { Grid3X3 } from 'lucide-react';

interface PercentageMatrixProps {
  percentageRows: PercentageRow[];
  unit: 'kg' | 'lbs';
}

export function PercentageMatrix({ percentageRows, unit }: PercentageMatrixProps) {
  if (percentageRows.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
        <div className="flex items-center gap-2 mb-2">
          <Grid3X3 className="w-4 h-4 text-purple-500" />
          <h3 className="text-sm font-bold text-white">Percentage Matrix</h3>
        </div>
        <p className="text-xs text-gray-500">Enter target weight to see percentage breakdown</p>
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
        <Grid3X3 className="w-4 h-4 text-purple-500" />
        <h3 className="text-sm font-bold text-white">Percentage Matrix</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-400 border-b border-slate-700">
              <th className="text-left pb-2 font-semibold">%</th>
              <th className="text-left pb-2 font-semibold">Weight</th>
              <th className="text-left pb-2 font-semibold">Plates</th>
            </tr>
          </thead>
          <tbody>
            {percentageRows.map((row, idx) => (
              <tr key={idx} className="border-b border-slate-800/50 last:border-0">
                <td className="py-2">
                  <span className="font-bold text-neon-cyan">{row.percentage}%</span>
                </td>
                <td className="py-2">
                  <span className="font-semibold text-white">{row.weight} {unit}</span>
                </td>
                <td className="py-2">
                  <div className="flex items-center gap-1">
                    {row.plates.map((plate, pIdx) => (
                      <div
                        key={pIdx}
                        className={`rounded-sm ${getPlateColorClass(plate.color)} border border-white/20`}
                        style={{
                          width: `${8 * plate.width}px`,
                          height: '18px',
                        }}
                        title={`${plate.weight} × ${plate.count}`}
                      />
                    ))}
                    {row.plates.length === 0 && (
                      <span className="text-gray-600">—</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
