// src/components/ColorDecomposition.jsx
import React, { useEffect, useState } from 'react';

// Reuse your existing utils (no need to redefine if already in scope)
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

const ColorDecomposition = ({ color }) => {
  const [tints, setTints] = useState([]);
  const [shades, setShades] = useState([]);
  const [tones, setTones] = useState([]);

  useEffect(() => {
    if (!color) return;

    const { h, s, l } = hexToHsl(color);

    // Generate 5 tints (increase lightness)
    const newTints = Array.from({ length: 5 }, (_, i) => {
      const newL = Math.min(100, l + (i + 1) * 10);
      return hslToHex(h, s, newL);
    });

    // Generate 5 shades (decrease lightness)
    const newShades = Array.from({ length: 5 }, (_, i) => {
      const newL = Math.max(0, l - (i + 1) * 10);
      return hslToHex(h, s, newL);
    });

    // Generate 5 tones (reduce saturation)
    const newTones = Array.from({ length: 5 }, (_, i) => {
      const newS = Math.max(0, s - (i + 1) * 15);
      return hslToHex(h, newS, l);
    });

    setTints(newTints);
    setShades(newShades);
    setTones(newTones);
  }, [color]);

  const formatColor = (hex) => {
    const { r, g, b } = hexToRgb(hex);
    const { h, s, l } = hexToHsl(hex);
    return `${hex} | RGB(${r},${g},${b}) | HSL(${h}°,${s}%,${l}%)`;
  };
const hexToRgb = (hex) => {
  if (!hex) return { r: 0, g: 0, b: 0 };
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
};

const rgbToHex = (r, g, b) => {
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  return (
    "#" +
    ((1 << 24) + (clamp(r) << 16) + (clamp(g) << 8) + clamp(b))
      .toString(16)
      .slice(1)
      .toUpperCase()
  );
};

const hexToHsl = (hex) => {
  const { r, g, b } = hexToRgb(hex);
  const rNorm = r / 255,
    gNorm = g / 255,
    bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
      default:
        break;
    }
    h *= 60;
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

const hslToHex = (h, s, l) => {
  h = h % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;
  if (0 <= h && h < 60) [r, g, b] = [c, x, 0];
  else if (60 <= h && h < 120) [r, g, b] = [x, c, 0];
  else if (120 <= h && h < 180) [r, g, b] = [0, c, x];
  else if (180 <= h && h < 240) [r, g, b] = [0, x, c];
  else if (240 <= h && h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
};

// Relative luminance (WCAG)
const luminance = ({ r, g, b }) => {
  const toLinear = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const R = toLinear(r);
  const G = toLinear(g);
  const B = toLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};

const contrastRatio = (hex1, hex2) => {
  const L1 = luminance(hexToRgb(hex1));
  const L2 = luminance(hexToRgb(hex2));
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return ((lighter + 0.05) / (darker + 0.05)).toFixed(2);
};

const wcagLevel = (ratio) => {
  const r = parseFloat(ratio);
  if (r >= 7) return "AAA";
  if (r >= 4.5) return "AA";
  if (r >= 3) return "AA (Large)";
  return "Fail";
};

/* ---------- Component ---------- */

const ColorDecomposition = ({ color }) => {
  const [tints, setTints] = useState([]);
  const [shades, setShades] = useState([]);
  const [tones, setTones] = useState([]);

  useEffect(() => {
    if (!color) return;

    const { h, s, l } = hexToHsl(color);

    // 5 lighter tints (↑ lightness)
    const newTints = Array.from({ length: 5 }, (_, i) => {
      const newL = Math.min(100, l + (i + 1) * 10);
      return hslToHex(h, s, newL);
    });

    // 5 darker shades (↓ lightness)
    const newShades = Array.from({ length: 5 }, (_, i) => {
      const newL = Math.max(0, l - (i + 1) * 10);
      return hslToHex(h, s, newL);
    });

    // 5 tones (↓ saturation)
    const newTones = Array.from({ length: 5 }, (_, i) => {
      const newS = Math.max(0, s - (i + 1) * 15);
      return hslToHex(h, newS, l);
    });

    setTints(newTints);
    setShades(newShades);
    setTones(newTones);
  }, [color]);

  // Build a single list with contrast info for the table
  const buildVariants = (arr, type) =>
    arr.map((hex) => {
      const cWhite = contrastRatio(hex, "#FFFFFF");
      const cBlack = contrastRatio(hex, "#000000");
      return {
        type,
        hex,
        contrastWhite: cWhite,
        contrastBlack: cBlack,
        wcagWhite: wcagLevel(cWhite),
        wcagBlack: wcagLevel(cBlack),
      };
    });

  const allVariants = [
    ...buildVariants(tints, "Tint"),
    ...buildVariants(shades, "Shade"),
    ...buildVariants(tones, "Tone"),
  ];

  const copyToClipboard = (hex) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(hex).catch(() => {});
    }
  };

  return (
    <div
      className="color-decomposition"
      style={{
        padding: "1.5rem",
        background: "var(--bg)",
        color: "var(--text)",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        border: "1px solid var(--border)",
        maxWidth: "100%",
        margin: "1rem auto",
      }}
    >
      <h3
        style={{
          marginBottom: "0.5rem",
          fontSize: "1.2rem",
          fontWeight: 600,
        }}
      >
        🎨 Accessibility-Aware Color Decomposition
      </h3>
      <p
        style={{
          fontSize: "0.9rem",
          marginBottom: "1rem",
          color: "var(--text-secondary)",
        }}
      >
        Starting from{" "}
        <code
          style={{
            fontWeight: "bold",
            background: "var(--bg-alt)",
            padding: "2px 6px",
            borderRadius: "4px",
          }}
        >
          {color}
        </code>{" "}
        we generate tints, shades and tones, and then compute WCAG contrast
        ratios against white and black so designers can see which variants are
        accessible.
      </p>

      {/* Tints / Shades / Tones grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
          marginBottom: "1.25rem",
        }}
      >
        {/* Tints */}
        <SwatchColumn
          title="➕ Tints (lighter)"
          colors={tints}
          onClick={copyToClipboard}
        />

        {/* Shades */}
        <SwatchColumn
          title="➖ Shades (darker)"
          colors={shades}
          onClick={copyToClipboard}
        />

        {/* Tones */}
        <SwatchColumn
          title="🟨 Tones (less saturated)"
          colors={tones}
          onClick={copyToClipboard}
        />
      </div>

      {/* Contrast table */}
      <div
        style={{
          background: "var(--bg-alt)",
          padding: "1rem",
          borderRadius: "8px",
          border: "1px solid var(--border)",
          overflowX: "auto",
        }}
      >
        <h4
          style={{
            marginBottom: "0.75rem",
            fontSize: "1rem",
            fontWeight: 600,
          }}
        >
          👁️ WCAG Contrast Breakdown
        </h4>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.8rem",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Swatch</th>
              <th style={thStyle}>HEX</th>
              <th style={thStyle}>vs White</th>
              <th style={thStyle}>vs Black</th>
            </tr>
          </thead>
          <tbody>
            {allVariants.map((v, i) => (
              <tr key={i}>
                <td style={tdStyle}>{v.type}</td>
                <td style={tdStyle}>
                  <div
                    style={{
                      width: "32px",
                      height: "16px",
                      borderRadius: "4px",
                      border: "1px solid var(--border)",
                      background: v.hex,
                      margin: "0 auto",
                    }}
                  />
                </td>
                <td style={{ ...tdStyle, fontFamily: "monospace" }}>{v.hex}</td>
                <td style={tdStyle}>
                  {v.contrastWhite} <Badge level={v.wcagWhite} />
                </td>
                <td style={tdStyle}>
                  {v.contrastBlack} <Badge level={v.wcagBlack} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p
          style={{
            marginTop: "0.75rem",
            fontSize: "0.75rem",
            color: "var(--text-secondary)",
          }}
        >
          💡 AA / AAA labels follow WCAG 2.1 thresholds for normal body text.
          This turns the palette into an accessibility tool instead of just
          another color list.
        </p>
      </div>
    </div>
  );
};

/* ---------- Small sub-components ---------- */

const SwatchColumn = ({ title, colors, onClick }) => (
  <div
    style={{
      background: "var(--bg-alt)",
      padding: "1rem",
      borderRadius: "8px",
      border: "1px solid var(--border)",
    }}
  >
    <h4
      style={{
        marginBottom: "0.5rem",
        fontSize: "1rem",
        fontWeight: 600,
      }}
    >
      {title}
    </h4>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
      {colors.map((c, i) => (
        <button
          key={i}
          onClick={() => onClick(c)}
          title={`Click to copy ${c}`}
          style={{
            textAlign: "center",
            cursor: "pointer",
            transition: "transform 0.15s, box-shadow 0.15s",
            border: "none",
            background: "transparent",
            padding: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              background: c,
              border: "2px solid var(--border)",
              borderRadius: "6px",
            }}
          />
          <span
            style={{
              fontSize: "0.7rem",
              display: "block",
              marginTop: "0.2rem",
              fontWeight: 500,
              color: "var(--text)",
            }}
          >
            {c}
          </span>
        </button>
      ))}
    </div>
  </div>
);

const Badge = ({ level }) => {
  const color =
    level === "Fail"
      ? "#B00020"
      : level.startsWith("AAA")
      ? "#0B875B"
      : "#1E88E5";
  const label = level === "AA (Large)" ? "AA-L" : level;
  return (
    <span
      style={{
        marginLeft: "0.35rem",
        fontSize: "0.7rem",
        padding: "0.1rem 0.3rem",
        borderRadius: "999px",
        border: `1px solid ${color}`,
        color,
      }}
    >
      {label}
    </span>
  );
};

const thStyle = {
  textAlign: "left",
  padding: "0.35rem 0.4rem",
  borderBottom: "1px solid var(--border)",
};

const tdStyle = {
  padding: "0.3rem 0.4rem",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap",
};

export default ColorDecomposition;
  return (
    <div className="color-decomposition" style={{
      padding: '1.5rem',
      background: 'var(--bg)',
      color: 'var(--text)',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: '1px solid var(--border)',
      maxWidth: '100%',
      margin: '1rem auto'
    }}>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem', fontWeight: '600' }}>🎨 Color Decomposition</h3>
      <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
        Derived variants of <code style={{ fontWeight: 'bold', background: 'var(--bg-alt)', padding: '2px 6px', borderRadius: '4px' }}>{color}</code>
      </p>

      {/* Tints, Shades, Tones in a grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
        marginBottom: '1rem'
      }}>

        {/* Tints */}
        <div style={{
          background: 'var(--bg-alt)',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid var(--border)'
        }}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '600' }}>➕ Tints</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {tints.map((c, i) => (
              <div key={i} style={{
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                position: 'relative'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{
                  width: '50px', height: '50px', background: c,
                  border: '2px solid var(--border)',
                  borderRadius: '6px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }} />
                <span style={{
                  fontSize: '0.7rem',
                  display: 'block',
                  marginTop: '0.2rem',
                  fontWeight: '500',
                  color: 'var(--text)'
                }}>{c}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shades */}
        <div style={{
          background: 'var(--bg-alt)',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid var(--border)'
        }}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '600' }}>➖ Shades</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {shades.map((c, i) => (
              <div key={i} style={{
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                position: 'relative'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{
                  width: '50px', height: '50px', background: c,
                  border: '2px solid var(--border)',
                  borderRadius: '6px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }} />
                <span style={{
                  fontSize: '0.7rem',
                  display: 'block',
                  marginTop: '0.2rem',
                  fontWeight: '500',
                  color: 'var(--text)'
                }}>{c}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tones */}
        <div style={{
          background: 'var(--bg-alt)',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid var(--border)'
        }}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '600' }}>🟨 Tones</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {tones.map((c, i) => (
              <div key={i} style={{
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                position: 'relative'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{
                  width: '50px', height: '50px', background: c,
                  border: '2px solid var(--border)',
                  borderRadius: '6px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }} />
                <span style={{
                  fontSize: '0.7rem',
                  display: 'block',
                  marginTop: '0.2rem',
                  fontWeight: '500',
                  color: 'var(--text)'
                }}>{c}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Info Bar */}
      <div style={{
        background: 'var(--bg-alt)',
        padding: '0.75rem',
        borderRadius: '8px',
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        textAlign: 'center',
        marginTop: '1rem',
        border: '1px solid var(--border)'
      }}>
        💡 <strong>Tints</strong> = ↑ Lightness | <strong>Shades</strong> = ↓ Lightness | <strong>Tones</strong> = ↓ Saturation
      </div>
    </div>
  );
};

export default ColorDecomposition;
