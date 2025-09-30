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
  const canvasRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const size = 200; // diameter
  const radius = size / 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const drawWheel = () => {
      const image = ctx.createImageData(size, size);
      for (let y = -radius; y < radius; y++) {
        for (let x = -radius; x < radius; x++) {
          let dx = x;
          let dy = y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance <= radius) {
            let angle = Math.atan2(dy, dx) * (180 / Math.PI);
            angle = angle < 0 ? angle + 360 : angle;
            let hue = angle;
            let sat = distance / radius * 100;
            let val = 100;

            const hex = hsvToHex(hue, sat, val);
            let index = ((y + radius) * size + (x + radius)) * 4;
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
  }, [size, radius]);

  const handlePointer = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - radius;
    const y = e.clientY - rect.top - radius;
    const distance = Math.sqrt(x * x + y * y);

    if (distance <= radius) {
      let angle = Math.atan2(y, x) * (180 / Math.PI);
      angle = angle < 0 ? angle + 360 : angle;
      let hue = angle;
      let sat = (distance / radius) * 100;
      let val = 100;

      setColor(hsvToHex(hue, sat, val));
    }
  };

  return (
    <div className="color-wheel-container">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{ cursor: 'crosshair', display: 'block', margin: '1rem auto' }}
        onMouseDown={() => setDragging(true)}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        onMouseMove={(e) => dragging && handlePointer(e)}
        onClick={handlePointer}
      />
      <div style={{ textAlign: 'center' }}>Selected Color: {color}</div>
    </div>
  );
};

export default ColorWheel;
