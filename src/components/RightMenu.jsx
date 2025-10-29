import React, { useState, useMemo } from 'react';

const PRESET_PALETTES = [
  { name: 'Mono – Ocean', type: 'mono', colors: ['#0A3D62', '#1E5F8A', '#3C8EC7', '#6AB0E0', '#A3D2F5'] },
  { name: 'Mono – Sunset', type: 'mono', colors: ['#4A1C1C', '#7A2E2E', '#B34D4D', '#E07B7B', '#F2B3B3'] },
  { name: 'Analogous – Spring', type: 'analogous', colors: ['#6A994E', '#8AB96A', '#A7D68A', '#C4F0A8', '#E0FFC8'] },
  { name: 'Analogous – Fire', type: 'analogous', colors: ['#A63D1F', '#C95A3A', '#E87958', '#FF9A78', '#FFB99A'] },
  { name: 'Comp – Sky & Sand', type: 'complementary', colors: ['#1E90FF', '#FF8C00', '#87CEEB', '#FFA54F', '#B0E0E6'] },
  { name: 'Comp – Forest & Berry', type: 'complementary', colors: ['#2E8B57', '#DC143C', '#3CB371', '#FF4500', '#90EE90'] },
  { name: 'Triadic – Candy', type: 'triadic', colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57'] },
  { name: 'Tetradic – Retro', type: 'tetradic', colors: ['#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9', '#92A8D1'] },
];

const RightMenu = ({ setPalette, setColor, isDark }) => {
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return PRESET_PALETTES;
    return PRESET_PALETTES.filter(p => p.type === filter);
  }, [filter]);

  const applyPalette = (colors) => {
    setPalette(colors);
    setColor(colors[0]);
  };

  return (
    <aside className="side-menu right-menu">
      <h3>Preset Palettes</h3>

      <div className="filter-bar">
        {['all', 'mono', 'analogous', 'complementary', 'triadic', 'tetradic'].map(t => (
          <button
            key={t}
            className={filter === t ? 'active' : ''}
            onClick={() => setFilter(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="palette-grid">
        {filtered.map((pal, i) => (
          <div
            key={i}
            className="palette-card"
            onClick={() => applyPalette(pal.colors)}
          >
            <div className="palette-name">{pal.name}</div>
            <div className="palette-swatches">
              {pal.colors.map((c, j) => (
                <div
                  key={j}
                  className="mini-swatch"
                  style={{ background: c }}
                  title={c}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default RightMenu;