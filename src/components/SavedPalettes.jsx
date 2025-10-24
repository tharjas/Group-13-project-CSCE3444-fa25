import React from 'react';

const SavedPalettes = ({ palettes, removePalette, setSelectedPaletteForSimulation, setShowUIMockups }) => {
  return (
    <div className="saved-palettes-manager">
      <h2>Saved Palettes</h2>
      <ul className="saved-palettes-list">
        {palettes.map((palette, paletteIndex) => (
          <li key={paletteIndex} className="saved-palette-item">
            <h3>Palette {paletteIndex + 1}</h3>
            <ul className="palette-list">
              {palette.map((color, colorIndex) => (
                <li key={colorIndex} className="palette-item">
                  <div 
                    className="palette-color-preview"
                    style={{ backgroundColor: color }}
                  ></div>
                  <span>{color}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => setSelectedPaletteForSimulation(palette)}>Simulate Color Blindness</button>
            <button onClick={() => setShowUIMockups(palette)}>Preview UI Mockups</button>
            <button onClick={() => removePalette(paletteIndex)}>Remove Palette</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedPalettes;