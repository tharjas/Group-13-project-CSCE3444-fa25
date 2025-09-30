import React, { useState } from 'react';

// Helper conversions
const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const num = parseInt(hex, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgb(${r}, ${g}, ${b})`;
};

const hexToHsl = (hex) => {
  const rgb = hexToRgb(hex).match(/\d+/g).map(Number);
  let [r, g, b] = rgb.map(v => v / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) h = s = 0;
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: break;
    }
    h *= 60;
  }
  return `hsl(${Math.round(h)}, ${Math.round(s*100)}%, ${Math.round(l*100)}%)`;
};

const ExportOptions = ({ palette }) => {
  const [message, setMessage] = useState('');

  const copyToClipboard = () => {
    if (!palette.length) return;
    const textToCopy = palette.map(hex => 
      `${hex} | ${hexToRgb(hex)} | ${hexToHsl(hex)}`
    ).join('\n');
    navigator.clipboard.writeText(textToCopy).then(() => {
      setMessage('Palette copied!');
      setTimeout(() => setMessage(''), 2000);
    });
  };

  const downloadAsTxt = () => {
    if (!palette.length) return;
    const textToDownload = palette.map(hex => 
      `${hex} | ${hexToRgb(hex)} | ${hexToHsl(hex)}`
    ).join('\n');
    const blob = new Blob([textToDownload], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'color-palette.txt';
    a.click();
    URL.revokeObjectURL(url);
    setMessage('Palette downloaded!');
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className="export-options">
      <button onClick={copyToClipboard}>Copy to Clipboard</button>
      <button onClick={downloadAsTxt}>Download as .txt</button>
      {message && <span style={{ marginLeft: '1rem', color: 'green' }}>{message}</span>}
    </div>
  );
};

export default ExportOptions;
