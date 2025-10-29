// src/components/UIMockups.jsx
import React from 'react';

// Helper function to convert HEX to RGB
const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
};

// Calculate luminance to determine contrasting text color and sort lightest/darkest
const getLuminance = (hex) => {
  const { r, g, b } = hexToRgb(hex);
  const rn = r / 255, gn = g / 255, bn = b / 255;
  return 0.299 * rn + 0.587 * gn + 0.114 * bn;
};

const getContrastingColor = (hex) => {
  return getLuminance(hex) > 0.5 ? '#000000' : '#FFFFFF';
};

const UIMockups = ({ palette, onClose }) => {
  // Fallback if palette has fewer than 5 colors
  const extendedPalette = [...palette];
  while (extendedPalette.length < 5) {
    extendedPalette.push(extendedPalette[0] || '#FFFFFF');
  }
  const [bgColor, primaryColor, secondaryColor, accentColor, textColor] = extendedPalette;

  // Calculate lightest and darkest for gradients
  const luminances = extendedPalette.map(getLuminance);
  const lightestIndex = luminances.indexOf(Math.max(...luminances));
  const darkestIndex = luminances.indexOf(Math.min(...luminances));
  const lightest = extendedPalette[lightestIndex];
  const darkest = extendedPalette[darkestIndex];

  // Derived colors with opacity for borders/shadows
  const borderColor = `${darkest}33`; // 20% opacity
  const shadowColor = `${darkest}1A`; // 10% opacity

  const primaryText = getContrastingColor(primaryColor);
  const secondaryText = getContrastingColor(secondaryColor);
  const accentText = getContrastingColor(accentColor);
  const bgText = getContrastingColor(bgColor);

  return (
    <div
      className="ui-mockups-modal"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(to bottom, ${lightest}, ${darkest})`, // Gradient blend
        padding: '2rem',
        color: bgText,
        overflowY: 'auto',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ maxWidth: '1200px', width: '100%' }}>
        {/* Color Palette Legend */}
        <section style={{ marginBottom: '3rem', padding: '1.5rem', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: `1px solid ${borderColor}`, boxShadow: `0 4px 12px ${shadowColor}` }}>
          <h2 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '1.5rem' }}>Color Palette Legend</h2>
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1rem' }}>
            {[
              { label: 'Background', color: bgColor },
              { label: 'Primary', color: primaryColor },
              { label: 'Secondary', color: secondaryColor },
              { label: 'Accent', color: accentColor },
              { label: 'Text/Neutral', color: textColor },
            ].map((item, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', backgroundColor: item.color, borderRadius: '8px', border: `1px solid ${borderColor}`, marginBottom: '0.5rem' }} />
                <p style={{ fontSize: '0.9rem', fontWeight: '500' }}>{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sticky Header */}
        <header
          style={{
            position: 'sticky',
            top: 0,
            backgroundColor: primaryColor,
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1000,
            boxShadow: `0 4px 12px ${shadowColor}`,
            borderBottom: `1px solid ${borderColor}`,
          }}
        >
          <h1 style={{ fontSize: '1.5rem', color: primaryText, fontWeight: '700' }}>ColorVision App</h1>
          <nav style={{ display: 'flex', gap: '1.5rem' }}>
            {['Home', 'Features', 'Pricing', 'Contact'].map((link, idx) => (
              <a
                key={idx}
                href="#"
                style={{
                  color: primaryText,
                  textDecoration: 'none',
                  fontSize: '1rem',
                  transition: 'color 0.3s, transform 0.3s',
                }}
                onMouseEnter={(e) => { e.target.style.color = accentColor; e.target.style.transform = 'scale(1.1)'; }}
                onMouseLeave={(e) => { e.target.style.color = primaryText; e.target.style.transform = 'scale(1)'; }}
              >
                {link}
              </a>
            ))}
          </nav>
        </header>

        {/* Hero Section with Gradient Overlay */}
        <section
          style={{
            padding: '6rem 2rem',
            textAlign: 'center',
            background: `linear-gradient(135deg, ${primaryColor}aa, ${secondaryColor}aa)`, // Semi-transparent gradient
            borderRadius: '16px',
            margin: '2rem 0',
            position: 'relative',
            overflow: 'hidden',
            border: `1px solid ${borderColor}`,
            boxShadow: `0 8px 24px ${shadowColor}`,
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15), transparent)' }} /> {/* Subtle radial glow */}
          <h2 style={{ fontSize: '3rem', fontWeight: '800', color: bgText, marginBottom: '1rem', position: 'relative' }}>Discover Your Perfect Palette</h2>
          <p style={{ fontSize: '1.4rem', maxWidth: '800px', margin: '0 auto 2rem', lineHeight: '1.6', position: 'relative' }}>
            Build, simulate, and preview stunning UI designs with ease.
          </p>
          <button
            style={{
              backgroundColor: accentColor,
              color: accentText,
              padding: '1rem 2.5rem',
              border: 'none',
              borderRadius: '50px',
              fontSize: '1.2rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.3s, box-shadow 0.3s',
              boxShadow: `0 4px 12px ${shadowColor}`,
            }}
            onMouseEnter={(e) => { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = `0 8px 20px ${shadowColor}`; }}
            onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = `0 4px 12px ${shadowColor}`; }}
          >
            Get Started
          </button>
        </section>

        {/* Features Section - Grid with Cards, Glassmorphism */}
        <section style={{ padding: '4rem 2rem' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.2rem', marginBottom: '3rem', color: bgText }}>Key Features</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { title: 'Color Wheel Picker', desc: 'Intuitive HSV-based selection with real-time previews.', icon: '🎨' },
              { title: 'Blindness Simulator', desc: 'Test accessibility for various color vision deficiencies.', icon: '👁️' },
              { title: 'Palette Export', desc: 'Download in HEX, RGB, HSL formats or copy to clipboard.', icon: '📤' },
              { title: 'UI Mockups', desc: 'Instantly preview your palette in a full web app layout.', icon: '🖥️' },
            ].map((feature, idx) => (
              <div
                key={idx}
                style={{
                  padding: '2rem',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(12px)', // Glassmorphism
                  borderRadius: '12px',
                  border: `1px solid rgba(255,255,255,0.2)`,
                  textAlign: 'center',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  boxShadow: `0 4px 12px ${shadowColor}`,
                }}
                onMouseEnter={(e) => { e.target.style.transform = 'translateY(-5px)'; e.target.style.boxShadow = `0 8px 20px ${shadowColor}`; }}
                onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = `0 4px 12px ${shadowColor}`; }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.8rem', color: bgText }}>{feature.title}</h3>
                <p style={{ fontSize: '1rem', color: bgText, opacity: 0.8 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Section - Table with Neumorphism */}
        <section style={{ padding: '4rem 2rem', backgroundColor: secondaryColor + '33', borderRadius: '16px', border: `1px solid ${borderColor}` }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.2rem', marginBottom: '3rem', color: secondaryText }}>Pricing Plans</h2>
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem' }}>
            {[
              { plan: 'Basic', price: '$0/mo', features: ['Core Picker', 'Basic Export'] },
              { plan: 'Pro', price: '$9/mo', features: ['Simulator', 'Mockups', 'Unlimited Saves'] },
              { plan: 'Enterprise', price: '$49/mo', features: ['All Pro', 'Team Collab', 'API Access'] },
            ].map((tier, idx) => (
              <div
                key={idx}
                style={{
                  flex: '1 1 300px',
                  padding: '2rem',
                  backgroundColor: bgColor,
                  borderRadius: '12px',
                  boxShadow: `8px 8px 16px ${shadowColor}, -8px -8px 16px rgba(255,255,255,0.05)`, // Neumorphism
                  textAlign: 'center',
                  border: `1px solid ${borderColor}`,
                  transition: 'box-shadow 0.3s',
                }}
                onMouseEnter={(e) => e.target.style.boxShadow = `12px 12px 24px ${shadowColor}, -12px -12px 24px rgba(255,255,255,0.05)`}
                onMouseLeave={(e) => e.target.style.boxShadow = `8px 8px 16px ${shadowColor}, -8px -8px 16px rgba(255,255,255,0.05)`}
              >
                <h3 style={{ fontSize: '1.6rem', color: bgText }}>{tier.plan}</h3>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: accentColor, margin: '1rem 0' }}>{tier.price}</p>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} style={{ margin: '0.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <span style={{ color: accentColor }}>✓</span> {feat}
                    </li>
                  ))}
                </ul>
                <button
                  style={{
                    marginTop: '1.5rem',
                    backgroundColor: accentColor,
                    color: accentText,
                    padding: '0.8rem 1.5rem',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Blog Preview Section - Cards with Images Placeholder */}
        <section style={{ padding: '4rem 2rem' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.2rem', marginBottom: '3rem', color: bgText }}>Latest Blog Posts</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {[
              { title: 'Color Theory 101', excerpt: 'Learn the basics of harmonious palettes.', date: 'Oct 2025' },
              { title: 'Accessibility Tips', excerpt: 'Ensure your designs are inclusive.', date: 'Sep 2025' },
              { title: '2025 Trends', excerpt: 'Futuristic colors and gradients.', date: 'Aug 2025' },
            ].map((post, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: `1px solid ${borderColor}`,
                  transition: 'transform 0.3s',
                  boxShadow: `0 4px 12px ${shadowColor}`,
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                <div style={{ height: '150px', background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }} /> {/* Placeholder image gradient */}
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: bgText }}>{post.title}</h3>
                  <p style={{ fontSize: '1rem', color: bgText, opacity: 0.7, marginBottom: '1rem' }}>{post.excerpt}</p>
                  <span style={{ fontSize: '0.8rem', color: accentColor }}>{post.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dashboard Snippet - Simple Chart and Stats */}
        <section style={{ padding: '4rem 2rem', backgroundColor: primaryColor + '33', borderRadius: '16px', border: `1px solid ${borderColor}` }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.2rem', marginBottom: '3rem', color: primaryText }}>Dashboard Overview</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
            {/* Stats Cards */}
            {[
              { label: 'Palettes Created', value: '1,234' },
              { label: 'Simulations Run', value: '567' },
              { label: 'Exports', value: '890' },
            ].map((stat, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1.5rem',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  textAlign: 'center',
                  minWidth: '200px',
                  border: `1px solid ${borderColor}`,
                }}
              >
                <p style={{ fontSize: '2.5rem', fontWeight: '700', color: accentColor }}>{stat.value}</p>
                <p style={{ fontSize: '1rem', color: primaryText }}>{stat.label}</p>
              </div>
            ))}
          </div>
          {/* Simple Bar Chart SVG */}
          <div style={{ marginTop: '3rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: primaryText }}>Usage Over Time</h3>
            <svg width="600" height="200" viewBox="0 0 600 200" style={{ maxWidth: '100%' }}>
              <rect x="50" y="100" width="80" height="100" fill={primaryColor} />
              <rect x="150" y="50" width="80" height="150" fill={secondaryColor} />
              <rect x="250" y="120" width="80" height="80" fill={accentColor} />
              <rect x="350" y="30" width="80" height="170" fill={primaryColor} />
              <rect x="450" y="80" width="80" height="120" fill={secondaryColor} />
              {/* Axes */}
              <line x1="30" y1="200" x2="570" y2="200" stroke={textColor} strokeWidth="2" />
              <line x1="30" y1="200" x2="30" y2="0" stroke={textColor} strokeWidth="2" />
            </svg>
          </div>
        </section>

        {/* Contact Form with Floating Labels */}
        <section style={{ padding: '4rem 2rem' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.2rem', marginBottom: '3rem', color: bgText }}>Get in Touch</h2>
          <form
            style={{
              maxWidth: '600px',
              margin: '0 auto',
              display: 'grid',
              gap: '1.5rem',
            }}
          >
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder=" "
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: `1px solid ${borderColor}`,
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  color: bgText,
                  fontSize: '1rem',
                  transition: 'border-color 0.3s',
                }}
                onFocus={(e) => { e.target.style.borderColor = accentColor; }}
                onBlur={(e) => { e.target.style.borderColor = borderColor; }}
              />
              <label style={{ position: 'absolute', left: '1rem', top: '1rem', color: bgText, opacity: 0.7, transition: 'all 0.3s', pointerEvents: 'none' }}>Name</label>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder=" "
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: `1px solid ${borderColor}`,
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  color: bgText,
                  fontSize: '1rem',
                  transition: 'border-color 0.3s',
                }}
                onFocus={(e) => { e.target.style.borderColor = accentColor; }}
                onBlur={(e) => { e.target.style.borderColor = borderColor; }}
              />
              <label style={{ position: 'absolute', left: '1rem', top: '1rem', color: bgText, opacity: 0.7, transition: 'all 0.3s', pointerEvents: 'none' }}>Email</label>
            </div>
            <div style={{ position: 'relative' }}>
              <textarea
                placeholder=" "
                rows="4"
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: `1px solid ${borderColor}`,
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  color: bgText,
                  fontSize: '1rem',
                  transition: 'border-color 0.3s',
                }}
                onFocus={(e) => { e.target.style.borderColor = accentColor; }}
                onBlur={(e) => { e.target.style.borderColor = borderColor; }}
              />
              <label style={{ position: 'absolute', left: '1rem', top: '1rem', color: bgText, opacity: 0.7, transition: 'all 0.3s', pointerEvents: 'none' }}>Message</label>
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: accentColor,
                color: accentText,
                padding: '1rem',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1.1rem',
                fontWeight: '600',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={(e) => { e.target.style.backgroundColor = `${accentColor}cc`; }} // Slightly darker on hover
              onMouseLeave={(e) => { e.target.style.backgroundColor = accentColor; }}
            >
              Send Message
            </button>
          </form>
        </section>

        {/* Footer with Social Icons */}
        <footer
          style={{
            backgroundColor: primaryColor,
            padding: '2rem',
            textAlign: 'center',
            marginTop: '4rem',
            boxShadow: `0 -4px 12px ${shadowColor}`,
            borderTop: `1px solid ${borderColor}`,
          }}
        >
          <p style={{ color: primaryText, fontSize: '1rem' }}>&copy; 2025 ColorVision App. All rights reserved.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem' }}>
            {['Privacy', 'Terms', 'Support'].map((link, idx) => (
              <a key={idx} href="#" style={{ color: primaryText, textDecoration: 'none', fontSize: '0.9rem' }}>
                {link}
              </a>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
            {['Twitter', 'LinkedIn', 'GitHub'].map((social, idx) => (
              <a
                key={idx}
                href="#"
                style={{
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: accentColor,
                  color: accentText,
                  borderRadius: '50%',
                  textDecoration: 'none',
                  fontSize: '1.2rem',
                  transition: 'transform 0.3s',
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                {social[0]} {/* Simple icon placeholder */}
              </a>
            ))}
          </div>
        </footer>

        {/* Close Button - Pill Shape */}
        <button
          onClick={onClose}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            padding: '1rem 2rem',
            backgroundColor: accentColor,
            color: accentText,
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: '600',
            boxShadow: `0 4px 12px ${shadowColor}`,
            transition: 'transform 0.3s',
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          Close Preview
        </button>
      </div>
    </div>
  );
};

export default UIMockups;