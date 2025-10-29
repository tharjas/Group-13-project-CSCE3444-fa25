// src/App.jsx
import React, { useState, useEffect } from 'react';
import ColorWheel from './components/ColorWheel';
import ColorInputs from './components/ColorInputs';
import PaletteManager from './components/PaletteManager';
import ExportOptions from './components/ExportOptions';
import SavedPalettes from './components/SavedPalettes';
import ColorBlindnessSimulator from './components/ColorBlindnessSimulator';
import UIMockups from './components/UIMockups';

// NEW IMPORT
import Favorites from './components/Favorites';

function App() {
  const [color, setColor] = useState('#ffffff');
  const [palette, setPalette] = useState([]);
  const [savedPalettes, setSavedPalettes] = useState([]);
  const [selectedPaletteForSimulation, setSelectedPaletteForSimulation] = useState(null);
  const [showUIMockups, setShowUIMockups] = useState(null);

  // ... (localStorage for savedPalettes stays the same)

  const addColorToPalette = () => { /* unchanged */ };
  const removeColorFromPalette = (indexToRemove) => { /* unchanged */ };
  const saveCurrentPalette = () => { /* unchanged */ };
  const removeSavedPalette = (indexToRemove) => { /* unchanged */ };

  // NEW: callback when a favorite is clicked
  const handleFavoriteSelect = (hex) => {
    setColor(hex);
  };

  return (
    <div className="App">
      <h1>ColorVision Picker</h1>

      <ColorWheel color={color} setColor={setColor} />
      <ColorInputs color={color} setColor={setColor} />

      <button onClick={addColorToPalette} style={{ marginTop: '1rem', width: '100%' }}>
        Add to Palette
      </button>

      {/* <<< INSERT FAVORITES HERE >>> */}
      <Favorites currentColor={color} onSelectFavorite={handleFavoriteSelect} />
      {/* <<< END INSERT >>> */}

      <PaletteManager palette={palette} removeColor={removeColorFromPalette} />

      <button
        onClick={saveCurrentPalette}
        style={{ marginTop: '1rem', width: '100%' }}
        disabled={palette.length !== 5}
      >
        Save Palette (requires exactly 5 colors)
      </button>

      <SavedPalettes
        palettes={savedPalettes}
        removePalette={removeSavedPalette}
        setSelectedPaletteForSimulation={setSelectedPaletteForSimulation}
        setShowUIMockups={setShowUIMockups}
      />

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

      <ExportOptions palette={palette} />
    </div>
  );
}

export default App;