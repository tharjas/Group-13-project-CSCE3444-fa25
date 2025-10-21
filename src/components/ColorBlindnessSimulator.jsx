// src/components/ColorBlindnessSimulator.jsx
import React from 'react';

const colorBlindnessMatrices = {
  Protanomaly: [0.817, 0.183, 0.000, 0.333, 0.667, 0.000, 0.000, 0.125, 0.875],
  Deuteranomaly: [0.800, 0.200, 0.000, 0.258, 0.742, 0.000, 0.000, 0.142, 0.858],
  Protanopia: [0.567, 0.433, 0.000, 0.558, 0.442, 0.000, 0.000, 0.242, 0.758],
  Deuteranopia: [0.625, 0.375, 0.000, 0.700, 0.300, 0.000, 0.000, 0.300, 0.700],
  Tritanomaly: [0.967, 0.033, 0.000, 0.000, 0.733, 0.267, 0.000, 0.183, 0.817],
  Tritanopia: [0.950, 0.050, 0.000, 0.000, 0.433, 0.567, 0.000, 0.475, 0.525],
};

const simulateColor = (hex, type) => {
  if (!type || !colorBlindnessMatrices[type]) return hex;
  const mat = colorBlindnessMatrices[type];
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);
  let r2 = Math.round(mat[0] * r + mat[1] * g + mat[2] * b);
  let g2 = Math.round(mat[3] * r + mat[4] * g + mat[5] * b);
  let b2 = Math.round(mat[6] * r + mat[7] * g + mat[8] * b);
  r2 = Math.max(0, Math.min(255, r2));
  g2 = Math.max(0, Math.min(255, g2));
  b2 = Math.max(0, Math.min(255, b2));
  return `#${r2.toString(16).padStart(2, '0')}${g2.toString(16).padStart(2, '0')}${b2.toString(16).padStart(2, '0')}`;
};

const ColorBlindnessSimulator = ({ palette, onClose }) => {
  const types = ['Protanomaly', 'Deuteranomaly', 'Protanopia', 'Deuteranopia', 'Tritanomaly', 'Tritanopia'];

  return (
    <div className="color-blindness-simulator">
      <h2>Color Blindness Simulation</h2>
      <h3>Original Palette</h3>
      <div className="palette-bar">
        {palette.map((color, index) => (
          <div key={index} style={{ flex: 1, height: '50px', backgroundColor: color }} />
        ))}
      </div>
      {types.map((type) => (
        <div key={type}>
          <h3>{type}</h3>
          <div className="palette-bar">
            {palette.map((color, index) => (
              <div
                key={index}
                style={{ flex: 1, height: '50px', backgroundColor: simulateColor(color, type) }}
              />
            ))}
          </div>
        </div>
      ))}
      <button onClick={onClose} style={{ marginTop: '1rem' }}>Close Simulation</button>
    </div>
  );
};

export default ColorBlindnessSimulator;