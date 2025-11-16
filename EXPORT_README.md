Export features added (no existing files modified)

Files added:
- src/utils/exportUtils.js — helpers to export palettes as JSON, CSS, plain text, and copy to clipboard.
- src/components/ExportModal.jsx — small modal UI to choose export options (single/all, format) and perform export.
- src/components/ExportButton.jsx — simple button that opens the modal.

How to integrate into the app (example):

1. Import the button where you manage or display saved palettes, for example in `PaletteManager.jsx` or `SavedPalettes.jsx`:

   import ExportButton from './components/ExportButton';

   // then render it and pass the saved palettes array (example prop name `savedPalettes`):
   <ExportButton savedPalettes={savedPalettes} />

2. The modal uses `savedPalettes` as an array of palettes where each palette is an array of hex strings (e.g. ["#FF0000", "#00FF00"]). This matches the project's existing `ExportOptions` and saved palette formats.

Notes and capabilities:
- Download formats: JSON (.json), CSS (.css) with variables, plain text (.txt).
- Copy to clipboard: copies plain text list of hex codes (single palette or all palettes) for quick sharing.
- No existing files were modified — just add the import line to a place you'd like the export UI to appear.

If you'd like, I can add the `ExportButton` directly into a specific existing file (e.g., `PaletteManager.jsx`) — say the filename and I'll insert it for you without changing functionality elsewhere.
