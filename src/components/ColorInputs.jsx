import React, { useState, useEffect } from 'react';

// Helper functions for color conversions
// Hex to RGB
//Toggle Between Color Models
const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
};

const rgbToHex = (r, g, b) => {
  const clamp = (val) => Math.max(0, Math.min(255, Math.round(val)));
  r = clamp(r);
  g = clamp(g);
  b = clamp(b);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
};

const hexToHsl = (hex) => {
  const { r, g, b } = hexToRgb(hex);
  const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
      case gNorm: h = (bNorm - rNorm) / d + 2; break;
      case bNorm: h = (rNorm - gNorm) / d + 4; break;
      default: break;
    }
    h *= 60;
  }
  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

const hslToHex = (h, s, l) => {
  h = h % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs((h / 60) % 2 - 1));
  let m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) [r, g, b] = [c, x, 0];
  else if (60 <= h && h < 120) [r, g, b] = [x, c, 0];
  else if (120 <= h && h < 180) [r, g, b] = [0, c, x];
  else if (180 <= h && h < 240) [r, g, b] = [0, x, c];
  else if (240 <= h && h < 300) [r, g, b] = [x, 0, c];
  else if (300 <= h && h < 360) [r, g, b] = [c, 0, x];

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  return rgbToHex(r, g, b);
};

// Validate input formats
const isValidHex = (hex) => /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);
const isValidRgb = (rgb) => {
  const parts = rgb.split(',').map(s => s.trim());
  if (parts.length !== 3) return false;
  return parts.every(p => {
    const num = parseInt(p);
    return !isNaN(num) && num >= 0 && num <= 255;
  });
};
const isValidHsl = (hsl) => {
  const parts = hsl.split(',').map(s => s.trim());
  if (parts.length !== 3) return false;
  const [h, s, l] = parts.map(p => parseFloat(p.replace('%', '')));
  return !isNaN(h) && h >= 0 && h <= 360 &&
         !isNaN(s) && s >= 0 && s <= 100 &&
         !isNaN(l) && l >= 0 && l <= 100;
};

const ColorInputs = ({ color, setColor }) => {
  const [hexInput, setHexInput] = useState(color);
  const [rgbInput, setRgbInput] = useState('');
  const [hslInput, setHslInput] = useState('');
  const [error, setError] = useState('');

  // Sync inputs when color prop changes
  useEffect(() => {
    setHexInput(color);
    const { r, g, b } = hexToRgb(color);
    setRgbInput(`${r}, ${g}, ${b}`);
    const { h, s, l } = hexToHsl(color);
    setHslInput(`${h}, ${s}%, ${l}%`);
    setError('');
  }, [color]);

  const handleHexChange = (e) => {
    const value = e.target.value.toUpperCase();
    setHexInput(value);
    const cleanHex = value.startsWith('#') ? value : `#${value}`;
    if (isValidHex(cleanHex)) {
      setColor(cleanHex);
      setError('');
    } else {
      setError('Invalid HEX format');
    }
  };

  const handleRgbChange = (e) => {
    const value = e.target.value;
    setRgbInput(value);
    if (isValidRgb(value)) {
      const [r, g, b] = value.split(',').map(s => parseInt(s.trim()));
      const hex = rgbToHex(r, g, b);
      setColor(hex);
      setError('');
    } else {
      setError('Invalid RGB format (e.g., 255, 0, 0)');
    }
  };

  const handleHslChange = (e) => {
    const value = e.target.value;
    setHslInput(value);
    if (isValidHsl(value)) {
      const [h, s, l] = value.split(',').map(s => parseFloat(s.trim().replace('%', '')));
      const hex = hslToHex(h, s, l);
      setColor(hex);
      setError('');
    } else {
      setError('Invalid HSL format (e.g., 0, 100%, 50%)');
    }
  };
  return (
  <div className="color-inputs">
    {/* Existing Inputs */}
    <div>
      <label htmlFor="hex">HEX</label>
      <input
        type="text"
        id="hex"
        value={hexInput}
        onChange={handleHexChange}
        placeholder="#FFFFFF"
      />
    </div>
    <div>
      <label htmlFor="rgb">RGB</label>
      <input
        type="text"
        id="rgb"
        value={rgbInput}
        onChange={handleRgbChange}
        placeholder="255, 0, 0"
      />
    </div>
    <div>
      <label htmlFor="hsl">HSL</label>
      <input
        type="text"
        id="hsl"
        value={hslInput}
        onChange={handleHslChange}
        placeholder="0, 100%, 50%"
      />
    </div>

    {/* F15: HEX Code Breakdown */}
    <div style={{ marginTop: '1rem', padding: '0.5rem', background: 'rgba(0,0,0,0.03)', borderRadius: '6px', fontSize: '0.9rem' }}>
      <strong>Color Breakdown:</strong><br />
      HEX: {color}<br />
      RGB: {hexToRgb(color).r}, {hexToRgb(color).g}, {hexToRgb(color).b}<br />
      HSL: {hexToHsl(color).h}°, {hexToHsl(color).s}%, {hexToHsl(color).l}%
    </div>

    {error && <div style={{ color: 'red', gridColumn: '1 / -1', marginTop: '0.5rem' }}>{error}</div>}
  </div>
);};

//   return (
//     <div className="color-inputs">
//       <div>
//         <label htmlFor="hex">HEX</label>
//         <input
//           type="text"
//           id="hex"
//           value={hexInput}
//           onChange={handleHexChange}
//           placeholder="#FFFFFF"
//         />
//       </div>
//       <div>
//         <label htmlFor="rgb">RGB</label>
//         <input
//           type="text"
//           id="rgb"
//           value={rgbInput}
//           onChange={handleRgbChange}
//           placeholder="255, 0, 0"
//         />
//       </div>
//       <div>
//         <label htmlFor="hsl">HSL</label>
//         <input
//           type="text"
//           id="hsl"
//           value={hslInput}
//           onChange={handleHslChange}
//           placeholder="0, 100%, 50%"
//         />
//       </div>
//       {error && <div style={{ color: 'red', gridColumn: '1 / -1', marginTop: '0.5rem' }}>{error}</div>}
//     </div>
//   );
// };

export default ColorInputs;