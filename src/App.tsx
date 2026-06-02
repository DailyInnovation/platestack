import { useEffect } from 'react';
import { usePlateCalculator } from './hooks/usePlateCalculator';
import { UnitToggle } from './components/UnitToggle';
import { WeightInput } from './components/WeightInput';
import { PlateButtons } from './components/PlateButtons';
import { BarbellGraphic } from './components/BarbellGraphic';
import { WarmupBuilder } from './components/WarmupBuilder';
import { SpecialtyBars } from './components/SpecialtyBars';
import { PercentageMatrix } from './components/PercentageMatrix';
import { PremiumPaywall } from './components/PremiumPaywall';
import { MaxPlateSelector } from './components/MaxPlateSelector';
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
    manualPlates,
    manualAddPlate,
    clearBar,
    barType,
    setBarType,
    customBarWeight,
    setCustomBarWeight,
    barbellConfig,
    platesPerSide,
    totalWeight,
    currentPlates,
    warmupSets,
    percentageMatrix,
    isPremiumUnlocked,
    unlockPremium,
    maxPlateConfig,
    setMaxPlateConfig,
  } = usePlateCalculator();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-start px-4 py-5 overflow-x-hidden">
      {/* Neon background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-neon-green/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-neon-cyan/10 rounded-full filter blur-3xl animate-pulse"></div>
      </div>

      {/* Header */}
      <div className="relative w-full max-w-md space-y-4 animate-fade-in">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Dumbbell className="w-6 h-6 text-neon-green" />
            <h1 className="text-2xl font-black bg-gradient-to-r from-neon-green via-emerald-400 to-neon-cyan bg-clip-text text-transparent">
              PlateStack
            </h1>
          </div>
          <p className="text-xs text-gray-500">Premium Plate Calculator</p>
        </div>

        {/* Unit Toggle */}
        <UnitToggle unit={unit} onToggle={toggleUnit} />

        {/* Weight Input */}
        <WeightInput value={targetWeight} onChange={setTargetWeight} unit={unit} />

        {/* Barbell Graphic */}
        <BarbellGraphic
          platesPerSide={platesPerSide}
          barbellWeight={barbellConfig.weight}
          totalWeight={totalWeight}
          unit={unit}
        />

        {/* Plate Buttons */}
        <PlateButtons
          plates={currentPlates}
          onAddPlate={manualAddPlate}
          onClearBar={clearBar}
          maxPlateConfig={maxPlateConfig}
        />

        {/* Premium Features Section */}
        <div className="mt-4 space-y-2">
          <MaxPlateSelector
            maxPlateConfig={maxPlateConfig}
            onMaxPlateChange={setMaxPlateConfig}
            plates={currentPlates}
            unit={unit}
          />
          <PremiumPaywall isUnlocked={isPremiumUnlocked}>
            <div className="space-y-2">
              <WarmupBuilder warmupSets={warmupSets} unit={unit} />
              <SpecialtyBars
                barType={barType}
                onBarTypeChange={setBarType}
                customBarWeight={customBarWeight}
                onCustomBarWeightChange={setCustomBarWeight}
                unit={unit}
              />
              <PercentageMatrix percentageRows={percentageMatrix} unit={unit} />
            </div>
          </PremiumPaywall>
        </div>
      </div>
    </div>
  );
}

export default App;