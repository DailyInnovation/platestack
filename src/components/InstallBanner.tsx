import { useState, useEffect } from 'react';
import { Download, Share, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'platestack_install_dismissed';

export function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISSED_KEY)) return;

    // Detect iOS Safari (no beforeinstallprompt, needs manual instructions)
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as any).MSStream;
    const standalone = (window.navigator as any).standalone === true;
    if (ios && !standalone) {
      setIsIOS(true);
      setVisible(true);
      return;
    }

    // Chrome / Android / desktop — capture the native prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, '1');
    setVisible(false);
  };

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setVisible(false);
    setDeferredPrompt(null);
  };

  if (!visible) return null;

  return (
    <div className="w-full max-w-md mb-3 flex items-center gap-3 bg-slate-800/70 border border-slate-700 rounded-xl px-3 py-2.5">
      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-neon-green/15 border border-neon-green/20 flex-shrink-0">
        {isIOS ? (
          <Share className="w-3.5 h-3.5 text-neon-green" />
        ) : (
          <Download className="w-3.5 h-3.5 text-neon-green" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        {isIOS ? (
          <p className="text-[10px] text-gray-400 leading-snug">
            Tap <span className="text-white font-semibold">Share</span> then{' '}
            <span className="text-white font-semibold">Add to Home Screen</span> for offline access
          </p>
        ) : (
          <p className="text-[10px] text-gray-400 leading-snug">
            <span className="text-white font-semibold">Install PlateStack</span> for instant offline access
          </p>
        )}
      </div>

      {!isIOS && (
        <button
          onClick={install}
          className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-neon-green/15 border border-neon-green/30 text-neon-green text-[10px] font-bold hover:bg-neon-green/25 transition-all active:scale-95"
        >
          Install
        </button>
      )}

      <button
        onClick={dismiss}
        className="flex-shrink-0 text-gray-600 hover:text-gray-400 transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
