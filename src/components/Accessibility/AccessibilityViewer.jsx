// src/components/AccessibilityViewer.jsx

// Created AccessibilityViewer component to preview palette accessibility
// Shows contrast ratios, grayscale simulation, and text readability
// Helps users ensure their color palettes are accessible

import React from 'react';

const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const n = parseInt(hex, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};

const rgbToHex = (r, g, b) => {
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  return `#${[clamp(r), clamp(g), clamp(b)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`;
};

const getLuminance = (hex) => {
  const { r, g, b } = hexToRgb(hex);
  const [rs, gs, bs] = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

const getContrastRatio = (hex1, hex2) => {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const brighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (brighter + 0.05) / (darker + 0.05);
};

const getContrastLevel = (ratio) => {
  if (ratio >= 7) return { label: 'AAA', color: '#28a745' };
  if (ratio >= 4.5) return { label: 'AA', color: '#ffc107' };
  return { label: 'Fail', color: '#dc3545' };
};

const toGrayscale = (hex) => {
  const { r, g, b } = hexToRgb(hex);
  const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  return rgbToHex(gray, gray, gray);
};

const AccessibilityViewer = ({ palette, onClose }) => {
  if (!palette || palette.length !== 5) {
    return (
      <div className="accessibility-viewer">
        <h2>Accessibility Preview</h2>
        <p>Palette must have exactly 5 colors.</p>
        <button onClick={onClose}>Close</button>
      </div>
    );
  }

  const [bg, primary, secondary, accent, textColor] = palette;

  // Common pairings to test
  const pairs = [
    { name: 'Body Text', bg: bg, fg: textColor },
    { name: 'Primary Button', bg: primary, fg: getLuminance(primary) > 0.4 ? '#000000' : '#FFFFFF' },
    { name: 'Secondary Button', bg: secondary, fg: getLuminance(secondary) > 0.4 ? '#000000' : '#FFFFFF' },
    { name: 'Accent Text', bg: bg, fg: accent },
  ];

  const grayscalePalette = palette.map(toGrayscale);

  return (
    <div className="accessibility-viewer" style={{ padding: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Accessibility Preview</h2>

      {/* Original vs Grayscale */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>Color Palette</h3>
        <div style={{ display: 'flex', gap: '1px', height: '40px', marginBottom: '1rem' }}>
          {palette.map((c, i) => (
            <div key={i} style={{ flex: 1, background: c }} />
          ))}
        </div>
        <h3>Grayscale Simulation</h3>
        <div style={{ display: 'flex', gap: '1px', height: '40px' }}>
          {grayscalePalette.map((c, i) => (
            <div key={i} style={{ flex: 1, background: c }} />
          ))}
        </div>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>
          💡 If colors blend together in grayscale, users with low vision may struggle to distinguish elements.
        </p>
      </div>

      {/* Contrast Table */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>Contrast Compliance (WCAG)</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Element</th>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Ratio</th>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Level</th>
            </tr>
          </thead>
          <tbody>
            {pairs.map((pair, i) => {
              const ratio = getContrastRatio(pair.bg, pair.fg);
              const { label, color } = getContrastLevel(ratio);
              return (
                <tr key={i}>
                  <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{pair.name}</td>
                  <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{ratio.toFixed(2)}:1</td>
                  <td style={{ border: '1px solid #ccc', padding: '0.5rem', color }}>
                    {label}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Text Preview */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>Text Readability Preview</h3>
        <div style={{ background: bg, color: textColor, padding: '1.5rem', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem 0' }}>Heading Example</h4>
          <p style={{ margin: 0 }}>
            The quick brown fox jumps over the lazy dog. This is a sample of body text to evaluate readability.
          </p>
          <button
            style={{
              marginTop: '1rem',
              background: primary,
              color: getLuminance(primary) > 0.4 ? '#000' : '#fff',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Primary Button
          </button>
          <button
            style={{
              marginTop: '1rem',
              marginLeft: '0.5rem',
              background: secondary,
              color: getLuminance(secondary) > 0.4 ? '#000' : '#fff',
              border: '1px solid #ccc',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Secondary
          </button>
        </div>
      </div>

      <button onClick={onClose} style={{ padding: '0.5rem 1rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}>
        Close Accessibility Preview
      </button>
    </div>
  );
};

export default AccessibilityViewer;