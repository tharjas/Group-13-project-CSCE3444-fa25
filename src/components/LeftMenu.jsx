import React, { useState, useEffect, useMemo } from 'react';
import { hexToHsl, hslToHex } from '../utils/colorUtils';

const LeftMenu = ({ color, setColor, isDark, toggleDark }) => {
  // Sync local state with prop (for checkbox)
  const [localDark, setLocalDark] = useState(isDark);
  useEffect(() => {
    setLocalDark(isDark);
  }, [isDark]);

  const handleToggle = () => {
    toggleDark(!localDark);
  };

  const complementary = useMemo(() => {
    const { h, s, l } = hexToHsl(color);
    const compH = (h + 180) % 360;
    return hslToHex(compH, s, l);
  }, [color]);

  const analogous = useMemo(() => {
    const { h, s, l } = hexToHsl(color);
    const left = (h - 30 + 360) % 360;
    const right = (h + 30) % 360;
    return [hslToHex(left, s, l), hslToHex(right, s, l)];
  }, [color]);

  const { h, s, l } = hexToHsl(color);
  const rgb = (() => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  })();

  return (
    <aside className="side-menu left-menu">
      <h3>Color Tools</h3>

      <div className="menu-section">
        <div className="toggle-switch">
		  <label>
			<input
			  type="checkbox"
			  checked={localDark}
			  onChange={handleToggle}
			  aria-label="Toggle dark mode"
			/>
			<span className="slider"></span>
		  </label>
		  <span>Dark mode</span>
		</div>
      </div>

      <div className="menu-section">
        <h4>Complementary</h4>
        <div className="color-row">
          <div
            className="swatch"
            style={{ background: complementary }}
            onClick={() => setColor(complementary)}
          />
          <code>{complementary}</code>
        </div>
      </div>

      <div className="menu-section">
        <h4>Analogous</h4>
        {analogous.map((c, i) => (
          <div key={i} className="color-row">
            <div
              className="swatch"
              style={{ background: c }}
              onClick={() => setColor(c)}
            />
            <code>{c}</code>
          </div>
        ))}
      </div>

      <div className="menu-section">
        <h4>Info</h4>
        <p>HSL: {h}°, {s}%, {l}%</p>
        <p>{rgb}</p>
      </div>
    </aside>
  );
};

export default LeftMenu;