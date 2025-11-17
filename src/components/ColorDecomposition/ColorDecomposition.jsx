// src/components/ColorDecomposition.jsx
import React, { useEffect, useState } from 'react';

// Reuse your existing utils (no need to redefine if already in scope)
const hexToHsl = (hex) => {
  const { r, g, b } = hexToRgb(hex);
  const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm), min = Math.min(rNorm, gNorm, bNorm);
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
  else [r, g, b] = [c, 0, x];
  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
};

const hexToRgb = (hex) => {
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

const ColorDecomposition = ({ color }) => {
  const [tints, setTints] = useState([]);
  const [shades, setShades] = useState([]);
  const [tones, setTones] = useState([]);

  useEffect(() => {
    if (!color) return;

    const { h, s, l } = hexToHsl(color);

    // Generate 5 tints (increase lightness)
    const newTints = Array.from({ length: 5 }, (_, i) => {
      const newL = Math.min(100, l + (i + 1) * 10);
      return hslToHex(h, s, newL);
    });

    // Generate 5 shades (decrease lightness)
    const newShades = Array.from({ length: 5 }, (_, i) => {
      const newL = Math.max(0, l - (i + 1) * 10);
      return hslToHex(h, s, newL);
    });

    // Generate 5 tones (reduce saturation)
    const newTones = Array.from({ length: 5 }, (_, i) => {
      const newS = Math.max(0, s - (i + 1) * 15);
      return hslToHex(h, newS, l);
    });

    setTints(newTints);
    setShades(newShades);
    setTones(newTones);
  }, [color]);

  const formatColor = (hex) => {
    const { r, g, b } = hexToRgb(hex);
    const { h, s, l } = hexToHsl(hex);
    return `${hex} | RGB(${r},${g},${b}) | HSL(${h}°,${s}%,${l}%)`;
  };

  return (
    <div className="color-decomposition" style={{
      padding: '1.5rem',
      background: 'var(--bg)',
      color: 'var(--text)',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: '1px solid var(--border)',
      maxWidth: '100%',
      margin: '1rem auto'
    }}>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem', fontWeight: '600' }}>🎨 Color Decomposition</h3>
      <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
        Derived variants of <code style={{ fontWeight: 'bold', background: 'var(--bg-alt)', padding: '2px 6px', borderRadius: '4px' }}>{color}</code>
      </p>

      {/* Tints, Shades, Tones in a grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
        marginBottom: '1rem'
      }}>

        {/* Tints */}
        <div style={{
          background: 'var(--bg-alt)',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid var(--border)'
        }}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '600' }}>➕ Tints</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {tints.map((c, i) => (
              <div key={i} style={{
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                position: 'relative'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{
                  width: '50px', height: '50px', background: c,
                  border: '2px solid var(--border)',
                  borderRadius: '6px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }} />
                <span style={{
                  fontSize: '0.7rem',
                  display: 'block',
                  marginTop: '0.2rem',
                  fontWeight: '500',
                  color: 'var(--text)'
                }}>{c}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shades */}
        <div style={{
          background: 'var(--bg-alt)',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid var(--border)'
        }}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '600' }}>➖ Shades</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {shades.map((c, i) => (
              <div key={i} style={{
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                position: 'relative'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{
                  width: '50px', height: '50px', background: c,
                  border: '2px solid var(--border)',
                  borderRadius: '6px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }} />
                <span style={{
                  fontSize: '0.7rem',
                  display: 'block',
                  marginTop: '0.2rem',
                  fontWeight: '500',
                  color: 'var(--text)'
                }}>{c}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tones */}
        <div style={{
          background: 'var(--bg-alt)',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid var(--border)'
        }}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '600' }}>🟨 Tones</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {tones.map((c, i) => (
              <div key={i} style={{
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                position: 'relative'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{
                  width: '50px', height: '50px', background: c,
                  border: '2px solid var(--border)',
                  borderRadius: '6px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }} />
                <span style={{
                  fontSize: '0.7rem',
                  display: 'block',
                  marginTop: '0.2rem',
                  fontWeight: '500',
                  color: 'var(--text)'
                }}>{c}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Info Bar */}
      <div style={{
        background: 'var(--bg-alt)',
        padding: '0.75rem',
        borderRadius: '8px',
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        textAlign: 'center',
        marginTop: '1rem',
        border: '1px solid var(--border)'
      }}>
        💡 <strong>Tints</strong> = ↑ Lightness | <strong>Shades</strong> = ↓ Lightness | <strong>Tones</strong> = ↓ Saturation
      </div>
    </div>
  );
};

export default ColorDecomposition;