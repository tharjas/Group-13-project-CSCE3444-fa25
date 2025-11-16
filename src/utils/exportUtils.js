// Utilities for exporting palettes: JSON, CSS, text, and clipboard helpers

export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const downloadText = (text, filename) => {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  downloadBlob(blob, filename);
};

export const palettesToJSON = (savedPalettes = []) => {
  return savedPalettes.map((palette, i) => ({
    name: `palette-${i + 1}`,
    colors: palette,
  }));
};

export const exportPalettesAsJSON = (savedPalettes = [], filename = 'palettes.json') => {
  const data = palettesToJSON(savedPalettes);
  const text = JSON.stringify(data, null, 2);
  const blob = new Blob([text], { type: 'application/json;charset=utf-8' });
  downloadBlob(blob, filename);
};

export const paletteToCSSVariables = (palette = [], name = 'palette') => {
  // sanitize name for CSS class
  const safe = name.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
  const vars = palette
    .map((hex, i) => `  --${safe}-color-${i + 1}: ${hex};`)
    .join('\n');

  // produce both :root variables for global use and a class for scoped use
  return `/* Palette: ${name} */\n:root {\n${vars}\n}\n\n.${safe} {\n${vars}\n}\n`;
};

export const exportPalettesAsCSS = (savedPalettes = [], filename = 'palettes.css') => {
  if (!savedPalettes || savedPalettes.length === 0) {
    // still produce an empty file
    downloadText('/* no palettes */', filename);
    return;
  }

  const css = savedPalettes
    .map((p, i) => paletteToCSSVariables(p, `palette-${i + 1}`))
    .join('\n');

  const blob = new Blob([css], { type: 'text/css;charset=utf-8' });
  downloadBlob(blob, filename);
};

export const copyTextToClipboard = async (text) => {
  if (!navigator.clipboard) {
    // fallback: older browsers
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(ta);
      return true;
    } catch (e) {
      document.body.removeChild(ta);
      return false;
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    return false;
  }
};

export const exportPalettesAsText = (savedPalettes = [], filename = 'all-color-palettes.txt') => {
  if (!savedPalettes || savedPalettes.length === 0) {
    downloadText('', filename);
    return;
  }

  const text = savedPalettes
    .map((palette, i) => {
      const header = `palette ${i + 1}`;
      const colors = (palette || []).join('\n');
      return `${header}\n${colors}`;
    })
    .join('\n\n');

  downloadText(text, filename);
};

export const exportSinglePaletteAsJSON = (palette = [], name = 'palette', filename) => {
  const data = { name, colors: palette };
  const text = JSON.stringify(data, null, 2);
  const blob = new Blob([text], { type: 'application/json;charset=utf-8' });
  downloadBlob(blob, filename || `${name}.json`);
};

export const exportSinglePaletteAsCSS = (palette = [], name = 'palette', filename) => {
  const css = paletteToCSSVariables(palette, name);
  const blob = new Blob([css], { type: 'text/css;charset=utf-8' });
  downloadBlob(blob, filename || `${name}.css`);
};

export const buildPaletteString = (palette = []) => (palette || []).join('\n');

export const buildPalettesText = (savedPalettes = []) => {
  if (!savedPalettes || savedPalettes.length === 0) return '';
  return savedPalettes
    .map((palette, i) => {
      const header = `palette ${i + 1}`;
      const colors = (palette || []).join('\n');
      return `${header}\n${colors}`;
    })
    .join('\n\n');
};
