import React, { useState, useRef } from 'react';

const GradientGenerator = ({ selectedColor = '#ffffff', onPickColor }) => {
  const [color1, setColor1] = useState(selectedColor || '#ffffff');
  const [color2, setColor2] = useState('#FFFFFF');
  const [direction, setDirection] = useState('to right');
  const previewRef = useRef(null);
  const [message, setMessage] = useState('');

  const gradientCSS = `linear-gradient(${direction}, ${color1}, ${color2})`;
  const gradientStyle = {
    background: gradientCSS,
    width: '100%',
    height: '120px',
    borderRadius: '6px',
    border: '2px solid #ccc',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  // Copy CSS to clipboard
  const handleCopyCss = async () => {
    const cssString = `background: linear-gradient(${direction}, ${color1}, ${color2});`;
    try {
      await navigator.clipboard.writeText(cssString);
      setMessage('CSS copied to clipboard!');
      setTimeout(() => setMessage(''), 2500);
    } catch (err) {
      console.error('Copy failed:', err);
      setMessage('Copy failed – try again.');
      setTimeout(() => setMessage(''), 2500);
    }
  };

  // Export gradient preview as PNG
  const handleExportPng = async () => {
    try {
      const { toPng } = await import('html-to-image');

      // Create a temporary container for the gradient
      const container = document.createElement('div');
      container.style.width = '400px';
      container.style.height = '200px';
      container.style.background = gradientCSS;
      container.style.borderRadius = '6px';
      container.style.border = '2px solid #ccc';
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      document.body.appendChild(container);

      const dataUrl = await toPng(container, { backgroundColor: '#ffffff', cacheBust: true });

      // Trigger download
      const a = document.createElement('a');
      a.href = dataUrl;
      const stamp = new Date().toISOString().replace(/[:.]/g, '-');
      a.download = `gradient-${stamp}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Cleanup
      document.body.removeChild(container);

      setMessage('Gradient exported as PNG!');
      setTimeout(() => setMessage(''), 2500);
    } catch (err) {
      console.error('PNG export failed:', err);
      setMessage('Export failed. See console for details.');
      setTimeout(() => setMessage(''), 2500);
    }
  };

  return (
    <div className="gradient-generator" style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
      <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Gradient Generator</h2>

      {/* Color Inputs */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ marginBottom: '0.75rem' }}>
          <label htmlFor="color1" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>
            Color 1:
          </label>
          <input
            id="color1"
            type="color"
            value={color1}
            onChange={(e) => setColor1(e.target.value)}
            style={{ width: '100%', height: '40px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
          />
        </div>

        <div style={{ marginBottom: '0.75rem' }}>
          <label htmlFor="color2" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>
            Color 2:
          </label>
          <input
            id="color2"
            type="color"
            value={color2}
            onChange={(e) => setColor2(e.target.value)}
            style={{ width: '100%', height: '40px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* Direction Selector */}
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="direction" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>
          Direction:
        </label>
        <select
          id="direction"
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }}
        >
          <option value="to right">to right</option>
          <option value="to bottom">to bottom</option>
          <option value="to bottom right">to bottom right</option>
        </select>
      </div>

      {/* Gradient Preview */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
          Preview:
        </label>
        <div ref={previewRef} style={gradientStyle}></div>
      </div>

      {/* CSS Display */}
      <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all' }}>
        {`background: linear-gradient(${direction}, ${color1}, ${color2});`}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <button
          onClick={handleCopyCss}
          style={{
            flex: 1,
            padding: '0.75rem',
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 500,
          }}
        >
          Copy CSS
        </button>
        <button
          onClick={handleExportPng}
          style={{
            flex: 1,
            padding: '0.75rem',
            backgroundColor: '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 500,
          }}
        >
          Export PNG
        </button>
      </div>

      {/* Status Message */}
      {message && (
        <div style={{ padding: '0.5rem', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 500 }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default GradientGenerator;
