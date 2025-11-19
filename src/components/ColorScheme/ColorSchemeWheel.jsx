// src/components/ColorSchemeWheel.jsx
import React, { useState, useEffect, useRef } from 'react';

// Reusable color utils (define once, or better: import from shared file)
const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const num = parseInt(hex, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
};

const rgbToHex = (r, g, b) => {
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  return `#${[clamp(r), clamp(g), clamp(b)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`;
};

const hexToHsl = (hex) => {
  const { r, g, b } = hexToRgb(hex);
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = (gn - bn) / d + (gn < bn ? 6 : 0); break;
      case gn: h = (bn - rn) / d + 2; break;
      case bn: h = (rn - gn) / d + 4; break;
    }
    h *= 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const hslToHex = (h, s, l) => {
  h = h % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (0 <= h && h < 60) [r, g, b] = [c, x, 0];
  else if (60 <= h && h < 120) [r, g, b] = [x, c, 0];
  else if (120 <= h && h < 180) [r, g, b] = [0, c, x];
  else if (180 <= h && h < 240) [r, g, b] = [0, x, c];
  else if (240 <= h && h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
};

const ColorSchemeWheel = ({ onBack, isDark = false, addToPalette, initialColor = '#3498db' }) => {
  const [baseColor, setBaseColor] = useState(initialColor);
  const canvasRef = useRef(null);
  const wheelSize = 320;
  const wheelRadius = wheelSize / 2;

  const { h: baseHue, s: baseSat, l: baseLum } = hexToHsl(baseColor);

  // Generate scheme colors
  const schemes = {
    Complementary: [(baseHue + 180) % 360],
    Analogous: [(baseHue - 30 + 360) % 360, (baseHue + 30) % 360],
    Triadic: [(baseHue + 120) % 360, (baseHue + 240) % 360],
    Tetradic: [(baseHue + 90) % 360, (baseHue + 180) % 360, (baseHue + 270) % 360],
  };

  const getSchemeColor = (hue) => hslToHex(hue, baseSat, baseLum);

  // Draw interactive wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, wheelSize, wheelSize);

    // Draw full HSL wheel (hue + saturation)
    const imageData = ctx.createImageData(wheelSize, wheelSize);
    for (let y = -wheelRadius; y < wheelRadius; y++) {
      for (let x = -wheelRadius; x < wheelRadius; x++) {
        const dx = x, dy = y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= wheelRadius) {
          const angle = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
          const sat = (dist / wheelRadius) * 100;
          const hex = hslToHex(angle, sat, baseLum);
          const { r, g, b } = hexToRgb(hex);
          const idx = ((y + wheelRadius) * wheelSize + (x + wheelRadius)) * 4;
          imageData.data[idx] = r;
          imageData.data[idx + 1] = g;
          imageData.data[idx + 2] = b;
          imageData.data[idx + 3] = 255;
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);

    // Draw base color indicator
    const angleRad = (baseHue * Math.PI) / 180;
    const dist = (baseSat / 100) * wheelRadius;
    const centerX = wheelSize / 2;
    const centerY = wheelSize / 2;
    const indicatorX = centerX + Math.cos(angleRad) * dist;
    const indicatorY = centerY + Math.sin(angleRad) * dist;

    ctx.beginPath();
    ctx.arc(indicatorX, indicatorY, 10, 0, 2 * Math.PI);
    ctx.fillStyle = baseColor;
    ctx.fill();
    ctx.strokeStyle = isDark ? '#ffffff' : '#000000';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [baseColor, isDark, baseLum]);

  // Handle canvas click to pick base color
  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - wheelRadius;
    const y = e.clientY - rect.top - wheelRadius;
    const dist = Math.sqrt(x * x + y * y);
    if (dist > wheelRadius) return;

    const angle = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    const sat = Math.min(100, (dist / wheelRadius) * 100);
    const newColor = hslToHex(angle, sat, baseLum);
    setBaseColor(newColor);
  };

  // Use final base color in main app (optional)
  const useAndClose = () => {
    if (addToPalette) addToPalette(baseColor); // or pass to main picker
    onBack();
  };

  return (
    <div className={`full-page-view ${isDark ? 'dark-mode' : ''}`} style={{ padding: '2rem', background: 'var(--bg)', color: 'var(--text)' }}>
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
          zIndex: 1000
        }}
      >
        Back
      </button>

      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <h1>🎨 Interactive Color Scheme Wheel</h1>
        <p>Click anywhere on the wheel to choose a base color. Schemes update in real time.</p>

        <div style={{ margin: '2rem auto', position: 'relative', display: 'inline-block' }}>
          <canvas
            ref={canvasRef}
            width={wheelSize}
            height={wheelSize}
            onClick={handleCanvasClick}
            style={{ borderRadius: '50%', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
          />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: baseColor,
            border: '3px solid white',
            boxShadow: '0 0 0 2px rgba(0,0,0,0.3)'
          }} />
        </div>

        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem' }}>
          {Object.entries(schemes).map(([name, hues]) => (
            <div key={name} style={{
              background: 'var(--bg-alt)',
              padding: '1rem',
              borderRadius: '10px',
              border: '1px solid var(--border)'
            }}>
              <h3 style={{ marginBottom: '0.8rem' }}>{name}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                {hues.map((hue, i) => {
                  const c = getSchemeColor(hue);
                  return (
                    <div
                      key={i}
                      onClick={() => addToPalette && addToPalette(c)}
                      style={{
                        width: '50px',
                        height: '50px',
                        background: c,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        border: '2px solid var(--border)',
                        transition: 'transform 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      title={c}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '2rem' }}>
          <code style={{ display: 'block', marginBottom: '1rem', fontSize: '1.1rem' }}>
            Base Color: {baseColor}
          </code>
          <button
            onClick={useAndClose}
            style={{
              padding: '0.6rem 1.5rem',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem'
            }}
          >
            Use Base Color & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorSchemeWheel;