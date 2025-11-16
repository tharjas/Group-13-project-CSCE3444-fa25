// src/components/SavedPalettes.jsx
import React from 'react';
import ExportButton from './ExportButton';

const SavedPalettes = ({
  palettes,
  removePalette,
  setSelectedPaletteForSimulation,
  setShowUIMockups,
  setShowContrastChecker,
  setShowAccessibilityViewer 
}) => {
  return (
    <div className="saved-palettes-manager">
      <h2>Saved Palettes</h2>
      <div style={{ marginBottom: '0.5rem' }}>
        <ExportButton savedPalettes={palettes} />
      </div>
      <div className="saved-palettes-list">
        {palettes.map((palette, paletteIndex) => (
          <div key={paletteIndex} className="saved-palette-item">
            <h3>Palette {paletteIndex + 1}</h3>
            <div className="palette-list">
              {palette.map((color, colorIndex) => (
                <div key={colorIndex} className="palette-item">
                  <div 
                    className="palette-color-preview"
                    style={{ backgroundColor: color }}
                  ></div>
                  <span>{color}</span>
                </div>
              ))}
            </div>
            <div className="saved-palette-actions">
              <button onClick={() => setSelectedPaletteForSimulation(palette)}>
                Simulate Color Blindness
              </button>
              <button onClick={() => setShowUIMockups(palette)}>
                Preview UI Mockups
              </button>
              <button onClick={() => setShowContrastChecker(palette)}>
                Check WCAG Contrast
              </button>
              <button onClick={() => setShowAccessibilityViewer(palette)}>
                Accessibility Check
              </button>
              <button 
                className="destructive-btn"
                onClick={() => removePalette(paletteIndex)}
              >
                Remove Palette
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedPalettes;