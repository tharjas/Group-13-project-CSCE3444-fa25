// src/App.jsx
import React, { useState, useEffect } from 'react';
import ColorWheel from './components/ColorWheel';
import ColorInputs from './components/ColorInputs';
import PaletteManager from './components/PaletteManager';
import ExportOptions from './components/ExportOptions';
import SavedPalettes from './components/SavedPalettes';
import ColorBlindnessSimulator from './components/ColorBlindnessSimulator';
import UIMockups from './components/UIMockups';
import Favorites from './components/Favorites';
import LeftMenu from './components/LeftMenu';
import RightMenu from './components/RightMenu';

function App() {
  const [color, setColor] = useState('#ffffff');
  const [palette, setPalette] = useState([]);
  const [savedPalettes, setSavedPalettes] = useState([]);
  const [selectedPaletteForSimulation, setSelectedPaletteForSimulation] = useState(null);
  const [showUIMockups, setShowUIMockups] = useState(null);
  const [isDark, setIsDark] = useState(false);

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

  const handleFavoriteSelect = (hex) => setColor(hex);

  return (
    <>
      <LeftMenu color={color} setColor={setColor} isDark={isDark} toggleDark={setIsDark} />

      <main className="main-content">
        <div className="app-container">
          <h1>ClearColor Picker</h1>

          <ColorWheel color={color} setColor={setColor} />
          <ColorInputs color={color} setColor={setColor} />

          <button onClick={addColorToPalette} className="full-width">
            Add to Palette
          </button>

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
          />

          {selectedPaletteForSimulation && (
            <ColorBlindnessSimulator
              palette={selectedPaletteForSimulation}
              onClose={() => setSelectedPaletteForSimulation(null)}
            />
          )}

          {showUIMockups && (
            <UIMockups palette={showUIMockups} onClose={() => setShowUIMockups(null)} />
          )}

          <ExportOptions savedPalettes={savedPalettes} />
        </div>
      </main>

      <RightMenu setPalette={setPalette} setColor={setColor} isDark={isDark} />
    </>
  );
}

export default App;