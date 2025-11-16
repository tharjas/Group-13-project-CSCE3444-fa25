import React from 'react';

const PaletteManager = ({ palette, removeColor }) => {
  return (
    <div className="palette-manager">
      <h2>Color Palette</h2>
      <ul className="palette-list">
        {palette.map((color, index) => (
          <li key={index} className="palette-item">
            <div 
  className="palette-color-preview"
  style={{ 
    backgroundColor: color,
    cursor: 'default'
  }}
  title={color} // ← F16: Shows HEX on hover (native browser tooltip)
></div>
            <span>{color}</span>
            <button onClick={() => removeColor(index)} className="remove-color-btn">X</button>
          </li>
        ))}
      </ul>
      {/* TODO: Add ability to reorder colors in the palette */}
    </div>
  );
};

export default PaletteManager;
