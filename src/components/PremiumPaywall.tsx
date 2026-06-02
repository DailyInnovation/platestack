import { ReactNode } from 'react';
import { Lock, Check, Sparkles } from 'lucide-react';

interface PremiumPaywallProps {
  isUnlocked: boolean;
  children: ReactNode;
}

export function PremiumPaywall({ isUnlocked, children }: PremiumPaywallProps) {

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Blurred content */}
      <div className="filter blur-sm pointer-events-none select-none opacity-60">
        {children}
      </div>

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-800/60 to-slate-900/70 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-2xl pointer-events-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 to-neon-cyan/5 rounded-xl pointer-events-none"></div>

        {/* Locked badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-700/50">
          <Lock className="w-3 h-3 text-neon-green" />
          <span className="text-[10px] font-bold text-gray-300">PRO PACK</span>
        </div>

        {/* Premium card */}
        <div className="absolute inset-0 flex items-center justify-center p-3">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700/50 shadow-2xl w-full max-w-xs">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-neon-cyan animate-pulse" />
              <h3 className="text-lg font-bold bg-gradient-to-r from-neon-green to-neon-cyan bg-clip-text text-transparent">
                Upgrade to Pro
              </h3>
            </div>

            <div className="text-center mb-3">
              <div className="text-2xl font-black text-white mb-1">
                Unlock Premium Features
              </div>
              <div className="text-3xl font-black bg-gradient-to-r from-neon-green to-emerald-400 bg-clip-text text-transparent">
                $3/month
              </div>
            </div>

            <div className="space-y-1 mb-3">
              {[
                'Automated warmup jumps',
                'Specialty bar support',
                'Percentage matrices',
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                  <div className="w-4 h-4 rounded-full bg-neon-green/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5 text-neon-green" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <a
              href="https://dailyinnovation12.lemonsqueezy.com/checkout/buy/b84ffec5-e864-46a0-a5e5-965310c96a43?embed=1"
              className="lemonsqueezy-button w-full py-2.5 px-4 rounded-lg font-bold text-sm transition-all shadow-lg bg-gradient-to-r from-neon-green to-emerald-500 hover:from-neon-green hover:to-emerald-400 text-slate-900 shadow-neon active:scale-95 text-center no-underline block"
            >
              Upgrade to Pro ($3/month)
            </a>

            <div className="mt-2 text-center">
              <span className="text-[10px] text-gray-500">
                Secure checkout by Lemon Squeezy
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
