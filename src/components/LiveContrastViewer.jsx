// Updated src/components/LiveContrastViewer.jsx
// Added isDark prop and 'dark-mode' class
// FIXED: Back button now persistent (fixed position) and better contrast (blue bg, white text)
// Improved layout and styling for better UX
// Enhanced advice logic for low contrast scenarios

import React, { useState } from 'react';

const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const num = parseInt(hex, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
};

const getRelativeLuminance = (hex) => {
  const { r, g, b } = hexToRgb(hex);
  const linearize = (c) => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
};

const getContrastRatio = (fg, bg) => {
  const l1 = getRelativeLuminance(fg);
  const l2 = getRelativeLuminance(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

const LiveContrastViewer = ({ onBack, isDark }) => {
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [textColor, setTextColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(16);
  const [isBold, setIsBold] = useState(false);

  const ratio = getContrastRatio(textColor, bgColor).toFixed(2);
  const isLargeText = (fontSize >= 18) || (isBold && fontSize >= 14);
  const aaLevel = isLargeText ? 3 : 4.5;
  const aaaLevel = isLargeText ? 4.5 : 7;
  const passesAA = ratio >= aaLevel;
  const passesAAA = ratio >= aaaLevel;

  const level = passesAAA ? 'AAA' : passesAA ? 'AA' : 'Fail';

  const getAdvice = () => {
    if (passesAAA) return { text: "Excellent! Meets AAA standards for all text sizes.", type: "success" };
    if (passesAA) return { text: "Good! Meets AA standards. Suitable for most content.", type: "good" };

    const bgLum = getRelativeLuminance(bgColor);
    const textLum = getRelativeLuminance(textColor);
    const diff = Math.abs(bgLum - textLum);

    if (diff < 0.3) {
      return { text: "Colors are too similar in brightness. Try increasing saturation or using a darker/lighter version.", type: "warning" };
    }
    if (bgLum > 0.7 && textLum > 0.7) {
      return { text: "Both colors are very light. Try darkening the text significantly.", type: "warning" };
    }
    if (bgLum < 0.3 && textLum < 0.3) {
      return { text: "Both colors are very dark. Try lightening the text significantly.", type: "warning" };
    }
    return { text: "Contrast is too low. For dark backgrounds, use near-white text. For light backgrounds, use near-black text.", type: "error" };
  };

  const advice = getAdvice();

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

      <h1 style={{ textAlign: 'center', margin: '2rem 0' }}>Live Contrast Viewer</h1>
      <p style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem' }}>
        Test text readability on backgrounds. Adjust colors, size, and weight to see WCAG compliance in real-time.
      </p>

      <div style={{ maxWidth: '900px', margin: '0 auto 3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Background Color</label>
          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ width: '100%', height: '60px' }} />
          <code style={{ display: 'block', marginTop: '0.5rem' }}>{bgColor}</code>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Text Color</label>
          <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} style={{ width: '100%', height: '60px' }} />
          <code style={{ display: 'block', marginTop: '0.5rem' }}>{textColor}</code>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
            Font Size: {fontSize}pt {isLargeText && <span style={{ color: 'green', fontWeight: 'bold' }}>(Large Text - Lower Contrast OK)</span>}
          </label>
          <input
            type="range"
            min="8"
            max="48"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            id="bold"
            checked={isBold}
            onChange={(e) => setIsBold(e.target.checked)}
          />
          <label htmlFor="bold" style={{ fontWeight: '600' }}>Bold Text</label>
        </div>
      </div>

      <div style={{ margin: '3rem auto', maxWidth: '900px' }}>
        <div style={{
          background: bgColor,
          color: textColor,
          padding: '3rem',
          borderRadius: '16px',
          textAlign: 'center',
          fontSize: `${fontSize}pt`,
          fontWeight: isBold ? 'bold' : 'normal',
          minHeight: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0, lineHeight: 1.6 }}>This is an example! Your users will thank you for readable text.</p>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          display: 'inline-block',
          padding: '1rem 2rem',
          borderRadius: '12px',
          background: passesAAA ? '#d4edda' : passesAA ? '#fff3cd' : '#f8d7da',
          color: passesAAA ? '#155724' : passesAA ? '#856404' : '#721c24',
          marginBottom: '1rem'
        }}>
          <p style={{ margin: '0.5rem 0', fontSize: '1.2rem', fontWeight: '600' }}>
            Contrast Ratio: {ratio}:1
          </p>
          <p style={{ margin: '0.5rem 0' }}>
            WCAG Level: <span className={level.toLowerCase()}>{level}</span>
          </p>
        </div>

        <p style={{
          fontStyle: 'italic',
          color: advice.type === 'success' ? '#28a745' : advice.type === 'good' ? '#ffc107' : '#dc3545',
          fontWeight: '600'
        }}>
          {advice.text}
        </p>
      </div>
    </div>
  );
};

export default LiveContrastViewer;