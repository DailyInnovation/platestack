import { useState, useMemo } from 'react';
import { Flame, Trophy, Pencil, Check, Plus, Trash2, RotateCcw } from 'lucide-react';
import { PlateDenomination } from '../types';
import { generateWarmupSets } from '../utils/calculations';

interface WarmupBuilderProps {
  targetWeight: string;
  barbellWeight: number;
  plates: PlateDenomination[];
  unit: 'kg' | 'lbs';
  maxPlateWeight?: number | null;
}

interface ProtocolRow {
  percentage: number;
  reps: number;
}

const DEFAULT_PROTOCOL: ProtocolRow[] = [
  { percentage: 50, reps: 5 },
  { percentage: 65, reps: 3 },
  { percentage: 80, reps: 2 },
  { percentage: 90, reps: 1 },
];

const STORAGE_KEY = 'platestack_warmup_protocol';

function loadProtocol(): ProtocolRow[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_PROTOCOL;
}

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

const SET_COLORS = [
  'from-sky-600 to-sky-800',
  'from-amber-500 to-amber-700',
  'from-orange-500 to-red-600',
  'from-red-600 to-red-800',
  'from-rose-700 to-rose-900',
  'from-purple-600 to-purple-800',
];

export function WarmupBuilder({ targetWeight, barbellWeight, plates, unit, maxPlateWeight }: WarmupBuilderProps) {
  const [protocol, setProtocol] = useState<ProtocolRow[]>(loadProtocol);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ProtocolRow[]>([]);

  const topSetWeight = parseFloat(targetWeight) || 0;
  const hasTarget = topSetWeight > 0;

  const warmupSets = useMemo(() => {
    if (!hasTarget) return [];
    return generateWarmupSets(topSetWeight, barbellWeight, plates, protocol, maxPlateWeight);
  }, [topSetWeight, barbellWeight, plates, protocol, maxPlateWeight]);

  const startEdit = () => {
    setDraft(protocol.map(r => ({ ...r })));
    setEditing(true);
  };

  const saveEdit = () => {
    const valid = draft
      .map(r => ({
        percentage: Math.min(100, Math.max(1, r.percentage)),
        reps: Math.min(20, Math.max(1, r.reps)),
      }))
      .sort((a, b) => a.percentage - b.percentage);
    setProtocol(valid);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(valid));
    setEditing(false);
  };

  const cancelEdit = () => setEditing(false);

  const updateDraft = (idx: number, field: keyof ProtocolRow, value: number) => {
    setDraft(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r));
  };

  const addRow = () => {
    if (draft.length >= 6) return;
    const lastPct = draft[draft.length - 1]?.percentage ?? 80;
    setDraft(prev => [...prev, { percentage: Math.min(100, lastPct + 5), reps: 1 }]);
  };

  const removeRow = (idx: number) => {
    if (draft.length <= 1) return;
    setDraft(prev => prev.filter((_, i) => i !== idx));
  };

  const resetDefaults = () => setDraft(DEFAULT_PROTOCOL.map(r => ({ ...r })));

  if (!hasTarget) {
    return (
      <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-500" />
          <h3 className="text-sm font-bold text-white">Warmup Builder</h3>
        </div>
        <p className="text-xs text-gray-500 mt-2">Enter a target weight to generate your warmup sets</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-500" />
          <h3 className="text-sm font-bold text-white">Warmup Builder</h3>
        </div>
        {!editing ? (
          <button
            onClick={startEdit}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-neon-cyan transition-colors px-2 py-1 rounded hover:bg-slate-700"
          >
            <Pencil className="w-3 h-3" />
            Edit
          </button>
        ) : (
          <div className="flex items-center gap-1">
            <button
              onClick={resetDefaults}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors px-2 py-1 rounded hover:bg-slate-700"
              title="Reset to defaults"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
            <button
              onClick={cancelEdit}
              className="text-xs text-gray-400 hover:text-gray-200 px-2 py-1 rounded hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveEdit}
              className="flex items-center gap-1 text-xs font-bold text-neon-green px-2 py-1 rounded bg-neon-green/10 hover:bg-neon-green/20 transition-colors"
            >
              <Check className="w-3 h-3" />
              Save
            </button>
          </div>
        )}
      </div>

      {/* Edit mode */}
      {editing && (
        <div className="space-y-2">
          <div className="grid grid-cols-[1fr_1fr_auto] gap-2 text-[10px] text-gray-500 uppercase tracking-wide px-1">
            <span>% of target</span>
            <span>Reps</span>
            <span></span>
          </div>
          {draft.map((row, idx) => (
            <div key={idx} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-600 rounded-lg px-2 py-1.5">
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={row.percentage}
                  onChange={e => updateDraft(idx, 'percentage', parseInt(e.target.value) || 1)}
                  className="w-full bg-transparent text-sm font-bold text-neon-cyan focus:outline-none"
                />
                <span className="text-xs text-gray-500 flex-shrink-0">%</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-600 rounded-lg px-2 py-1.5">
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={row.reps}
                  onChange={e => updateDraft(idx, 'reps', parseInt(e.target.value) || 1)}
                  className="w-full bg-transparent text-sm font-bold text-white focus:outline-none"
                />
                <span className="text-xs text-gray-500 flex-shrink-0">reps</span>
              </div>
              <button
                onClick={() => removeRow(idx)}
                disabled={draft.length <= 1}
                className="p-1.5 rounded text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {draft.length < 6 && (
            <button
              onClick={addRow}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-dashed border-slate-600 text-xs text-gray-500 hover:text-gray-300 hover:border-slate-500 transition-colors"
            >
              <Plus className="w-3 h-3" />
              Add set
            </button>
          )}
        </div>
      )}

      {/* View mode — warmup sets */}
      {!editing && (
        <div className="space-y-2">
          {warmupSets.map((set, idx) => {
            const colorClass = SET_COLORS[Math.min(idx, SET_COLORS.length - 1)];
            return (
              <div key={idx} className="bg-slate-900/60 rounded-lg p-2.5 flex items-center gap-3">
                {/* Badge */}
                <div className={`w-11 h-11 rounded-lg bg-gradient-to-br ${colorClass} flex flex-col items-center justify-center flex-shrink-0 shadow`}>
                  <span className="text-[11px] font-black text-white leading-none">{set.percentage}%</span>
                  <span className="text-[9px] text-white/70 mt-0.5">{set.reps} rep{set.reps !== 1 ? 's' : ''}</span>
                </div>

                {/* Weight */}
                <div className="flex-1 min-w-0">
                  <div className="text-base font-black text-white leading-tight">
                    {set.weight} <span className="text-xs text-gray-400 font-normal">{unit}</span>
                  </div>
                  {set.plates.length > 0 ? (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {set.plates.map((plate, pIdx) => (
                        <span key={pIdx} className="text-[9px] bg-slate-800 border border-slate-700 rounded px-1 py-0.5 text-gray-400">
                          {plate.weight}×{plate.count}
                        </span>
                      ))}
                    </div>
                  ) : (
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
            );
          })}

          {/* Top Set */}
          <div className="bg-gradient-to-r from-neon-green/10 to-emerald-500/10 border border-neon-green/30 rounded-lg p-2.5 flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-neon-green to-emerald-600 flex flex-col items-center justify-center flex-shrink-0 shadow shadow-neon-green/20">
              <Trophy className="w-4 h-4 text-slate-900" />
              <span className="text-[9px] font-black text-slate-900 mt-0.5">TOP</span>
            </div>
            <div className="flex-1">
              <div className="text-base font-black text-white leading-tight">
                {topSetWeight} <span className="text-xs text-gray-400 font-normal">{unit}</span>
              </div>
              <span className="text-[9px] text-gray-500">100% — rest 3–5 min after final warmup</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
