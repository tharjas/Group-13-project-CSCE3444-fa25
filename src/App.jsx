import React, { useState } from 'react';
import ColorWheel from './components/ColorWheel';
import ColorInputs from './components/ColorInputs';
import PaletteManager from './components/PaletteManager';
import ExportOptions from './components/ExportOptions';

function App() {
  const [color, setColor] = useState('#ffffff');
  const [palette, setPalette] = useState([]);

  const addColorToPalette = () => {
    if (!palette.includes(color)) {
      setPalette([...palette, color]);
    }
  };

  const removeColorFromPalette = (indexToRemove) => {
    setPalette(palette.filter((_, index) => index !== indexToRemove));
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
      <ExportOptions palette={palette} />
    </div>
  );
}

export default App;
