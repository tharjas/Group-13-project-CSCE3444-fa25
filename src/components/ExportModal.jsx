import React, { useState } from 'react';
import {
  exportPalettesAsJSON,
  exportPalettesAsCSS,
  exportPalettesAsText,
  exportSinglePaletteAsJSON,
  exportSinglePaletteAsCSS,
  buildPaletteString,
  buildPalettesText,
  copyTextToClipboard,
} from '../utils/exportUtils';

const modalStyle = {
  position: 'fixed',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 9999,
  background: 'white',
  padding: '1rem',
  borderRadius: '8px',
  boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
  width: 'min(520px, 95%)',
};

const backdropStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.35)',
  zIndex: 9998,
};

const ExportModal = ({ savedPalettes = [], onClose = () => {} }) => {
  const [mode, setMode] = useState('all'); // 'all' or 'single'
  const [format, setFormat] = useState('json'); // json | css | text
  const [index, setIndex] = useState(0); // selected palette index for single
  const [message, setMessage] = useState('');

  const hasPalettes = savedPalettes && savedPalettes.length > 0;

  const handleDownload = () => {
    if (!hasPalettes) {
      setMessage('No palettes available');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    if (mode === 'all') {
      if (format === 'json') exportPalettesAsJSON(savedPalettes);
      else if (format === 'css') exportPalettesAsCSS(savedPalettes);
      else exportPalettesAsText(savedPalettes);

      setMessage('Download started');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    // single palette
    const p = savedPalettes[index] || [];
    const name = `palette-${index + 1}`;
    if (format === 'json') exportSinglePaletteAsJSON(p, name);
    else if (format === 'css') exportSinglePaletteAsCSS(p, name);
    else {
      downloadText(buildPaletteString(p), `${name}.txt`);
    }

    setMessage('Download started');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleCopy = async () => {
    if (!hasPalettes) {
      setMessage('No palettes available');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    if (mode === 'all') {
      const txt = buildPalettesText(savedPalettes);
      const ok = await copyTextToClipboard(txt);
      setMessage(ok ? 'Copied all palettes' : 'Copy failed');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    const p = savedPalettes[index] || [];
    const txt = buildPaletteString(p);
    const ok = await copyTextToClipboard(txt);
    setMessage(ok ? 'Copied palette' : 'Copy failed');
    setTimeout(() => setMessage(''), 2000);
  };

  // helper for fallback download of single text
  const downloadText = (text, filename) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div style={backdropStyle} onClick={onClose} />
      <div style={modalStyle} role="dialog" aria-modal="true">
        <h3 style={{ marginTop: 0 }}>Export Palettes</h3>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
          <label>
            <input
              type="radio"
              checked={mode === 'all'}
              onChange={() => setMode('all')}
            />{' '}
            All Palettes
          </label>
          <label>
            <input
              type="radio"
              checked={mode === 'single'}
              onChange={() => setMode('single')}
              disabled={!hasPalettes}
            />{' '}
            Single Palette
          </label>

          {mode === 'single' && (
            <select
              value={index}
              onChange={(e) => setIndex(Number(e.target.value))}
              disabled={!hasPalettes}
            >
              {(savedPalettes || []).map((p, i) => (
                <option key={i} value={i}>
                  Palette {i + 1}
                </option>
              ))}
            </select>
          )}
        </div>

        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ marginRight: '0.75rem' }}>
            <input
              type="radio"
              checked={format === 'json'}
              onChange={() => setFormat('json')}
            />{' '}
            JSON
          </label>
          <label style={{ marginRight: '0.75rem' }}>
            <input
              type="radio"
              checked={format === 'css'}
              onChange={() => setFormat('css')}
            />{' '}
            CSS Variables
          </label>
          <label>
            <input
              type="radio"
              checked={format === 'text'}
              onChange={() => setFormat('text')}
            />{' '}
            Plain Text
          </label>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button onClick={handleDownload}>Download</button>
          <button onClick={handleCopy}>Copy</button>
          <button onClick={onClose} style={{ marginLeft: 'auto' }}>
            Close
          </button>
        </div>

        {message && <div style={{ marginTop: '0.75rem' }}>{message}</div>}

        <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#555' }}>
          Tip: JSON contains palette names and hex arrays; CSS variables are generated for
          each palette as both :root variables and a class name.
        </div>
      </div>
    </>
  );
};

export default ExportModal;
