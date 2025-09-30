import React from 'react';

// TODO: Add color validation and more robust conversion logic
const ColorInputs = ({ color, setColor }) => {
  const handleHexChange = (e) => {
    setColor(e.target.value);
  };

  // TODO: Implement RGB and HSL conversion and state updates
  const handleRgbChange = (e) => { console.log('RGB change not implemented'); };
  const handleHslChange = (e) => { console.log('HSL change not implemented'); };

  return (
    <div className="color-inputs">
      <div>
        <label htmlFor="hex">HEX</label>
        <input type="text" id="hex" value={color} onChange={handleHexChange} />
      </div>
      <div>
        <label htmlFor="rgb">RGB</label>
        <input type="text" id="rgb" value="" onChange={handleRgbChange} placeholder="e.g., 255, 0, 0"/>
      </div>
      <div>
        <label htmlFor="hsl">HSL</label>
        <input type="text" id="hsl" value="" onChange={handleHslChange} placeholder="e.g., 0, 100%, 50%"/>
      </div>
    </div>
  );
};

export default ColorInputs;
