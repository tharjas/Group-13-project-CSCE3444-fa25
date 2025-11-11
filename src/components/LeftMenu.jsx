// FIXED: src/components/LeftMenu.jsx
// Compact icon buttons with tooltips + even spacing

import React, { useState, useEffect, useMemo } from 'react';
import { hexToHsl, hslToHex } from '../utils/colorUtils';

const LeftMenu = ({ color, setColor, isDark, toggleDark, setActiveView, setViewProps }) => {
  const [localDark, setLocalDark] = useState(isDark);
  useEffect(() => setLocalDark(isDark), [isDark]);

  const handleToggle = () => toggleDark(!localDark);

  const complementary = useMemo(() => {
    const { h, s, l } = hexToHsl(color);
    return hslToHex((h + 180) % 360, s, l);
  }, [color]);

  const analogous = useMemo(() => {
    const { h, s, l } = hexToHsl(color);
    const left = (h - 30 + 360) % 360;
    const right = (h + 30) % 360;
    return [hslToHex(left, s, l), hslToHex(right, s, l)];
  }, [color]);

  const { h, s, l } = hexToHsl(color);
  const rgb = `rgb(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)})`;

  const openMixingLab = () => {
    setActiveView('mixing-lab');
    setViewProps({ initialColor: color, setColor, isDark });
  };
  const openSchemeInfo = () => {
    setActiveView('scheme-info');
    setViewProps({ color, setColor, isDark });
  };
  const openContrastViewer = () => {
    setActiveView('contrast-viewer');
    setViewProps({ isDark });
  };
  const openAdditiveChallenge = () => {
  setActiveView('additive-challenge');
  setViewProps({ initialColor: color, setColor, isDark });
};


  return (
    <aside className="side-menu left-menu">
      <h3>Color Tools</h3>

      <div className="menu-section">
        <div className="toggle-switch">
          <label>
            <input type="checkbox" checked={localDark} onChange={handleToggle} aria-labelledby="darkModeLabel" />
            <span className="slider"></span>
            <span id="darkModeLabel" className="sr-only">Toggle dark mode</span>
          </label>
          <span>Dark mode</span>
        </div>
      </div>

      <div className="menu-section">
        <h4>Complementary</h4>
        <div className="color-row">
          <div className="swatch" style={{ background: complementary }} onClick={() => setColor(complementary)} />
          <code>{complementary}</code>
        </div>
      </div>

      <div className="menu-section">
        <h4>Analogous</h4>
        {analogous.map((c, i) => (
          <div key={i} className="color-row">
            <div className="swatch" style={{ background: c }} onClick={() => setColor(c)} />
            <code>{c}</code>
          </div>
        ))}
      </div>

      <div className="menu-section">
        <h4>Info</h4>
        <p>HSL: {h}°, {s}%, {l}%</p>
        <p>{rgb}</p>
      </div>

      {/* ----- ICON BUTTONS ----- */}
      <div className="menu-section">
        <h4>Advanced Tools</h4>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={openMixingLab}
            title="Color Mixing Lab"
            style={{
              width: '48px',
              height: '48px',
              background: '#fff',
              border: '2px solid #ccc',
              borderRadius: '8px',
              fontSize: '1.4rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,123,255,0.3)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
          >
            🧪
          </button>

          <button
            onClick={openSchemeInfo}
            title="Color Scheme Info"
            style={{
              width: '48px',
              height: '48px',
              background: '#fff',
              border: '2px solid #ccc',
              borderRadius: '8px',
              fontSize: '1.4rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,123,255,0.3)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
          >
            🎨
          </button>

          <button
            onClick={openContrastViewer}
            title="Live Contrast Viewer"
            style={{
              width: '48px',
              height: '48px',
              background: '#fff',
              border: '2px solid #ccc',
              borderRadius: '8px',
              fontSize: '1.4rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,123,255,0.3)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
          >
            👁️
          </button>
          <button
          onClick={openAdditiveChallenge}
          title="Color Addition Challenge"
          style={{
            width: '48px',
              height: '48px',
              background: '#fff',
              border: '2px solid #ccc',
              borderRadius: '8px',
              fontSize: '1.4rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            
             }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,123,255,0.3)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
>
  🔆
    </button>
          
        </div>
      </div>
    </aside>
  );
};

export default LeftMenu;