import React, { useState, useEffect } from 'react';
import ColorWheel from './components/ColorWheel';
import ColorInputs from './components/ColorInputs';
import PaletteManager from './components/PaletteManager';
import ExportOptions from './components/ExportOptions';
import SavedPalettes from './components/SavedPalettes';
import ColorBlindnessSimulator from './components/ColorBlindnessSimulator';
import UIMockups from './components/UIMockups';
import Favorites from './components/Favorites';


function App() {
  const [color, setColor] = useState('#ffffff');
  const [palette, setPalette] = useState([]);
  const [savedPalettes, setSavedPalettes] = useState([]);
  const [selectedPaletteForSimulation, setSelectedPaletteForSimulation] = useState(null);
  const [showUIMockups, setShowUIMockups] = useState(null); // New state for UI mockups modal

  useEffect(() => {
    const storedPalettes = localStorage.getItem('savedPalettes');
    if (storedPalettes) {
      setSavedPalettes(JSON.parse(storedPalettes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes));
  }, [savedPalettes]);

  const addColorToPalette = () => {
    if (palette.length >= 5) {
      alert('Palette is limited to 5 colors. Remove some to add more.');
      return;
    }
    if (!palette.includes(color)) {
      setPalette([...palette, color]);
    }
  };

  const removeColorFromPalette = (indexToRemove) => {
    setPalette(palette.filter((_, index) => index !== indexToRemove));
  };

  const saveCurrentPalette = () => {
    if (palette.length !== 5) {
      alert('Palette must have exactly 5 colors to save.');
      return;
    }
    setSavedPalettes([...savedPalettes, [...palette]]);
    setPalette([]);
  };

  const removeSavedPalette = (indexToRemove) => {
    setSavedPalettes(savedPalettes.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="App">
      <h1>ColorVision Picker</h1>
      <ColorWheel color={color} setColor={setColor} />
      <ColorInputs color={color} setColor={setColor} />
      <button onClick={addColorToPalette} style={{ marginTop: '1rem', width: '100%' }}>
        Add to Palette
      </button>
      <PaletteManager palette={palette} removeColor={removeColorFromPalette} />
      <button onClick={saveCurrentPalette} style={{ marginTop: '1rem', width: '100%' }} disabled={palette.length !== 5}>
        Save Palette (requires exactly 5 colors)
      </button>

      <Favorites
  currentColor={color}
  onSelectFavorite={(selectedColor) => setColor(selectedColor)}
/>


      <SavedPalettes
        palettes={savedPalettes}
        removePalette={removeSavedPalette}
        setSelectedPaletteForSimulation={setSelectedPaletteForSimulation}
        setShowUIMockups={setShowUIMockups} // Pass setter to SavedPalettes
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