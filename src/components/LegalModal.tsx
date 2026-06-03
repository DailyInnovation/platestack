import { useEffect } from 'react';
import { X } from 'lucide-react';

type LegalType = 'privacy' | 'terms';

interface LegalModalProps {
  type: LegalType;
  onClose: () => void;
}

const PRIVACY_CONTENT = {
  title: 'Privacy Policy',
  lastUpdated: 'June 3, 2026',
  sections: [
    {
      heading: 'Information We Collect',
      body: `PlateStack does not collect, transmit, or store any personal information on external servers. All preferences (unit system, max plate settings, bar type) are saved locally on your device using your browser's localStorage and never leave your device.`,
    },
    {
      heading: 'Premium License',
      body: `When you purchase a Pro license, your transaction is handled entirely by Lemon Squeezy. PlateStack receives only a license key activation confirmation. We do not store your payment details, email address, or billing information.`,
    },
    {
      heading: 'Analytics & Tracking',
      body: `PlateStack does not use cookies, analytics trackers, or any third-party data collection services. No usage data, session data, or behavioral data is recorded.`,
    },
    {
      heading: 'Third-Party Services',
      body: `The app integrates with Lemon Squeezy solely for payment processing and license key validation. Please review Lemon Squeezy's own privacy policy at lemonsqueezy.com for information on how they handle your purchase data.`,
    },
    {
      heading: 'Data Retention',
      body: `Since all data is stored locally on your device, you can remove it at any time by clearing your browser's site data or localStorage. Uninstalling or clearing the app removes all stored preferences permanently.`,
    },
    {
      heading: "Children's Privacy",
      body: `PlateStack is not directed at children under the age of 13. We do not knowingly collect information from children.`,
    },
    {
      heading: 'Changes to This Policy',
      body: `We may update this Privacy Policy from time to time. Updates will be reflected with a revised "Last Updated" date. Continued use of the app after changes constitutes acceptance of the updated policy.`,
    },
    {
      heading: 'Contact',
      body: `If you have questions about this Privacy Policy, please reach out via the contact information listed on our website.`,
    },
  ],
};

const TERMS_CONTENT = {
  title: 'Terms of Use',
  lastUpdated: 'June 3, 2026',
  sections: [
    {
      heading: 'Acceptance of Terms',
      body: `By using PlateStack, you agree to these Terms of Use. If you do not agree, please do not use the app.`,
    },
    {
      heading: 'Use of the App',
      body: `PlateStack is a barbell plate calculator intended for personal, non-commercial use. You may not reproduce, distribute, modify, or create derivative works of any part of the app without written permission.`,
    },
    {
      heading: 'Pro License',
      body: `Purchasing a Pro license grants you a personal, non-transferable right to use the premium features. Licenses may not be shared, resold, or transferred to another person or device without authorization. Violation of this may result in license revocation.`,
    },
    {
      heading: 'Disclaimer of Warranties',
      body: `PlateStack is provided "as is" without warranties of any kind, express or implied. We do not guarantee that the app will be error-free, uninterrupted, or suitable for any particular purpose. Weight calculations are provided for reference only — always verify loads independently before training.`,
    },
    {
      heading: 'Limitation of Liability',
      body: `To the maximum extent permitted by law, PlateStack and its developers shall not be liable for any indirect, incidental, special, or consequential damages arising out of or related to your use of the app, including but not limited to injury, data loss, or financial loss.`,
    },
    {
      heading: 'Modifications',
      body: `We reserve the right to modify or discontinue the app (or any part of it) at any time. We may also update these Terms at any time. Continued use of the app after changes means you accept the updated Terms.`,
    },
    {
      heading: 'Governing Law',
      body: `These Terms are governed by applicable law. Any disputes arising from these Terms shall be resolved in the appropriate jurisdiction.`,
    },
    {
      heading: 'Contact',
      body: `For questions about these Terms, please contact us via the information provided on our website.`,
    },
  ],
};

export function LegalModal({ type, onClose }: LegalModalProps) {
  const content = type === 'privacy' ? PRIVACY_CONTENT : TERMS_CONTENT;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Paper */}
      <div
        className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-800 flex-shrink-0">
          <div>
            <h2 className="text-base font-black text-white">{content.title}</h2>
            <p className="text-[10px] text-gray-500 mt-0.5">Last updated: {content.lastUpdated}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-slate-800 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-5 py-4 space-y-5 flex-1">
          {content.sections.map(({ heading, body }) => (
            <div key={heading}>
              <h3 className="text-xs font-bold text-neon-green mb-1">{heading}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{body}</p>
            </div>
          ))}
          <div className="h-2" />
        </div>

        {/* Footer close strip */}
        <div className="px-5 py-3 border-t border-slate-800 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-300 text-xs font-semibold transition-all active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
