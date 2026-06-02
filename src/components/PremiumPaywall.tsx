import { ReactNode } from 'react';
import { Lock, Check, Zap, Flame, SlidersHorizontal, Percent } from 'lucide-react';

interface PremiumPaywallProps {
  isUnlocked: boolean;
  children: ReactNode;
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

export function PremiumPaywall({ isUnlocked, children }: PremiumPaywallProps) {
  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Blurred preview of content behind */}
      <div className="filter blur-sm pointer-events-none select-none opacity-50">
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 rounded-xl pointer-events-auto overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />

        {/* Subtle gradient border */}
        <div className="absolute inset-0 rounded-xl ring-1 ring-white/10" />

        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-green/60 to-transparent" />

        {/* Card content */}
        <div className="relative flex flex-col items-center justify-center h-full px-4 py-5 text-center">
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

          <p className="text-[10px] text-gray-600 mt-2.5">
            Secure checkout · Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
