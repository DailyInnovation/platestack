import { ReactNode, useState, useRef, useEffect } from 'react';
import { Lock, Check, Zap, Flame, SlidersHorizontal, Percent, Key, Loader2, Info } from 'lucide-react';

interface PremiumPaywallProps {
  isUnlocked: boolean;
  children: ReactNode;
  onUnlock: () => void;
}

const FEATURES = [
  {
    icon: Flame,
    title: 'Smart Warmup Builder',
    desc: 'Auto-generates warmup sets with a fully editable protocol',
  },
  {
    icon: SlidersHorizontal,
    title: 'Specialty Bar Support',
    desc: 'Technique, squat, and custom bar weights',
  },
  {
    icon: Percent,
    title: 'Dynamic % Calculator',
    desc: 'Slide to any % — see exact plates on a live barbell',
  },
];

export function PremiumPaywall({ isUnlocked, children, onUnlock }: PremiumPaywallProps) {
  const [licenseKey, setLicenseKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showInfo) return;
    const handler = (e: MouseEvent) => {
      if (infoRef.current && !infoRef.current.contains(e.target as Node)) {
        setShowInfo(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showInfo]);

  if (isUnlocked) {
    return <>{children}</>;
  }

  const handleActivate = async () => {
    const key = licenseKey.trim();
    if (!key) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('https://api.lemonsqueezy.com/v1/licenses/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ license_key: key, instance_name: 'PlateStack' }),
      });
      const data = await res.json();
      if (data.activated || data.license_key?.status === 'active') {
        onUnlock();
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Invalid or expired license key.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Could not verify key. Check your connection.');
    }
  };

  return (
    <div className="relative min-h-[600px]">
      {/* Blurred preview of content behind */}
      <div className="filter blur-sm pointer-events-none select-none opacity-50">
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 rounded-xl pointer-events-auto overflow-y-auto">
        {/* Background */}
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />

        {/* Subtle gradient border */}
        <div className="absolute inset-0 rounded-xl ring-1 ring-white/10" />

        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-green/60 to-transparent" />

        {/* Card content */}
        <div className="relative flex flex-col items-center justify-center min-h-full px-4 py-5 text-center">
          {/* Lock badge */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 rounded-full px-3 py-1 mb-4">
            <Lock className="w-3 h-3 text-neon-green" />
            <span className="text-[10px] font-black tracking-widest text-gray-300 uppercase">Pro Features</span>
          </div>

          {/* Headline */}
          <h3 className="text-xl font-black text-white mb-0.5 leading-tight">
            Train Smarter
          </h3>
          <p className="text-xs text-gray-500 mb-4 max-w-[220px]">
            Unlock the full toolkit — warmup protocols, specialty bars, and live plate previews.
          </p>

          {/* Feature list */}
          <div className="w-full max-w-[260px] space-y-2 mb-5">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-2.5 text-left">
                <div className="w-6 h-6 rounded-md bg-neon-green/15 border border-neon-green/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-3 h-3 text-neon-green" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight">{title}</div>
                  <div className="text-[10px] text-gray-500 leading-tight">{desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <a
            href="https://dailyinnovation12.lemonsqueezy.com/checkout/buy/b84ffec5-e864-46a0-a5e5-965310c96a43?embed=1"
            className="lemonsqueezy-button w-full max-w-[260px] flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-black text-sm text-slate-900 bg-gradient-to-r from-neon-green to-emerald-400 hover:from-emerald-400 hover:to-neon-green active:scale-95 transition-all shadow-lg shadow-neon-green/20 no-underline"
          >
            <Zap className="w-4 h-4" />
            Unlock Pro — $3/month
          </a>

          <p className="text-[10px] text-gray-600 mt-2 mb-4">
            Secure checkout · Cancel anytime
          </p>

          {/* License key input */}
          <div className="w-full max-w-[260px]">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Key className="w-3 h-3 text-gray-500" />
              <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Already have a key?</span>
              {/* Info icon + tooltip */}
              <div className="relative ml-auto" ref={infoRef}>
                <button
                  onClick={() => setShowInfo(v => !v)}
                  className="w-4 h-4 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-300 transition-colors"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
                {showInfo && (
                  <div className="absolute bottom-full right-0 mb-2 w-52 bg-slate-800 border border-slate-600 rounded-xl shadow-xl p-3 text-left z-10">
                    <div className="absolute bottom-[-5px] right-2 w-2.5 h-2.5 bg-slate-800 border-r border-b border-slate-600 rotate-45" />
                    <p className="text-[10px] text-gray-300 leading-relaxed">
                      After subscribing, <span className="text-neon-green font-semibold">Lemon Squeezy will email you a license key.</span> Paste it here and tap Apply — you only need to do this once. Your access is saved to this device automatically.
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={licenseKey}
                onChange={e => { setLicenseKey(e.target.value); setStatus('idle'); setErrorMsg(''); }}
                onKeyDown={e => e.key === 'Enter' && handleActivate()}
                placeholder="Paste license key…"
                className="flex-1 min-w-0 px-2.5 py-2 rounded-lg border border-slate-700 bg-slate-900 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-neon-green/60 transition-colors"
              />
              <button
                onClick={handleActivate}
                disabled={status === 'loading' || !licenseKey.trim()}
                className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 hover:border-neon-green/50 text-neon-green text-xs font-bold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                {status === 'loading' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                Apply
              </button>
            </div>
            {status === 'error' && (
              <p className="text-[10px] text-red-400 mt-1 text-left">{errorMsg}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
