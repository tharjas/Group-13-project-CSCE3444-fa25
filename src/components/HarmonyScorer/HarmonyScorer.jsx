// src/components/HarmonyScorer.jsx
import React from 'react';

const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const num = parseInt(hex, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
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

const rgbToHex = (r, g, b) => {
  const clamp = (val) => Math.max(0, Math.min(255, Math.round(val)));
  return `#${((1 << 24) + (clamp(r) << 16) + (clamp(g) << 8) + clamp(b))
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
};

// Now hexToHsl can safely use hexToRgb
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

const getContrastRatio = (fg, bg) => {
  const getLuminance = (hex) => {
    const { r, g, b } = hexToRgb(hex);
    const linearize = (c) => {
      c /= 255;
      return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
  };

  const l1 = getLuminance(fg);
  const l2 = getLuminance(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

const calculateHarmonyScore = (palette) => {
  if (palette.length < 2) return { score: 0, feedback: [], suggestion: null };

  const hues = palette.map(hex => hexToHsl(hex).h);
  const luminances = palette.map(hex => {
    const { r, g, b } = hexToRgb(hex);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  });

  // 1. Hue Distribution (Spacing on wheel)
  const sortedHues = [...hues].sort((a, b) => a - b);
  const gaps = [];
  for (let i = 0; i < sortedHues.length; i++) {
    const next = sortedHues[(i + 1) % sortedHues.length];
    let gap = next - sortedHues[i];
    if (gap < 0) gap += 360;
    gaps.push(gap);
  }
  const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  const hueScore = Math.min(100, (avgGap / 60) * 20); // Max 100 for ~180° avg gap

  // 2. Contrast Ratios (Min contrast between any two)
  let minContrast = Infinity;
  for (let i = 0; i < palette.length; i++) {
    for (let j = i + 1; j < palette.length; j++) {
      const ratio = getContrastRatio(palette[i], palette[j]);
      if (ratio < minContrast) minContrast = ratio;
    }
  }
  const contrastScore = Math.min(100, minContrast * 10); // Scale: 1:1 → 0, 10:1 → 100

  // 3. Similarity Tolerance (How close hues are)
  let similarPairs = 0;
  for (let i = 0; i < hues.length; i++) {
    for (let j = i + 1; j < hues.length; j++) {
      const diff = Math.min(Math.abs(hues[i] - hues[j]), 360 - Math.abs(hues[i] - hues[j]));
      if (diff < 30) similarPairs++;
    }
  }
  const similarityScore = Math.max(0, 100 - (similarPairs * 15)); // Penalize close hues

  // 4. Luminance Spread (Avoid all light/dark)
  const lumRange = Math.max(...luminances) - Math.min(...luminances);
  const luminanceScore = Math.min(100, (lumRange / 255) * 50);

  // Final weighted score
  const score = Math.round(
    (hueScore * 0.3) +
    (contrastScore * 0.3) +
    (similarityScore * 0.2) +
    (luminanceScore * 0.2)
  );

  // Generate feedback
  const feedback = [];

  if (similarPairs > 1) {
    feedback.push("⚠️ Too many colors are close in hue — try spreading them out on the wheel.");
  }

  if (minContrast < 3) {
    feedback.push("⚠️ Add more contrast — consider using near-black/white for high-impact pairs.");
  }

  if (lumRange < 50) {
    feedback.push("⚠️ All colors are too similar in brightness — add lighter/darker tones.");
  }

  // Suggest replacement (simple: pick most contrasting color to average)
  let suggestion = null;
  if (feedback.length > 0) {
    const avgHue = hues.reduce((a, b) => a + b, 0) / hues.length;
    const avgLum = luminances.reduce((a, b) => a + b, 0) / luminances.length;
    const suggestedHue = (avgHue + 180) % 360;
    const suggestedLum = avgLum > 128 ? 30 : 220; // Darker if avg is light, vice versa
    suggestion = hslToHex(suggestedHue, 80, suggestedLum / 255 * 100);
  }

  // Label based on score
  let label = "Needs Work";
  if (score >= 80) label = "Balanced & Flexible";
  else if (score >= 60) label = "Functional";

  return { score, feedback, suggestion, label };
};

const HarmonyScorer = ({ palette }) => {
  const { score, feedback, suggestion, label } = calculateHarmonyScore(palette);

  return (
    <div style={{
      background: 'rgba(0,0,0,0.05)',
      padding: '1rem',
      borderRadius: '8px',
      marginTop: '1rem',
      border: '1px solid rgba(0,0,0,0.1)'
    }}>
      <h3>🎨 Palette Harmony Score</h3>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: score >= 80 ? '#28a745' : score >= 60 ? '#ffc107' : '#dc3545' }}>
        {score}/100 — <span style={{ fontWeight: 'normal' }}>{label}</span>
      </div>

      {feedback.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <strong>Feedback:</strong>
          <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0' }}>
            {feedback.map((msg, i) => <li key={i}>{msg}</li>)}
          </ul>
        </div>
      )}

      {suggestion && (
        <div style={{ marginTop: '1rem' }}>
          <strong>Suggested Replacement:</strong>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <div
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: suggestion,
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            ></div>
            <code>{suggestion}</code>
            <button
              onClick={() => navigator.clipboard.writeText(suggestion)}
              style={{
                padding: '0.2rem 0.5rem',
                fontSize: '0.8rem',
                background: '#044997',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HarmonyScorer;