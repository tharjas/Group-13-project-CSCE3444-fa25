import React, { useRef, useEffect, useState } from 'react';

// Helper functions
const hsvToHex = (h, s, v) => {
  s /= 100;
  v /= 100;
  let c = v * s;
  let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  let m = v - c;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) [r, g, b] = [c, x, 0];
  else if (60 <= h && h < 120) [r, g, b] = [x, c, 0];
  else if (120 <= h && h < 180) [r, g, b] = [0, c, x];
  else if (180 <= h && h < 240) [r, g, b] = [0, x, c];
  else if (240 <= h && h < 300) [r, g, b] = [x, 0, c];
  else if (300 <= h && h < 360) [r, g, b] = [c, 0, x];

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
};

const ColorWheel = ({ color, setColor }) => {
  const wheelCanvasRef = useRef(null);
  const valueCanvasRef = useRef(null);
  const [draggingWheel, setDraggingWheel] = useState(false);
  const [draggingValue, setDraggingValue] = useState(false);
  const [selectedHue, setSelectedHue] = useState(0);
  const [selectedSat, setSelectedSat] = useState(100);
  const [selectedValue, setSelectedValue] = useState(100);
  const wheelSize = 200; // Diameter of the color wheel
  const wheelRadius = wheelSize / 2;
  const valueWidth = 20; // Width of the value bar
  const valueHeight = 200; // Height of the value bar

  // Draw the color wheel (hue and saturation)
  useEffect(() => {
    const canvas = wheelCanvasRef.current;
    const ctx = canvas.getContext('2d');

    const drawWheel = () => {
      const image = ctx.createImageData(wheelSize, wheelSize);
      for (let y = -wheelRadius; y < wheelRadius; y++) {
        for (let x = -wheelRadius; x < wheelRadius; x++) {
          let dx = x;
          let dy = y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance <= wheelRadius) {
            let angle = Math.atan2(dy, dx) * (180 / Math.PI);
            angle = angle < 0 ? angle + 360 : angle;
            let hue = angle;
            let sat = (distance / wheelRadius) * 100;
            const hex = hsvToHex(hue, sat, 100); // Full brightness for wheel
            let index = ((y + wheelRadius) * wheelSize + (x + wheelRadius)) * 4;
            let r = parseInt(hex.slice(1, 3), 16);
            let g = parseInt(hex.slice(3, 5), 16);
            let b = parseInt(hex.slice(5, 7), 16);
            image.data[index] = r;
            image.data[index + 1] = g;
            image.data[index + 2] = b;
            image.data[index + 3] = 255;
          }
        }
      }
      ctx.putImageData(image, 0, 0);
    };

    drawWheel();
  }, [wheelSize, wheelRadius]);

  // Draw the value bar (brightness gradient for selected hue/saturation)
  useEffect(() => {
    const canvas = valueCanvasRef.current;
    const ctx = canvas.getContext('2d');

    const drawValueBar = () => {
      const image = ctx.createImageData(valueWidth, valueHeight);
      for (let y = 0; y < valueHeight; y++) {
        for (let x = 0; x < valueWidth; x++) {
          let value = ((valueHeight - y) / valueHeight) * 100; // Value from 0 (bottom) to 100 (top)
          const hex = hsvToHex(selectedHue, selectedSat, value);
          let index = (y * valueWidth + x) * 4;
          let r = parseInt(hex.slice(1, 3), 16);
          let g = parseInt(hex.slice(3, 5), 16);
          let b = parseInt(hex.slice(5, 7), 16);
          image.data[index] = r;
          image.data[index + 1] = g;
          image.data[index + 2] = b;
          image.data[index + 3] = 255;
        }
      }
      ctx.putImageData(image, 0, 0);
    };

    drawValueBar();
  }, [valueWidth, valueHeight, selectedHue, selectedSat]);

  // Handle clicks/drags on the color wheel
  const handleWheelPointer = (e) => {
    const rect = wheelCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - wheelRadius;
    const y = e.clientY - rect.top - wheelRadius;
    const distance = Math.sqrt(x * x + y * y);

    if (distance <= wheelRadius) {
      let angle = Math.atan2(y, x) * (180 / Math.PI);
      angle = angle < 0 ? angle + 360 : angle;
      let hue = angle;
      let sat = (distance / wheelRadius) * 100;
      setSelectedHue(hue);
      setSelectedSat(sat);
      setColor(hsvToHex(hue, sat, selectedValue));
    }
  };

  // Handle clicks/drags on the value bar
  const handleValuePointer = (e) => {
    const rect = valueCanvasRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;

    if (y >= 0 && y <= valueHeight) {
      let value = ((valueHeight - y) / valueHeight) * 100;
      setSelectedValue(value);
      setColor(hsvToHex(selectedHue, selectedSat, value));
    }
  };

  return (
    <div className="color-wheel-container" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <canvas
        ref={wheelCanvasRef}
        width={wheelSize}
        height={wheelSize}
        style={{ cursor: 'crosshair', display: 'block' }}
        onMouseDown={() => setDraggingWheel(true)}
        onMouseUp={() => setDraggingWheel(false)}
        onMouseLeave={() => setDraggingWheel(false)}
        onMouseMove={(e) => draggingWheel && handleWheelPointer(e)}
        onClick={handleWheelPointer}
      />
      <canvas
        ref={valueCanvasRef}
        width={valueWidth}
        height={valueHeight}
        style={{ cursor: 'crosshair', display: 'block', border: '2px solid #ccc', borderRadius: '4px' }}
        onMouseDown={() => setDraggingValue(true)}
        onMouseUp={() => setDraggingValue(false)}
        onMouseLeave={() => setDraggingValue(false)}
        onMouseMove={(e) => draggingValue && handleValuePointer(e)}
        onClick={handleValuePointer}
      />
      <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>Selected Color: {color}</div>
    </div>
  );
};

export default ColorWheel;