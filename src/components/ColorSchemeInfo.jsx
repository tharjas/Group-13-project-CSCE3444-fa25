// Updated src/components/ColorSchemeInfo.jsx
// Added isDark prop and 'dark-mode' class
// FIXED: Back button now persistent (fixed position) and better contrast (blue bg, white text)

import React, { useState } from 'react';
import { hexToHsl, hslToHex } from '../utils/colorUtils';

const ColorSchemeInfo = ({ color: initialColor, setColor, onBack, isDark }) => {
  const [mainColor, setMainColor] = useState(initialColor);
  const { h, s, l } = hexToHsl(mainColor);

  const schemes = {
    analogous: {
      title: 'Analogous',
      colors: [
        hslToHex((h - 30 + 360) % 360, s, l),
        mainColor,
        hslToHex((h + 30) % 360, s, l)
      ],
      description: 'Harmonious and pleasing to the eye. Perfect for calm, natural-feeling designs like wellness apps or nature websites.',
      example: 'Blues and greens for a spa booking platform.'
    },
    complementary: {
      title: 'Complementary',
      colors: [mainColor, hslToHex((h + 180) % 360, s, l)],
      description: 'High contrast and vibrant. Excellent for drawing attention to buttons, alerts, or hero sections.',
      example: 'Blue background with orange CTA buttons for an energetic startup.'
    },
    splitComplementary: {
      title: 'Split-Complementary',
      colors: [
        mainColor,
        hslToHex((h + 150) % 360, s, l),
        hslToHex((h + 210) % 360, s, l)
      ],
      description: 'Offers strong visual contrast with more variety than pure complementary. Great for balanced, dynamic UIs.',
      example: 'Red primary with teal and lime accents for a bold brand identity.'
    },
    triadic: {
      title: 'Triadic',
      colors: [
        mainColor,
        hslToHex((h + 120) % 360, s, l),
        hslToHex((h + 240) % 360, s, l)
      ],
      description: 'Evenly spaced on the color wheel. Creates vibrant, balanced designs without overwhelming.',
      example: 'Red, yellow, and blue for a playful children’s app.'
    },
    tetradic: {
      title: 'Square Tetradic',
      colors: [
        mainColor,
        hslToHex((h + 90) % 360, s, l),
        hslToHex((h + 180) % 360, s, l),
        hslToHex((h + 270) % 360, s, l)
      ],
      description: 'Rich and versatile rectangle on the wheel, offering two complementary pairs. Use one dominant pair for harmony. Appealing combos: Earthy browns with greens and oranges for autumn themes, or pastels for fresh, modern UIs—adds complexity without chaos.',
      example: 'Forest green, sky blue, warm orange, and soft purple for a nature-travel site.'
    }
  };

  const renderScheme = (scheme) => (
    <div style={{ marginBottom: '3rem', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
      <h3 style={{ margin: '0 0 1rem' }}>{scheme.title}</h3>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {scheme.colors.map((c, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                background: c,
                borderRadius: '12px',
                cursor: 'pointer',
                border: '2px solid rgba(0,0,0,0.1)',
                transition: 'transform 0.2s'
              }}
              onClick={() => {
                setColor(c);
                setMainColor(c);
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            />
            <code style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.9rem' }}>{c}</code>
          </div>
        ))}
      </div>
      <p style={{ margin: '0.5rem 0', fontStyle: 'italic' }}>{scheme.description}</p>
      <p style={{ margin: '0.5rem 0', fontWeight: '600' }}>Example: {scheme.example}</p>
    </div>
  );

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
          position: 'fixed', // Changed to fixed for persistence on scroll
          top: '1rem',
          left: '1rem',
          padding: '0.5rem 1rem',
          background: '#044997', // Changed to blue for better contrast with white text
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          zIndex: 1000 // Ensure it's on top
        }}
      >
        Back to Picker
      </button>

      <h1 style={{ textAlign: 'center', margin: '2rem 0' }}>Color Scheme Explorer</h1>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Select Main Color</label>
        <input
          type="color"
          value={mainColor}
          onChange={(e) => {
            setMainColor(e.target.value);
            setColor(e.target.value);
          }}
          style={{ width: '100px', height: '60px', cursor: 'pointer' }}
        />
        <code style={{ display: 'block', marginTop: '0.5rem' }}>{mainColor}</code>
      </div>
      <p style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem' }}>
        Explore professional color relationships based on <strong>{mainColor}</strong>. Click any swatch to select it as the new main color.
      </p>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {Object.values(schemes).map((scheme, i) => (
          <div key={i}>{renderScheme(scheme)}</div>
        ))}
      </div>
    </div>
  );
};

export default ColorSchemeInfo;