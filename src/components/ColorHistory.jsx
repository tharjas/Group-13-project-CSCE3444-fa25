import React, { useEffect, useState } from 'react';
import {
  loadHistory,
  addColorToHistory,
  removeColorFromHistory,
  clearHistory,
  getHistory,
} from '../utils/colorHistory';

// A small, dependency-free component that displays recent colors as clickable boxes.
// Props:
// - history: optional array of hex strings (controlled mode). If provided, component is controlled and won't touch localStorage.
// - onSelect: function(hex) called when a color box is clicked. (required)
// - persist: boolean (default false). If true and `history` prop is NOT provided, component manages history in localStorage.
// - max: max items to show (default 10)
// - showClear: show a Clear button when using persisted mode (default true)

const swatchStyle = (hex) => ({
  width: '34px',
  height: '34px',
  borderRadius: '6px',
  border: '1px solid rgba(0,0,0,0.12)',
  boxShadow: '0 1px 0 rgba(255,255,255,0.2) inset',
  cursor: 'pointer',
  background: hex,
});

const ColorHistory = ({ history, onSelect, persist = false, max = 10, showClear = true }) => {
  const [localHistory, setLocalHistory] = useState(() => {
    if (history) return history.slice(0, max).map(String);
    if (persist) return loadHistory().slice(0, max);
    return [];
  });

  useEffect(() => {
    if (Array.isArray(history)) {
      setLocalHistory(history.slice(0, max).map(String));
    }
  }, [history, max]);

  // If using persistence and not controlled by prop, listen for storage changes
  useEffect(() => {
    if (!persist || history) return undefined;
    const onStorage = (e) => {
      if (e.key === 'colorHistory') setLocalHistory(loadHistory().slice(0, max));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [persist, history, max]);

  const handleClick = (hex) => {
    if (typeof onSelect === 'function') onSelect(hex);
    if (!history && persist) {
      const next = addColorToHistory(hex, max);
      setLocalHistory(next.slice(0, max));
    }
  };

  const handleRemove = (hex, e) => {
    e.stopPropagation();
    if (history) return; // controlled mode: don't mutate storage
    const next = removeColorFromHistory(hex);
    setLocalHistory(next.slice(0, max));
  };

  const handleClear = () => {
    if (history) return;
    clearHistory();
    setLocalHistory([]);
  };

  const items = (history && Array.isArray(history) ? history : localHistory).slice(0, max);

  return (
    <div className="color-history" style={{ marginTop: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        {items.length === 0 && <div style={{ color: '#666', fontSize: '0.9rem' }}>No recent colors</div>}
        {items.map((hex, i) => (
          <div key={hex + i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div
              title={hex}
              style={swatchStyle(hex)}
              onClick={() => handleClick(hex)}
              aria-label={`Recent color ${hex}`}
            />
            <button
              onClick={(e) => handleRemove(hex, e)}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '0.8rem',
                color: '#444',
                padding: 0,
              }}
              aria-label={`Remove ${hex} from history`}
            >
              ×
            </button>
          </div>
        ))}

        {/* Show Clear when using internal persisted history */}
        {!history && persist && showClear && items.length > 0 && (
          <button onClick={handleClear} style={{ marginLeft: '0.5rem' }}>
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default ColorHistory;
