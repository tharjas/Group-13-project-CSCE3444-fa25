// src/App.jsx
// Main application component for ClearColor Picker
// Manages state for current color, palette, saved palettes, and various modals/views
import React, { useState, useEffect } from 'react';
import ColorWheel from './components/ColorWheel';
import ColorInputs from './components/ColorInputs';
import PaletteManager from './components/PaletteManager';
import ExportOptions from './components/ExportOptions';
import Favorites from './components/Favorites';
import SavedPalettes from './components/SavedPalettes';
import ColorBlindnessSimulator from './components/ColorBlindnessSimulator';
import UIMockups from './components/UIMockups';
import ContrastChecker from './components/ContrastChecker';
import ColorMixingLab from './components/ColorMixingLab';
import ColorSchemeInfo from './components/ColorSchemeInfo';
import LiveContrastViewer from './components/LiveContrastViewer';
import LeftMenu from './components/LeftMenu';
import RightMenu from './components/RightMenu';
import AdditiveColorChallenge from './components/colorChallenge/AdditiveColorChallenge';
import AccessibilityViewer from './components/Accessibility/AccessibilityViewer';
import ColorDecomposition from './components/ColorDecomposition/ColorDecomposition.jsx';
import ColorSchemeWheel from './components/ColorScheme/ColorSchemeWheel.jsx';
import ColorHistory from './components/ColorHistory.jsx';

function App() {
  const [color, setColor] = useState('#ffffff');
  // Wrapper for global color updates
const updateColor = (hex) => {
  console.log("Adding to history:", hex);
  setColor(hex);
  addColorToHistory(hex);   // <-- update history here
};

  const [palette, setPalette] = useState([]);
  const [savedPalettes, setSavedPalettes] = useState([]);
  const [selectedPaletteForSimulation, setSelectedPaletteForSimulation] = useState(null);
  const [showUIMockups, setShowUIMockups] = useState(null);
  const [showContrastChecker, setShowContrastChecker] = useState(null);
  const [showAccessibilityViewer, setShowAccessibilityViewer] = useState(null);
  const [isDark, setIsDark] = useState(false);

  const [activeView, setActiveView] = useState('picker');
  const [viewProps, setViewProps] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem('savedPalettes');
    if (stored) setSavedPalettes(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes));
  }, [savedPalettes]);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDark);
  }, [isDark]);

  const addColorToPalette = () => {
    if (palette.length >= 5) {
      alert('Palette is limited to 5 colors. Remove some to add more.');
      return;
    }
    if (!palette.includes(color)) setPalette([...palette, color]);
  };

  const removeColorFromPalette = (i) => setPalette(palette.filter((_, idx) => idx !== i));

  const saveCurrentPalette = () => {
    if (palette.length !== 5) {
      alert('Palette must have exactly 5 colors to save.');
      return;
    }
    setSavedPalettes([...savedPalettes, [...palette]]);
    setPalette([]);
  };

  const removeSavedPalette = (i) => setSavedPalettes(savedPalettes.filter((_, idx) => idx !== i));

  const handleFavoriteSelect = (hex) => updateColor(hex);

  const handleBack = () => {
    setActiveView('picker');
    setViewProps({});
  };

  // === FULL-PAGE VIEWS ===
  if (activeView === 'mixing-lab') {
    return <ColorMixingLab {...viewProps} onBack={handleBack} isDark={isDark} />;
  }
  if (activeView === 'scheme-info') {
    return <ColorSchemeInfo {...viewProps} onBack={handleBack} isDark={isDark} />;
  }
  if (activeView === 'contrast-viewer') {
    return <LiveContrastViewer onBack={handleBack} isDark={isDark} />;
  }
  if (activeView === 'additive-challenge') {
    return <AdditiveColorChallenge {...viewProps} onBack={handleBack} isDark={isDark} />;
  }
  if (activeView === 'scheme-wheel') {
  return <ColorSchemeWheel {...viewProps} onBack={handleBack} isDark={isDark} />;
}

if (activeView === 'scheme-wheel') {
  return <ColorSchemeWheel {...viewProps} onBack={handleBack} isDark={isDark} />;
}
// Enhance addToPalette to accept color
const addToPalette = (hex) => {
  if (palette.length >= 5) {
    alert('Palette is full (5 colors max)');
    return;
  }
  if (!palette.includes(hex)) setPalette([...palette, hex]);
};
  // === MAIN PICKER VIEW ===
  return (
    <>
      <LeftMenu
        color={color}
        setColor={updateColor}
        isDark={isDark}
        toggleDark={setIsDark}
        setActiveView={setActiveView}
        setViewProps={setViewProps}
        addToPalette={addToPalette}
      />

      <main className="main-content">
        <div className="app-container">
          <h1>ClearColor Picker</h1>

          <ColorWheel color={color} setColor={setColor} />
          <ColorInputs color={color} setColor={setColor} />
          <ColorDecomposition color={color} />

          <button onClick={addColorToPalette} className="full-width">
            Add to Palette
          </button>
            <ColorHistory
              persist={true}
              onSelect={updateColor}
            />

          <Favorites currentColor={color} onSelectFavorite={handleFavoriteSelect} />

          <PaletteManager palette={palette} removeColor={removeColorFromPalette} />

          <button
            onClick={saveCurrentPalette}
            className="full-width"
            disabled={palette.length !== 5}
          >
            Save Palette (requires exactly 5 colors)
          </button>

          <SavedPalettes
            palettes={savedPalettes}
            removePalette={removeSavedPalette}
            setSelectedPaletteForSimulation={setSelectedPaletteForSimulation}
            setShowUIMockups={setShowUIMockups}
            setShowContrastChecker={setShowContrastChecker}
            setShowAccessibilityViewer={setShowAccessibilityViewer} // ← Passed down
          />

          {/* Modals */}
          {selectedPaletteForSimulation && (
            <ColorBlindnessSimulator
              palette={selectedPaletteForSimulation}
              onClose={() => setSelectedPaletteForSimulation(null)}
            />
          )}
          {showUIMockups && (
            <UIMockups
              palette={showUIMockups}
              onClose={() => setShowUIMockups(null)}
            />
          )}
          {showContrastChecker && (
            <ContrastChecker
              palette={showContrastChecker}
              onClose={() => setShowContrastChecker(null)}
            />
          )}
          {showAccessibilityViewer && (
            <AccessibilityViewer
              palette={showAccessibilityViewer}
              onClose={() => setShowAccessibilityViewer(null)}
            />
          )}

          <ExportOptions savedPalettes={savedPalettes} />
        </div>
      </main>

      <RightMenu setPalette={setPalette} setColor={updateColor} isDark={isDark} />
    </>
  );
}

export default App;