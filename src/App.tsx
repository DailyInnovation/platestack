import { useState } from 'react';

import { usePlateCalculator } from './hooks/usePlateCalculator';
import { UnitToggle } from './components/UnitToggle';
import { WeightInput } from './components/WeightInput';
import { PlateButtons } from './components/PlateButtons';
import { BarbellGraphic } from './components/BarbellGraphic';
import { WarmupBuilder } from './components/WarmupBuilder';
import { SpecialtyBars } from './components/SpecialtyBars';
import { PercentageSelector } from './components/PercentageSelector';
import { MaxPlateSelector } from './components/MaxPlateSelector';
import { PremiumPaywall } from './components/PremiumPaywall';
import { LegalModal } from './components/LegalModal';
import { Dumbbell, Info } from 'lucide-react';

type LegalType = 'privacy' | 'terms' | 'contact' | null;

function App() {
  const [legalOpen, setLegalOpen] = useState<LegalType>(null);
  const [hintOpen, setHintOpen] = useState(false);

  const {
    unit,
    toggleUnit,
    targetWeight,
    setTargetWeight,
    manualAddPlate,
    manualAddCustomPlate,
    clearBar,
    barType,
    setBarType,
    customBarWeight,
    setCustomBarWeight,
    barbellConfig,
    platesPerSide,
    totalWeight,
    currentPlates,
    isPremiumUnlocked,
    unlockPremium,
    maxPlateConfig,
    setMaxPlateConfig,
  } = usePlateCalculator();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-start px-4 py-5 overflow-x-hidden">
      {/* Neon background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-neon-green/10 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-neon-cyan/10 rounded-full filter blur-3xl animate-pulse" />
      </div>

      <div className="relative w-full max-w-md space-y-4 animate-fade-in">
        {/* Header */}
        <div className="relative text-center mb-4">
          <button
            type="button"
            onClick={() => setHintOpen(v => !v)}
            className="absolute top-0 right-0 text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 rounded-full p-2 shadow-lg shadow-black/40 transition-colors"
            aria-label="Show usage hint"
          >
            <Info className="w-4 h-4" />
          </button>
          {hintOpen && (
            <div className="absolute top-10 right-0 z-10 w-72 rounded-2xl border border-slate-700 bg-slate-950/95 p-4 text-left shadow-2xl shadow-black/50">
              <p className="text-[11px] text-gray-400 mb-2 font-semibold">Quick Tip</p>
              <p className="text-xs text-gray-300 leading-relaxed mb-2">
                For faster access, add PlateStack to your home screen.
              </p>
              <p className="text-xs text-gray-300 leading-relaxed mb-2">
                The calculator always loads the nearest lower valid weight on the bar.
              </p>
              <p className="text-xs text-gray-300 leading-relaxed">
                If the smallest step is too small, use the custom plate button to add a custom increment.
              </p>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 mb-1">
            <Dumbbell className="w-6 h-6 text-neon-green" />
            <h1 className="text-2xl font-black bg-gradient-to-r from-neon-green via-emerald-400 to-neon-cyan bg-clip-text text-transparent">
              PlateStack
            </h1>
          </div>
          <p className="text-xs text-gray-500">Premium Plate Calculator</p>
        </div>

        <UnitToggle unit={unit} onToggle={toggleUnit} />

        <WeightInput value={targetWeight} onChange={setTargetWeight} unit={unit} />

        <BarbellGraphic
          platesPerSide={platesPerSide}
          barbellWeight={barbellConfig.weight}
          totalWeight={totalWeight}
          unit={unit}
        />

        <PlateButtons
          plates={currentPlates}
          onAddPlate={manualAddPlate}
          onAddCustomPlate={manualAddCustomPlate}
          onClearBar={clearBar}
          maxPlateConfig={maxPlateConfig}
        />

        <div className="mt-4 space-y-2">
          {/* Free feature */}
          <MaxPlateSelector
            maxPlateConfig={maxPlateConfig}
            onMaxPlateChange={setMaxPlateConfig}
            plates={currentPlates}
            unit={unit}
          />

          {/* Premium features */}
          <PremiumPaywall isUnlocked={isPremiumUnlocked} onUnlock={unlockPremium}>
            <div className="space-y-2">
              <WarmupBuilder
                targetWeight={targetWeight}
                barbellWeight={barbellConfig.weight}
                plates={currentPlates}
                unit={unit}
                maxPlateWeight={maxPlateConfig.enabled ? maxPlateConfig.maxPlateWeight : null}
              />
              <SpecialtyBars
                barType={barType}
                onBarTypeChange={setBarType}
                customBarWeight={customBarWeight}
                onCustomBarWeightChange={setCustomBarWeight}
                unit={unit}
              />
              <PercentageSelector
                targetWeight={targetWeight}
                barbellWeight={barbellConfig.weight}
                plates={currentPlates}
                unit={unit}
                maxPlateWeight={maxPlateConfig.enabled ? maxPlateConfig.maxPlateWeight : null}
              />
            </div>
          </PremiumPaywall>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-md mt-8 pb-4 flex items-center justify-center gap-4">
        <button
          onClick={() => setLegalOpen('privacy')}
          className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors"
        >
          Privacy Policy
        </button>
        <span className="text-gray-700 text-[10px]">·</span>
        <button
          onClick={() => setLegalOpen('terms')}
          className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors"
        >
          Terms of Use
        </button>
        <span className="text-gray-700 text-[10px]">·</span>
        <button
          onClick={() => setLegalOpen('contact')}
          className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors"
        >
          Contact
        </button>
      </div>

      {/* Legal modals */}
      {legalOpen && legalOpen !== 'contact' && (
        <LegalModal type={legalOpen} onClose={() => setLegalOpen(null)} />
      )}

      {/* Contact popup */}
      {legalOpen === 'contact' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={() => setLegalOpen(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl px-6 py-5 w-full max-w-xs text-center"
            onClick={e => e.stopPropagation()}
          >
            <p className="text-xs text-gray-400 mb-2">Have a question or feedback?</p>
            <a
              href="mailto:daily.innovation12@gmail.com"
              className="text-sm font-bold text-neon-green hover:text-emerald-400 transition-colors break-all"
            >
              daily.innovation12@gmail.com
            </a>
            <button
              onClick={() => setLegalOpen(null)}
              className="mt-4 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-400 text-xs font-semibold transition-all active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
