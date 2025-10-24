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

// Calculate luminance to determine contrasting text color
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
  const primaryText = getContrastingColor(primaryColor);
  const secondaryText = getContrastingColor(secondaryColor);
  const accentText = getContrastingColor(accentColor);

  return (
    <div className="ui-mockups-modal" style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: bgColor, 
      padding: '2rem', 
      color: textColor, 
      overflowY: 'auto', 
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{ maxWidth: '1200px', width: '100%' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2.5rem', fontWeight: '600' }}>UI Mockups Preview</h1>
        <p style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '1.2rem', lineHeight: '1.6' }}>
          Explore how your color palette transforms a modern web application. Interact with elements to see hover effects and responsive design.
        </p>

        {/* Header/Navigation */}
        <header className="mockup-header" style={{ 
          backgroundColor: primaryColor, 
          padding: '1.5rem', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)', 
          position: 'sticky', 
          top: 0, 
          zIndex: 1000 
        }}>
          <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: '700', color: primaryText, letterSpacing: '1px' }}>ColorVision App</span>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              {['Home', 'Features', 'Pricing', 'Contact'].map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="mockup-link"
                  style={{ color: primaryText, textDecoration: 'none', fontSize: '1.1rem', fontWeight: '500' }}
                >
                  {item}
                </a>
              ))}
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="mockup-hero" style={{ 
          background: `linear-gradient(135deg, ${secondaryColor} 0%, ${primaryColor} 100%)`, 
          padding: '5rem 2rem', 
          textAlign: 'center',
          borderRadius: '12px',
          margin: '2rem 0'
        }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: secondaryText, fontWeight: '700' }}>Design with Confidence</h2>
          <p style={{ fontSize: '1.3rem', maxWidth: '700px', margin: '0 auto 2rem', color: secondaryText, lineHeight: '1.6' }}>
            Create accessible, beautiful designs with your custom color palette. Test your colors in a real-world application context.
          </p>
          <button
            className="mockup-button"
            style={{
              backgroundColor: accentColor,
              color: accentText,
              padding: '1rem 2.5rem',
              border: 'none',
              borderRadius: '50px',
              fontSize: '1.2rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            Try Now
          </button>
        </section>

        {/* Content Cards Section */}
        <section style={{ padding: '4rem 2rem', backgroundColor: bgColor }}>
          <h2 style={{ textAlign: 'center', marginBottom: '3rem', color: textColor, fontSize: '2rem', fontWeight: '600' }}>Explore Features</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { title: 'Color Selection', desc: 'Choose colors with ease using sliders or inputs.' },
              { title: 'Accessibility', desc: 'Ensure your palette meets WCAG standards.' },
              { title: 'Real-Time Preview', desc: 'See your colors in action instantly.' },
            ].map((card, index) => (
              <div
                key={index}
                className="mockup-card"
                style={{
                  backgroundColor: primaryColor,
                  padding: '2rem',
                  borderRadius: '12px',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }}
              >
                <h3 style={{ marginBottom: '1rem', color: primaryText, fontSize: '1.5rem', fontWeight: '600' }}>{card.title}</h3>
                <p style={{ marginBottom: '1.5rem', color: primaryText, lineHeight: '1.5' }}>{card.desc}</p>
                <button
                  className="mockup-button"
                  style={{
                    backgroundColor: accentColor,
                    color: accentText,
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '8px',
                    width: '100%',
                    fontSize: '1rem',
                    fontWeight: '500',
                  }}
                >
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Form Example Section */}
        <section style={{ backgroundColor: secondaryColor, padding: '4rem 2rem', borderRadius: '12px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '3rem', color: secondaryText, fontSize: '2rem', fontWeight: '600' }}>Get in Touch</h2>
          <form style={{ maxWidth: '600px', margin: '0 auto', display: 'grid', gap: '1.5rem', backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
            <input
              type="text"
              placeholder="Your Name"
              style={{
                padding: '1rem',
                border: `2px solid ${accentColor}`,
                borderRadius: '8px',
                backgroundColor: '#fff',
                color: '#333',
                fontSize: '1rem',
              }}
            />
            <input
              type="email"
              placeholder="Your Email"
              style={{
                padding: '1rem',
                border: `2px solid ${accentColor}`,
                borderRadius: '8px',
                backgroundColor: '#fff',
                color: '#333',
                fontSize: '1rem',
              }}
            />
            <textarea
              placeholder="Your Message"
              rows="5"
              style={{
                padding: '1rem',
                border: `2px solid ${accentColor}`,
                borderRadius: '8px',
                backgroundColor: '#fff',
                color: '#333',
                fontSize: '1rem',
              }}
            />
            <button
              type="submit"
              className="mockup-button"
              style={{
                backgroundColor: accentColor,
                color: accentText,
                padding: '1rem',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1.1rem',
                fontWeight: '600',
              }}
            >
              Send Message
            </button>
          </form>
        </section>

        {/* Footer */}
        <footer style={{ backgroundColor: primaryColor, padding: '2rem', textAlign: 'center', marginTop: '4rem', boxShadow: '0 -4px 12px rgba(0,0,0,0.1)' }}>
          <p style={{ color: primaryText, fontSize: '1rem' }}>&copy; 2025 ColorVision App. All rights reserved.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem' }}>
            {['Privacy', 'Terms', 'Support'].map((link, index) => (
              <a key={index} href="#" className="mockup-link" style={{ color: primaryText, textDecoration: 'none', fontSize: '0.9rem' }}>
                {link}
              </a>
            ))}
          </div>
        </footer>

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
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          Close Preview
        </button>
      </div>
    </div>
  );
};

export default UIMockups;