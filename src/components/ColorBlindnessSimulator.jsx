// src/components/ColorBlindnessSimulator.jsx
import React from 'react';

// CVD Matrices: (Machado et al., 2009), https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html
// Using severity 0.5 for anomalies (mild) and 1.0 for full deficiencies
const colorBlindnessMatrices = {
  // Mild red-green confusion (severity 0.5)
  Protanomaly: [
    0.458064, 0.679578, -0.137642,
    0.092785, 0.846313, 0.060902,
    -0.007494, -0.016807, 1.024301
  ],
  // Mild green-red confusion (severity 0.5)
  Deuteranomaly: [
    0.547494, 0.607765, -0.155259,
    0.181692, 0.781742, 0.036566,
    -0.010410, 0.027275, 0.983136
  ],
  // Full red-blindness (no red cones, severity 1.0)
  Protanopia: [
    0.152286, 1.052583, -0.204868,
    0.114503, 0.786281, 0.099216,
    -0.003882, -0.048116, 1.051998
  ],
  // Full green-blindness (no green cones, severity 1.0)
  Deuteranopia: [
    0.367322, 0.860646, -0.227968,
    0.280085, 0.672501, 0.047413,
    -0.011820, 0.042940, 0.968881
  ],
  // Mild blue-yellow confusion (severity 0.5)
  Tritanomaly: [
    1.017277, 0.027029, -0.044306,
    -0.006113, 0.958479, 0.047634,
    0.006379, 0.248708, 0.744913
  ],
  // Full blue-blindness (severity 1.0)
  Tritanopia: [
    1.255528, -0.076749, -0.178779,
    -0.078411, 0.930809, 0.147602,
    0.004733, 0.691367, 0.303900
  ]
};

// === sRGB <-> Linear RGB ===
const srgbToLinear = (c) => {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};

const linearToSrgb = (c) => {
  c = Math.max(0, Math.min(1, c)); // Clamp linear values to 0-1 before gamma correction
  const v = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return Math.round(v * 255);
};

// === Simulate color for a given type ===
const simulateColor = (hex, type) => {
  if (!type || !colorBlindnessMatrices[type]) return hex;

  const mat = colorBlindnessMatrices[type];

  // Parse hex
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Convert to linear
  const linR = srgbToLinear(r);
  const linG = srgbToLinear(g);
  const linB = srgbToLinear(b);

  // Apply 3x3 matrix (row-major)
  let rOut = mat[0] * linR + mat[1] * linG + mat[2] * linB;
  let gOut = mat[3] * linR + mat[4] * linG + mat[5] * linB;
  let bOut = mat[6] * linR + mat[7] * linG + mat[8] * linB;

  // Convert back
  return `#${linearToSrgb(rOut).toString(16).padStart(2, '0')}${linearToSrgb(gOut).toString(16).padStart(2, '0')}${linearToSrgb(bOut).toString(16).padStart(2, '0')}`;
};

const ColorBlindnessSimulator = ({ palette, onClose }) => {
  const types = ['Protanomaly', 'Deuteranomaly', 'Protanopia', 'Deuteranopia', 'Tritanomaly', 'Tritanopia'];

  return (
    <div className="color-blindness-simulator" style={{ padding: '1rem' }}>
      <h2>Color Blindness Simulation</h2>

      <h3>Original Palette</h3>
      <div className="palette-bar" style={{ display: 'flex', height: '50px', marginBottom: '1rem' }}>
        {palette.map((color, i) => (
          <div key={i} style={{ flex: 1, backgroundColor: color }} />
        ))}
      </div>

      {types.map((type) => (
        <div key={type} style={{ marginBottom: '1rem' }}>
          <h3 style={{ margin: '0.5rem 0' }}>{type}</h3>
          <div className="palette-bar" style={{ display: 'flex', height: '50px' }}>
            {palette.map((color, i) => (
              <div
                key={i}
                style={{ flex: 1, backgroundColor: simulateColor(color, type) }}
              />
            ))}
          </div>
        </div>
      ))}

      <button onClick={onClose} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
        Close Simulation
      </button>
    </div>
  );
};

export default ColorBlindnessSimulator;