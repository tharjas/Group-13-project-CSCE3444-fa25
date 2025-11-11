// src/components/ColorMixingLab.jsx
// Improved version: Added bright preset colors section inspired by colordesigner.io
// Presets are bright, saturated primary and secondary colors for easy mixing
// Safe version: never white screens, default props, dark/light support
// FIXED: Back button now persistent (fixed position) and better contrast (blue bg, white text)

import React, { useState, useEffect } from 'react';
import ColorWheel from './ColorWheel';

// ---- Preset Colors ----
const brightPresets = [
  '#FF0000', // Red
  '#FF7F00', // Orange
  '#FFFF00', // Yellow
  '#00FF00', // Green
  '#00FFFF', // Cyan
  '#0000FF', // Blue
  '#4B0082', // Indigo
  '#9400D3', // Violet
  '#FFFFFF', // White
  '#000000', // Black
];

// ---- Utility Functions ----
const hexToRgb = (hex) => {
  if (!hex) return { r: 255, g: 255, b: 255 };
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const num = parseInt(hex, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
};

const rgbToHex = (r, g, b) => {
  const clamp = (val) => Math.max(0, Math.min(255, Math.round(val)));
  return `#${((1 << 24) + (clamp(r) << 16) + (clamp(g) << 8) + clamp(b))
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
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
    }
    h *= 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const mixColors = (colorsWithRatios) => {
  if (!colorsWithRatios.length) return '#FFFFFF';
  const totalRatio = colorsWithRatios.reduce((sum, [, ratio]) => sum + (ratio || 0), 0);
  if (totalRatio === 0) return colorsWithRatios[0]?.[0] || '#FFFFFF';

  let r = 0, g = 0, b = 0;
  colorsWithRatios.forEach(([hex, ratio]) => {
    const { r: cr, g: cg, b: cb } = hexToRgb(hex);
    const normalized = (ratio || 0) / totalRatio;
    r += cr * normalized;
    g += cg * normalized;
    b += cb * normalized;
  });
  return rgbToHex(r, g, b);
};

const formatColor = (hex, mode) => {
  if (mode === 'RGB') {
    const { r, g, b } = hexToRgb(hex);
    return `rgb(${r}, ${g}, ${b})`;
  }
  if (mode === 'HSL') {
    const { h, s, l } = hexToHsl(hex);
    return `hsl(${h}, ${s}%, ${l}%)`;
  }
  return hex; // HEX default
};

// ---- Component ----
const ColorMixingLab = ({
  initialColor = '#FFFFFF',
  setColor = () => {},
  onBack = () => {},
  isDark = false,
}) => {
  const [colors, setColors] = useState([{ hex: initialColor, ratio: 1 }]);
  const [favorites, setFavorites] = useState([]);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [customColor, setCustomColor] = useState('#FFFFFF');
  const [displayMode, setDisplayMode] = useState('HEX');
  const [copyStatus, setCopyStatus] = useState('');

  // Keep colors synced if initialColor changes
  useEffect(() => {
    setColors([{ hex: initialColor, ratio: 1 }]);
  }, [initialColor]);

  // Load favorites safely
  useEffect(() => {
    try {
      const stored = localStorage.getItem('favoriteColors');
      if (stored) setFavorites(JSON.parse(stored));
    } catch (e) {
      console.error('Failed to load favorites:', e);
    }
  }, []);

  const mixedColor = mixColors(colors.map(c => [c.hex, c.ratio]));
  const totalRatio = colors.reduce((sum, c) => sum + (c.ratio || 0), 0);

  const addColor = (hex, ratio = 1) => {
    if (!hex || hex.length < 4) return;
    setColors(prev => [...prev, { hex, ratio }]);
  };

  const removeColor = (index) => setColors(prev => prev.filter((_, i) => i !== index));

  const updateRatio = (index, value) => {
    const newValue = parseFloat(value);
    setColors(prev => prev.map((c, i) => i === index ? { ...c, ratio: newValue } : c));
  };

  const getPercentage = (ratio) => {
    if (totalRatio === 0) return '0%';
    return `${((ratio / totalRatio) * 100).toFixed(1)}%`;
  };

  const copyToClipboard = async () => {
    const text = formatColor(mixedColor, displayMode);
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus(''), 2000);
    } catch (err) {
      setCopyStatus('Failed to copy');
      setTimeout(() => setCopyStatus(''), 2000);
    }
  };

  const useMixed = () => {
    setColor(mixedColor);
    onBack();
  };

  const addCustom = () => {
    addColor(customColor);
    setShowCustomPicker(false);
  };

  return (
    <div className={`full-page-view ${isDark ? 'dark-mode' : ''}`} style={{
      padding: '2rem',
      background: 'var(--bg)',
      color: 'var(--text)',
      minHeight: '100vh'
    }}>
      <button
        onClick={onBack}
        style={{
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          padding: '0.5rem 1rem',
          background: '#044997',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          zIndex: 1000
        }}
      >
        Back to Picker
      </button>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', margin: '2rem 0' }}>Color Mixing Lab</h1>
        <p style={{ textAlign: 'center', marginBottom: '3rem' }}>
          Blend colors with adjustable weights. Add from favorites, presets, or custom picker.
        </p>

        {/* Add Colors Section */}
        <h2>Add Colors to Mix</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>

          {/* Favorites */}
          <div>
            <h3>Favorites</h3>
            {favorites.length === 0 ? (
              <p style={{ textAlign: 'center', fontStyle: 'italic', color: isDark ? '#aaa' : '#555' }}>
                No favorites yet. Add some in the main picker!
              </p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                {favorites.map((hex, i) => (
                  <div key={i} style={{ cursor: 'pointer' }} onClick={() => addColor(hex)}>
                    <div style={{
                      width: '40px', height: '40px', background: hex,
                      borderRadius: '4px', border: '1px solid #ccc'
                    }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bright Presets */}
          <div>
            <h3>Bright Presets</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              {brightPresets.map((hex, i) => (
                <div key={i} style={{ cursor: 'pointer' }} onClick={() => addColor(hex)}>
                  <div style={{
                    width: '40px', height: '40px', background: hex,
                    borderRadius: '4px', border: '1px solid #ccc'
                  }} />
                </div>
              ))}
            </div>
          </div>

          {/* Custom Picker */}
          <button
            onClick={() => setShowCustomPicker(!showCustomPicker)}
            style={{ padding: '0.5rem 1rem', alignSelf: 'flex-start' }}
          >
            {showCustomPicker ? 'Hide Custom Picker' : 'Show Custom Picker'}
          </button>
          {showCustomPicker && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', borderRadius: '8px' }}>
              <ColorWheel color={customColor} setColor={setCustomColor} />
              <button onClick={addCustom} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
                Add to Mix
              </button>
            </div>
          )}
        </div>

        {/* Mixing List */}
        <h2>Mix Proportions</h2>
        {colors.length === 0 ? (
          <p style={{ textAlign: 'center', fontStyle: 'italic', color: isDark ? '#aaa' : '#555' }}>
            No colors added. Start by adding from favorites, presets or the picker!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {colors.map(({ hex, ratio }, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1rem', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                borderRadius: '8px'
              }}>
                <div style={{
                  width: '50px', height: '50px', background: hex,
                  borderRadius: '6px', border: '2px solid rgba(0,0,0,0.1)'
                }} />
                <div style={{ flex: 1 }}>
                  <input type="range" min="0" max="10" step="0.1" value={ratio}
                    onChange={e => updateRatio(i, e.target.value)}
                    style={{ width: '100%' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span>Weight: {ratio.toFixed(1)}</span>
                    <span>{getPercentage(ratio)}</span>
                  </div>
                </div>
                <code style={{ minWidth: '120px', textAlign: 'center' }}>{formatColor(hex, displayMode)}</code>
                <button onClick={() => removeColor(i)} style={{ color: '#dc3545', background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>×</button>
              </div>
            ))}
          </div>
        )}

        {/* Mixed Result */}
        <h2>Mixed Result</h2>
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <div style={{
            width: '120px', height: '120px', background: mixedColor,
            borderRadius: '50%', margin: '0 auto 1rem', border: '4px solid rgba(0,0,0,0.15)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }} />
          <code style={{ fontSize: '1.3rem', fontWeight: '600', display: 'block', marginBottom: '1rem' }}>
            {formatColor(mixedColor, displayMode)}
          </code>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            {['HEX', 'RGB', 'HSL'].map(m => (
              <button key={m} onClick={() => setDisplayMode(m)} style={{
                padding: '0.4rem 0.8rem',
                background: displayMode === m ? '#044997' : 'transparent',
                color: displayMode === m ? '#fff' : (isDark ? '#eee' : '#111'),
                border: '1px solid #044997',
                borderRadius: '4px',
                fontSize: '0.9rem'
              }}>{m}</button>
            ))}
            <button onClick={copyToClipboard} style={{
              padding: '0.4rem 0.8rem',
              background: '#6c757d',
              color: 'white',
              border: '1px solid #6c757d',
              borderRadius: '4px',
              fontSize: '0.9rem'
            }}>
              📋 Copy
            </button>
          </div>
          {copyStatus && (
            <p style={{ color: copyStatus.includes('Copied') ? '#28a745' : '#dc3545', fontSize: '0.9rem' }}>
              {copyStatus}
            </p>
          )}

          <button onClick={useMixed} disabled={colors.length === 0} style={{
            padding: '0.75rem 1.5rem',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: colors.length === 0 ? 'not-allowed' : 'pointer',
            opacity: colors.length === 0 ? 0.5 : 1
          }}>
            Use This Mixed Color
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorMixingLab;