import React, { useState } from 'react';

const ExportOptions = ({ savedPalettes }) => {
  const [message, setMessage] = useState('');

  // Helper – turn a single palette into a string of hex codes (one per line)
  const paletteToString = (palette) => palette.join('\n');

  // Build the full export text
  const buildExportText = () => {
    if (savedPalettes.length === 0) return null;

    return savedPalettes
      .map((palette, i) => {
        const header = `palette ${i + 1}`;
        const colors = paletteToString(palette);
        return `${header}\n${colors}`;
      })
      .join('\n\n'); // two new-lines between palettes
  };

  // ---------- COPY TO CLIPBOARD ----------
  const handleCopy = async () => {
    if (savedPalettes.length === 0) {
      alert('No saved palettes to export.');
      return;
    }

    const text = buildExportText();
    try {
      await navigator.clipboard.writeText(text);
      setMessage('All palettes copied to clipboard!');
    } catch (err) {
      console.error(err);
      setMessage('Copy failed – try again.');
    }
    setTimeout(() => setMessage(''), 2500);
  };

  // ---------- DOWNLOAD AS .txt ----------
  const handleDownload = () => {
    if (savedPalettes.length === 0) {
      alert('No saved palettes to export.');
      return;
    }

    const text = buildExportText();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'all-color-palettes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setMessage('All palettes downloaded!');
    setTimeout(() => setMessage(''), 2500);
  };

  return (
    <div className="export-options">
      <button onClick={handleCopy}>Copy All Palettes</button>
      <button onClick={handleDownload}>Download All as .txt</button>

      {message && (
        <span style={{ marginLeft: '1rem', color: 'green', fontWeight: 500 }}>
          {message}
        </span>
      )}
    </div>
  );
};

export default ExportOptions;