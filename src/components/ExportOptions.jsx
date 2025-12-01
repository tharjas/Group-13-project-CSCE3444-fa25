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

  // ---------- EXPORT AS PNG ----------
  // Renders a temporary DOM node representing the palette and captures it to PNG
  const exportPaletteAsPng = async (paletteArg) => {
    const palette = paletteArg || (savedPalettes.length > 0 && savedPalettes[savedPalettes.length - 1]);
    if (!palette || palette.length === 0) {
      alert('No palette available to export as PNG. Save a palette first.');
      return;
    }

    try {
      const { toPng } = await import('html-to-image');

      // Build an offscreen container that will be rendered for capture
      const container = document.createElement('div');
      container.style.display = 'flex';
      container.style.flexDirection = 'row';
      container.style.gap = '8px';
      container.style.padding = '12px';
      container.style.background = '#ffffff';
      container.style.border = '1px solid #e5e7eb';
      container.style.borderRadius = '6px';
      container.style.boxSizing = 'border-box';

      // Create swatches
      palette.forEach((hex) => {
        const sw = document.createElement('div');
        sw.style.width = '120px';
        sw.style.height = '120px';
        sw.style.background = hex;
        sw.style.borderRadius = '4px';
        sw.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
        sw.style.display = 'inline-block';
        sw.title = hex;
        container.appendChild(sw);
      });

      // Place offscreen but still renderable
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      document.body.appendChild(container);

      const dataUrl = await toPng(container, { backgroundColor: '#ffffff', cacheBust: true });

      // Download
      const a = document.createElement('a');
      a.href = dataUrl;
      const stamp = new Date().toISOString().replace(/[:.]/g, '-');
      a.download = `palette-${stamp}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // cleanup
      document.body.removeChild(container);

      setMessage('Palette exported as PNG!');
      setTimeout(() => setMessage(''), 2500);
    } catch (err) {
      console.error('PNG export failed', err);
      alert('Export as PNG failed. See console for details.');
    }
  };

  return (
    <div className="export-options">
      <button onClick={handleCopy}>Copy All Palettes</button>
      <button onClick={handleDownload}>Download All as .txt</button>
      <button onClick={() => exportPaletteAsPng()}>Export as PNG</button>

      {message && (
        <span style={{ marginLeft: '1rem', color: 'green', fontWeight: 500 }}>
          {message}
        </span>
      )}
    </div>
  );
};

export default ExportOptions;