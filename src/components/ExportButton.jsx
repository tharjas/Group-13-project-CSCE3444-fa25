import React, { useState } from 'react';
import ExportModal from './ExportModal';

const ExportButton = ({ savedPalettes = [] }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Export Palettes</button>
      {open && (
        <ExportModal savedPalettes={savedPalettes} onClose={() => setOpen(false)} />
      )}
    </>
  );
};

export default ExportButton;
