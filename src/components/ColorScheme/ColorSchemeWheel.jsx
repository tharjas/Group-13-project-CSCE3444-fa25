// src/components/ColorSchemeWheel.jsx
import React, { useState, useEffect, useRef } from 'react';

// Reuse your existing utils (or import from utils)
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

const ColorSchemeWheel = ({ color, setColor, onBack, isDark, addToPalette }) => {
  const wheelSize = 300;
  const wheelRadius = wheelSize / 2;
  const canvasRef = useRef(null);

  const { h: baseHue, s: baseSat, l: baseLum } = hexToHsl(color);

  // Generate scheme colors
  const schemes = {
    Complementary: [(baseHue + 180) % 360],
    Analogous: [(baseHue - 30 + 360) % 360, (baseHue + 30) % 360],
    Triadic: [(baseHue + 120) % 360, (baseHue + 240) % 360],
    Tetradic: [(baseHue + 90) % 360, (baseHue + 180) % 360, (baseHue + 270) % 360],
  };

  const getSchemeColor = (hue) => hslToHex(hue, baseSat, baseLum);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, wheelSize, wheelSize);

    // Draw base wheel
    const image = ctx.createImageData(wheelSize, wheelSize);
    for (let y = -wheelRadius; y < wheelRadius; y++) {
      for (let x = -wheelRadius; x < wheelRadius; x++) {
        const dx = x + 0.5, dy = y + 0.5;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= wheelRadius) {
          const angle = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
          const sat = (dist / wheelRadius) * 100;
          const hex = hslToHex(angle, sat, baseLum);
          const { r, g, b } = hexToRgb(hex);
          const idx = ((y + wheelRadius) * wheelSize + (x + wheelRadius)) * 4;
          image.data[idx] = r;
          image.data[idx + 1] = g;
          image.data[idx + 2] = b;
          image.data[idx + 3] = 255;
        }
      }
    }
    ctx.putImageData(image, 0, 0);

    // Draw base indicator
    ctx.beginPath();
    const angleRad = (baseHue * Math.PI) / 180;
    const dist = (baseSat / 100) * wheelRadius;
    const centerX = wheelSize / 2;
    const centerY = wheelSize / 2;
    const indicatorX = centerX + Math.cos(angleRad) * dist;
    const indicatorY = centerY + Math.sin(angleRad) * dist;
    ctx.arc(indicatorX, indicatorY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw scheme indicators
    Object.entries(schemes).forEach(([name, hues]) => {
      hues.forEach(hue => {
        const ang = (hue * Math.PI) / 180;
        const d = (baseSat / 100) * wheelRadius;
        const x = centerX + Math.cos(ang) * d;
        const y = centerY + Math.sin(ang) * d;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = getSchemeColor(hue);
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    });
  }, [color, baseLum, isDark]);

  const handleWheelClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - wheelRadius;
    const y = e.clientY - rect.top - wheelRadius;
    const angle = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    const dist = Math.sqrt(x * x + y * y);
    const sat = Math.min(100, (dist / wheelRadius) * 100);
    const newColor = hslToHex(angle, sat, baseLum);
    setColor(newColor);
  };

  return (
    <div className={`full-page-view ${isDark ? 'dark-mode' : ''}`} style={{ padding: '2rem', background: 'var(--bg)', color: 'var(--text)' }}>
      <button onClick={onBack} style={{ position: 'fixed', top: '1rem', left: '1rem', padding: '0.5rem 1rem', background: '#044997', color: 'white', border: 'none', borderRadius: '6px', zIndex: 1000 }}>
        Back to Picker
      </button>

      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '2rem' }}>🎨 Color Scheme Wheel</h1>
        <p>Click on the wheel or scheme markers to explore harmonious color combinations.</p>

        <div style={{ margin: '2rem auto', position: 'relative' }}>
          <canvas
            ref={canvasRef}
            width={wheelSize}
            height={wheelSize}
            onClick={handleWheelClick}
            style={{ cursor: 'pointer', borderRadius: '50%' }}
          />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', marginTop: '2rem' }}>
          {Object.entries(schemes).map(([name, hues]) => (
            <div key={name} style={{ textAlign: 'center' }}>
              <h3>{name}</h3>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                {hues.map((hue, i) => {
                  const c = getSchemeColor(hue);
                  return (
                    <div key={i} onClick={() => addToPalette(c)} style={{ cursor: 'pointer' }}>
                      <div style={{
                        width: '40px', height: '40px', background: c,
                        borderRadius: '4px', border: '1px solid #ccc'
                      }} />
                      <span style={{ fontSize: '0.75rem', display: 'block' }}>{c}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: isDark ? '#aaa' : '#666' }}>
          💡 Click any scheme color to add it to your palette.
        </p>
      </div>
    </div>
  );
};

export default ColorSchemeWheel;
