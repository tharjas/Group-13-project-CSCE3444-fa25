// src/components/ContrastChecker.jsx
import React, { useState } from 'react';

// WCAG Luminance & Contrast
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

const ContrastChecker = ({ palette, onClose }) => {
  const [isLargeText, setIsLargeText] = useState(false);

  const extended = [...palette];
  while (extended.length < 5) extended.push(extended[0] || '#FFFFFF');
  const [bg, primary, secondary, accent, text] = extended;

  // Lightest / darkest
  const getLuminance = (hex) => {
    const { r, g, b } = hexToRgb(hex);
    return 0.299 * (r / 255) + 0.587 * (g / 255) + 0.114 * (b / 255);
  };
  const luminances = extended.map(getLuminance);
  const lightest = extended[luminances.indexOf(Math.max(...luminances))];
  const darkest = extended[luminances.indexOf(Math.min(...luminances))];

  const keyPairs = [
    { label: 'Text on Background', fg: text, bg },
    { label: 'Primary Text on Primary', fg: getLuminance(primary) > 0.5 ? '#000' : '#FFF', bg: primary },
    { label: 'Secondary Text on Secondary', fg: getLuminance(secondary) > 0.5 ? '#000' : '#FFF', bg: secondary },
    { label: 'Accent Text on Accent', fg: getLuminance(accent) > 0.5 ? '#000' : '#FFF', bg: accent },
    { label: 'Darkest on Lightest', fg: darkest, bg: lightest },
    { label: 'Lightest on Darkest', fg: lightest, bg: darkest },
  ];

  const allPairs = [];
  extended.forEach((fg, i) => {
    extended.forEach((bg, j) => {
      if (i !== j) allPairs.push({ fg, bg });
    });
  });

  const getBadge = (ratio) => {
    const aa = isLargeText ? 3 : 4.5;
    const aaa = isLargeText ? 4.5 : 7;
    if (ratio >= aaa) return { text: 'AAA', class: 'badge-aaa' };
    if (ratio >= aa) return { text: 'AA', class: 'badge-aa' };
    return { text: 'Fail', class: 'badge-fail' };
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="contrast-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>

        <h2>WCAG Contrast Checker</h2>

        <div className="text-size-toggle">
          <label>
            <input
              type="checkbox"
              checked={isLargeText}
              onChange={(e) => setIsLargeText(e.target.checked)}
            />
            Large Text (≥18pt or bold ≥14pt)
          </label>
        </div>

        <h3>Key Pairs</h3>
        <table className="contrast-table">
          <thead>
            <tr>
              <th>Pair</th>
              <th>FG</th>
              <th>BG</th>
              <th>Ratio</th>
              <th>Level</th>
            </tr>
          </thead>
          <tbody>
            {keyPairs.map((p, i) => {
              const ratio = getContrastRatio(p.fg, p.bg).toFixed(2);
              const badge = getBadge(ratio);
              return (
                <tr key={i}>
                  <td>{p.label}</td>
                  <td><div className="swatch" style={{ background: p.fg }} /></td>
                  <td><div className="swatch" style={{ background: p.bg }} /></td>
                  <td>{ratio}:1</td>
                  <td><span className={`badge ${badge.class}`}>{badge.text}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <details style={{ marginTop: '1.5rem' }}>
          <summary>All Pairwise Contrasts</summary>
          <table className="contrast-table" style={{ marginTop: '1rem' }}>
            <thead>
              <tr>
                <th>FG</th>
                <th>BG</th>
                <th>Ratio</th>
                <th>Level</th>
              </tr>
            </thead>
            <tbody>
              {allPairs
                .map(p => ({ ...p, ratio: getContrastRatio(p.fg, p.bg) }))
                .sort((a, b) => a.ratio - b.ratio)
                .map((p, i) => {
                  const ratioStr = p.ratio.toFixed(2);
                  const badge = getBadge(p.ratio);
                  return (
                    <tr key={i}>
                      <td><div className="swatch" style={{ background: p.fg }} /> {p.fg}</td>
                      <td><div className="swatch" style={{ background: p.bg }} /> {p.bg}</td>
                      <td>{ratioStr}:1</td>
                      <td><span className={`badge ${badge.class}`}>{badge.text}</span></td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </details>
      </div>
    </div>
  );
};

export default ContrastChecker;