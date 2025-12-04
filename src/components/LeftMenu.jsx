// src/components/LeftMenu.jsx
// Compact icon buttons with tooltips + even spacing
// REMOVED: Color Scheme Wheel button as requested

import React, { useState, useEffect, useMemo } from 'react';
import { hexToHsl, hslToHex } from '../utils/colorUtils';
import GradientGenerator from './GradientGenerator';

const LeftMenu = ({ color, setColor, isDark, toggleDark, setActiveView, setViewProps,addToPalette }) => {
  const [localDark, setLocalDark] = useState(isDark);
  const [showGradientGenerator, setShowGradientGenerator] = useState(false);
  useEffect(() => setLocalDark(isDark), [isDark]);

  const handleToggle = () => toggleDark(!localDark);

  const [tints, setTints] = useState([]);
  const [shades, setShades] = useState([]);
  const [tones, setTones] = useState([]);

  useEffect(() => {
    const { h, s, l } = hexToHsl(color);
    setTints(Array.from({ length: 5 }, (_, i) => hslToHex(h, s, Math.min(100, l + (i + 1) * 10))));
    setShades(Array.from({ length: 5 }, (_, i) => hslToHex(h, s, Math.max(0, l - (i + 1) * 10))));
    setTones(Array.from({ length: 5 }, (_, i) => hslToHex(h, Math.max(0, s - (i + 1) * 15), l)));
  }, [color]);

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
  const openSchemeWheel = () => {
    setActiveView('scheme-wheel');
    setViewProps({ color, setColor, isDark, addToPalette }); // ✅ now defined
  };

  // NEW: Open Image Palette Extractor
  const openImageExtractor = () => {
    setActiveView('image-extractor');
    setViewProps({ isDark, addToPalette });
  };
  const openBrandKitBuilder = () => {
    setActiveView('brand-kit-builder');
    setViewProps({ initialColor: color, setColor, isDark, addToPalette });
  };


  const buttonStyle = {
    width: '48px',
    height: '48px',
    background: isDark ? '#1e1e1e' : '#fff',
    border: isDark ? '2px solid #343a40' : '2px solid #ccc',
    borderRadius: '8px',
    fontSize: '1.4rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    color: isDark ? '#e9ecef' : '#212529'
  };

  const toggleGradientGenerator = () => {
    setShowGradientGenerator(!showGradientGenerator);
  };

  // REMOVED: openSchemeWheel function and related button
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
        <h4>Tints</h4>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {tints.map((c, i) => (
            <div key={i} className="swatch" style={{ background: c, width: '24px', height: '24px', cursor: 'pointer', borderRadius: '4px' }} onClick={() => setColor(c)} title={c} />
          ))}
        </div>
      </div>

      <div className="menu-section">
        <h4>Shades</h4>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {shades.map((c, i) => (
            <div key={i} className="swatch" style={{ background: c, width: '24px', height: '24px', cursor: 'pointer', borderRadius: '4px' }} onClick={() => setColor(c)} title={c} />
          ))}
        </div>
      </div>

      <div className="menu-section">
        <h4>Tones</h4>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {tones.map((c, i) => (
            <div key={i} className="swatch" style={{ background: c, width: '24px', height: '24px', cursor: 'pointer', borderRadius: '4px' }} onClick={() => setColor(c)} title={c} />
          ))}
        </div>
      </div>

      {/* ----- ICON BUTTONS ----- */}
      <div className="menu-section">
        <h4>Advanced Tools</h4>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={openMixingLab}
            title="Color Mixing Lab"
            style={buttonStyle}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,123,255,0.3)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
          >
            🧪
          </button>

          <button
            onClick={openSchemeInfo}
            title="Color Scheme Info"
            style={buttonStyle}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,123,255,0.3)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
          >
            🎨
          </button>

          <button
            onClick={openContrastViewer}
            title="Live Contrast Viewer"
            style={buttonStyle}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,123,255,0.3)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
          >
            👁️
          </button>

          <button
            onClick={openAdditiveChallenge}
            title="Color Addition Challenge"
            style={buttonStyle}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,123,255,0.3)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
          >
            🔆
          </button>
          <button
            onClick={openSchemeWheel}
            title="Color Scheme Wheel"
            style={buttonStyle}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,123,255,0.3)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
          >
            🌀
          </button>

          <button
            onClick={toggleGradientGenerator}
            title="Gradient Generator"
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
            🌈
          </button>
           {/* NEW: Image Palette Extractor Button */}
          <button
            onClick={openImageExtractor}
            title="Extract Palette from Image"
            style={buttonStyle}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,123,255,0.3)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
          >
            🖼️
          </button>
          {/* NEW: Brand Kit Builder Button */}
          <button
            onClick={openBrandKitBuilder}
            title="Brand Kit Builder"
            style={buttonStyle}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,123,255,0.3)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
          >
            🏢
          </button>

        </div>
      </div>

      {/* Gradient Generator Accordion */}
      {showGradientGenerator && (
        <div className="menu-section">
          <GradientGenerator selectedColor={color} onPickColor={setColor} />
        </div>
      )}
    </aside>
  );
};

export default LeftMenu;