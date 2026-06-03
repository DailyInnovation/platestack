import { useEffect } from 'react';
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
import { Dumbbell } from 'lucide-react';

function App() {
  useEffect(() => {
    if (window.createLemonSqueezy) {
      window.createLemonSqueezy();
    }
  }, []);

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
        <div className="text-center mb-4">
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
        <a
          href="/privacy"
          className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors"
        >
          Privacy Policy
        </a>
        <span className="text-gray-700 text-[10px]">·</span>
        <a
          href="/terms"
          className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors"
        >
          Terms of Use
        </a>
      </div>
    </div>
  );
}

export default App;
