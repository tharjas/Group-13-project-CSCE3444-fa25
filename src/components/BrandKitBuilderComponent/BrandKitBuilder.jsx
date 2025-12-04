import React, { useState, useEffect } from 'react';

// Color utility functions
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const hexToHsl = (hex) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return { h: 0, s: 0, l: 0 };
  
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
      default: h = 0;
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

const hslToHex = (h, s, l) => {
  s /= 100;
  l /= 100;
  
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  
  let r = 0, g = 0, b = 0;
  
  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
  
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join('');
};

const getLuminance = (hex) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
    val /= 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const getContrastRatio = (color1, color2) => {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
};

const generateShades = (baseColor, count = 9) => {
  const { h, s, l } = hexToHsl(baseColor);
  const shades = [];
  
  // Generate lighter to darker shades
  const lightnessValues = [95, 85, 75, 65, l, Math.max(35, l - 15), Math.max(25, l - 25), Math.max(15, l - 35), Math.max(5, l - 45)];
  
  for (let i = 0; i < count; i++) {
    shades.push({
      name: `${(i + 1) * 100}`,
      color: hslToHex(h, s, lightnessValues[i])
    });
  }
  
  return shades;
};

const BrandKitBuilder = ({ onBack, isDark, initialColor, addToPalette }) => {
  const [brandName, setBrandName] = useState('My Brand');
  const [primaryColor, setPrimaryColor] = useState(initialColor || '#2563eb');
  const [secondaryColor, setSecondaryColor] = useState('#7c3aed');
  const [accentColor, setAccentColor] = useState('#f59e0b');
  
  const [primaryShades, setPrimaryShades] = useState([]);
  const [secondaryShades, setSecondaryShades] = useState([]);
  const [accentShades, setAccentShades] = useState([]);
  
  const [successColor, setSuccessColor] = useState('#10b981');
  const [warningColor, setWarningColor] = useState('#f59e0b');
  const [errorColor, setErrorColor] = useState('#ef4444');
  const [infoColor, setInfoColor] = useState('#3b82f6');
  
  const [neutralGray, setNeutralGray] = useState('#6b7280');
  const [neutralShades, setNeutralShades] = useState([]);

  useEffect(() => {
    setPrimaryShades(generateShades(primaryColor));
  }, [primaryColor]);

  useEffect(() => {
    setSecondaryShades(generateShades(secondaryColor));
  }, [secondaryColor]);

  useEffect(() => {
    setAccentShades(generateShades(accentColor));
  }, [accentColor]);

  useEffect(() => {
    setNeutralShades(generateShades(neutralGray));
  }, [neutralGray]);

  const generateComplementary = () => {
    const { h, s, l } = hexToHsl(primaryColor);
    setSecondaryColor(hslToHex((h + 180) % 360, s, l));
  };

  const generateAnalogous = () => {
    const { h, s, l } = hexToHsl(primaryColor);
    setSecondaryColor(hslToHex((h + 30) % 360, s, l));
    setAccentColor(hslToHex((h - 30 + 360) % 360, s, l));
  };

  const generateTriadic = () => {
    const { h, s, l } = hexToHsl(primaryColor);
    setSecondaryColor(hslToHex((h + 120) % 360, s, l));
    setAccentColor(hslToHex((h + 240) % 360, s, l));
  };

  const exportAsJSON = () => {
    const brandKit = {
      brandName,
      colors: {
        primary: {
          base: primaryColor,
          shades: Object.fromEntries(primaryShades.map(s => [s.name, s.color]))
        },
        secondary: {
          base: secondaryColor,
          shades: Object.fromEntries(secondaryShades.map(s => [s.name, s.color]))
        },
        accent: {
          base: accentColor,
          shades: Object.fromEntries(accentShades.map(s => [s.name, s.color]))
        },
        semantic: {
          success: successColor,
          warning: warningColor,
          error: errorColor,
          info: infoColor
        },
        neutral: {
          base: neutralGray,
          shades: Object.fromEntries(neutralShades.map(s => [s.name, s.color]))
        }
      }
    };

    const blob = new Blob([JSON.stringify(brandKit, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${brandName.replace(/\s+/g, '-').toLowerCase()}-brand-kit.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsCSS = () => {
    let css = `:root {\n  /* ${brandName} Brand Colors */\n\n`;
    
    css += `  /* Primary Colors */\n`;
    primaryShades.forEach(shade => {
      css += `  --color-primary-${shade.name}: ${shade.color};\n`;
    });
    
    css += `\n  /* Secondary Colors */\n`;
    secondaryShades.forEach(shade => {
      css += `  --color-secondary-${shade.name}: ${shade.color};\n`;
    });
    
    css += `\n  /* Accent Colors */\n`;
    accentShades.forEach(shade => {
      css += `  --color-accent-${shade.name}: ${shade.color};\n`;
    });
    
    css += `\n  /* Semantic Colors */\n`;
    css += `  --color-success: ${successColor};\n`;
    css += `  --color-warning: ${warningColor};\n`;
    css += `  --color-error: ${errorColor};\n`;
    css += `  --color-info: ${infoColor};\n`;
    
    css += `\n  /* Neutral Colors */\n`;
    neutralShades.forEach(shade => {
      css += `  --color-neutral-${shade.name}: ${shade.color};\n`;
    });
    
    css += `}\n`;

    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${brandName.replace(/\s+/g, '-').toLowerCase()}-brand-kit.css`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyColor = (color) => {
    navigator.clipboard.writeText(color);
    alert(`Copied ${color} to clipboard!`);
  };

  const containerStyle = {
    minHeight: '100vh',
    background: isDark ? '#1a1a1a' : '#f5f5f5',
    color: isDark ? '#e9ecef' : '#212529',
    padding: '2rem',
    overflowY: 'auto'
  };

  const cardStyle = {
    background: isDark ? '#2d2d2d' : '#fff',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.2s',
    background: '#007bff',
    color: '#fff',
    marginRight: '0.5rem',
    marginBottom: '0.5rem'
  };

  const inputStyle = {
    padding: '0.5rem',
    borderRadius: '6px',
    border: isDark ? '2px solid #444' : '2px solid #ddd',
    background: isDark ? '#1a1a1a' : '#fff',
    color: isDark ? '#e9ecef' : '#212529',
    fontSize: '0.9rem',
    width: '100%'
  };

  const handleAddToPalette = (color) => {
    if (addToPalette) {
      const result = addToPalette(color);
      // Show success message
      alert(`✅ Color ${color} added to palette successfully!`);
    }
  };

  const ColorPicker = ({ label, color, setColor }) => (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
        {label}
      </label>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <input 
          type="color" 
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{ width: '80px', height: '50px', cursor: 'pointer', border: 'none', borderRadius: '6px' }}
        />
        <input 
          type="text" 
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{ ...inputStyle, width: '150px' }}
        />
        <button 
          onClick={() => handleAddToPalette(color)}
          style={{ ...buttonStyle, padding: '0.5rem 1rem' }}
        >
          Add to Palette
        </button>
      </div>
    </div>
  );

  const ShadeDisplay = ({ title, shades, baseColor }) => (
    <div style={cardStyle}>
      <h3 style={{ marginBottom: '1rem' }}>{title}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.5rem' }}>
        {shades.map((shade) => {
          const contrast = getContrastRatio(shade.color, '#ffffff');
          const textColor = contrast > 4.5 ? '#ffffff' : '#000000';
          
          return (
            <div 
              key={shade.name}
              style={{
                background: shade.color,
                padding: '1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'center',
                border: isDark ? '1px solid #444' : '1px solid #ddd',
                transition: 'transform 0.2s'
              }}
              onClick={() => {
                copyColor(shade.color);
                handleAddToPalette(shade.color);
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              title="Click to copy and add to palette"
            >
              <div style={{ color: textColor, fontWeight: '600', marginBottom: '0.25rem' }}>
                {shade.name}
              </div>
              <code style={{ color: textColor, fontSize: '0.75rem' }}>
                {shade.color}
              </code>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <button onClick={onBack} style={{ ...buttonStyle, marginBottom: '1.5rem', background: '#6c757d' }}>
          ← Back to Picker
        </button>

        <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>🏢 Brand Kit Builder</h1>

        {/* Brand Info */}
        <div style={cardStyle}>
          <h3 style={{ marginBottom: '1rem' }}>Brand Information</h3>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Brand Name
            </label>
            <input 
              type="text" 
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              style={inputStyle}
              placeholder="Enter your brand name"
            />
          </div>
        </div>

        {/* Color Selection */}
        <div style={cardStyle}>
          <h3 style={{ marginBottom: '1rem' }}>Base Colors</h3>
          
          <ColorPicker label="Primary Color" color={primaryColor} setColor={setPrimaryColor} />
          <ColorPicker label="Secondary Color" color={secondaryColor} setColor={setSecondaryColor} />
          <ColorPicker label="Accent Color" color={accentColor} setColor={setAccentColor} />
          
          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: isDark ? '1px solid #444' : '1px solid #ddd' }}>
            <h4 style={{ marginBottom: '1rem' }}>Quick Generate</h4>
            <button onClick={generateComplementary} style={buttonStyle}>
              Generate Complementary
            </button>
            <button onClick={generateAnalogous} style={buttonStyle}>
              Generate Analogous
            </button>
            <button onClick={generateTriadic} style={buttonStyle}>
              Generate Triadic
            </button>
          </div>
        </div>

        {/* Semantic Colors */}
        <div style={cardStyle}>
          <h3 style={{ marginBottom: '1rem' }}>Semantic Colors</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <ColorPicker label="✅ Success" color={successColor} setColor={setSuccessColor} />
            <ColorPicker label="⚠️ Warning" color={warningColor} setColor={setWarningColor} />
            <ColorPicker label="❌ Error" color={errorColor} setColor={setErrorColor} />
            <ColorPicker label="ℹ️ Info" color={infoColor} setColor={setInfoColor} />
          </div>
        </div>

        {/* Neutral Colors */}
        <div style={cardStyle}>
          <h3 style={{ marginBottom: '1rem' }}>Neutral/Gray Scale</h3>
          <ColorPicker label="Base Neutral" color={neutralGray} setColor={setNeutralGray} />
        </div>

        {/* Shade Displays */}
        <ShadeDisplay title="Primary Color Shades" shades={primaryShades} baseColor={primaryColor} />
        <ShadeDisplay title="Secondary Color Shades" shades={secondaryShades} baseColor={secondaryColor} />
        <ShadeDisplay title="Accent Color Shades" shades={accentShades} baseColor={accentColor} />
        <ShadeDisplay title="Neutral Shades" shades={neutralShades} baseColor={neutralGray} />

        {/* Export Options */}
        <div style={cardStyle}>
          <h3 style={{ marginBottom: '1rem' }}>Export Brand Kit</h3>
          <p style={{ marginBottom: '1rem', color: isDark ? '#aaa' : '#666' }}>
            Download your complete brand color system as design tokens
          </p>
          <button onClick={exportAsJSON} style={buttonStyle}>
            📦 Export as JSON
          </button>
          <button onClick={exportAsCSS} style={buttonStyle}>
            🎨 Export as CSS Variables
          </button>
        </div>

        {/* How to Use Guide */}
        <div style={{ 
          ...cardStyle, 
          background: isDark ? '#1a3a1a' : '#f0f9ff',
          border: isDark ? '2px solid #2d5f2d' : '2px solid #bfdbfe'
        }}>
          <h3 style={{ marginBottom: '1rem', color: isDark ? '#7dd87d' : '#1e40af' }}>
            📖 How to Use Brand Kit Builder
          </h3>
          <div style={{ fontSize: '0.95rem', lineHeight: '1.8' }}>
            <p style={{ marginBottom: '1rem' }}>
              <strong>Step 1: Set Your Brand Colors</strong><br />
              Choose your Primary, Secondary, and Accent colors using the color pickers. Click "Add to Palette" to save any color to your main palette for later use.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              <strong>Step 2: Quick Generation (Optional)</strong><br />
              Use the quick generation buttons to automatically create harmonious color combinations:
              <br />• <strong>Complementary:</strong> Creates a color opposite on the color wheel
              <br />• <strong>Analogous:</strong> Creates colors adjacent on the color wheel
              <br />• <strong>Triadic:</strong> Creates evenly spaced colors forming a triangle
            </p>
            <p style={{ marginBottom: '1rem' }}>
              <strong>Step 3: Configure Semantic Colors</strong><br />
              Set your Success (✅), Warning (⚠️), Error (❌), and Info (ℹ️) colors for UI feedback states.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              <strong>Step 4: Explore Shades</strong><br />
              The system automatically generates 9 shades (100-900) for each color. Click any shade to copy its hex code and add it to your main palette. The lighter shades (100-400) work great for backgrounds, while darker shades (600-900) are perfect for text and accents.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              <strong>Step 5: Export Your Brand Kit</strong><br />
              Download your complete color system as:
              <br />• <strong>JSON:</strong> Design tokens for use in design tools like Figma
              <br />• <strong>CSS Variables:</strong> Ready-to-use code for web development
            </p>
            <p style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              background: isDark ? '#2d2d2d' : '#fff',
              borderRadius: '8px',
              borderLeft: `4px solid ${isDark ? '#7dd87d' : '#1e40af'}`
            }}>
              💡 <strong>Pro Tip:</strong> Your main palette requires exactly 5 colors to save. Use the "Add to Palette" buttons throughout the Brand Kit Builder to quickly build your palette, then return to the main picker to save it!
            </p>
          </div>
        </div>

        {/* Usage Example */}
        <div style={cardStyle}>
          <h3 style={{ marginBottom: '1rem' }}>Usage Preview</h3>
          <div style={{ 
            background: primaryShades[0]?.color,
            padding: '2rem',
            borderRadius: '8px'
          }}>
            <div style={{
              background: '#fff',
              padding: '2rem',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ color: primaryColor, marginBottom: '1rem' }}>{brandName}</h2>
              <p style={{ color: neutralShades[7]?.color, marginBottom: '1rem' }}>
                This is how your brand colors work together in a real interface.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button style={{ ...buttonStyle, background: primaryColor, margin: 0 }}>
                  Primary Action
                </button>
                <button style={{ ...buttonStyle, background: secondaryColor, margin: 0 }}>
                  Secondary Action
                </button>
                <button style={{ ...buttonStyle, background: accentColor, margin: 0 }}>
                  Accent Action
                </button>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <span style={{ padding: '0.5rem 1rem', background: successColor, color: '#fff', borderRadius: '6px', fontSize: '0.875rem' }}>
                  Success
                </span>
                <span style={{ padding: '0.5rem 1rem', background: warningColor, color: '#fff', borderRadius: '6px', fontSize: '0.875rem' }}>
                  Warning
                </span>
                <span style={{ padding: '0.5rem 1rem', background: errorColor, color: '#fff', borderRadius: '6px', fontSize: '0.875rem' }}>
                  Error
                </span>
                <span style={{ padding: '0.5rem 1rem', background: infoColor, color: '#fff', borderRadius: '6px', fontSize: '0.875rem' }}>
                  Info
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandKitBuilder;