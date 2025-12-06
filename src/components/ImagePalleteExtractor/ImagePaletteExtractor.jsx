import React, { useState, useRef, useEffect } from 'react';
import { SnackbarContainer, useSnackbar } from '../snackbar/Snackbar';

// Simple k-means clustering for color extraction
const rgbToHex = (r, g, b) => {
  return "#" + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join('');
};

const colorDistance = (c1, c2) => {
  return Math.sqrt(
    Math.pow(c1[0] - c2[0], 2) +
    Math.pow(c1[1] - c2[1], 2) +
    Math.pow(c1[2] - c2[2], 2)
  );
};

const extractColorsFromImage = (imageData, numColors) => {
  const pixels = [];
  const data = imageData.data;
  
  // Sample pixels (every 10th pixel for performance)
  for (let i = 0; i < data.length; i += 40) {
    pixels.push([data[i], data[i + 1], data[i + 2]]);
  }

  // Initialize centroids randomly
  let centroids = [];
  for (let i = 0; i < numColors; i++) {
    centroids.push(pixels[Math.floor(Math.random() * pixels.length)]);
  }

  // K-means iterations
  for (let iter = 0; iter < 10; iter++) {
    const clusters = Array(numColors).fill().map(() => []);
    
    // Assign pixels to nearest centroid
    pixels.forEach(pixel => {
      let minDist = Infinity;
      let closestIdx = 0;
      
      centroids.forEach((centroid, idx) => {
        const dist = colorDistance(pixel, centroid);
        if (dist < minDist) {
          minDist = dist;
          closestIdx = idx;
        }
      });
      
      clusters[closestIdx].push(pixel);
    });

    // Update centroids
    centroids = clusters.map(cluster => {
      if (cluster.length === 0) return centroids[0];
      
      const sum = cluster.reduce((acc, pixel) => [
        acc[0] + pixel[0],
        acc[1] + pixel[1],
        acc[2] + pixel[2]
      ], [0, 0, 0]);
      
      return [
        Math.round(sum[0] / cluster.length),
        Math.round(sum[1] / cluster.length),
        Math.round(sum[2] / cluster.length)
      ];
    });
  }

  return centroids.map(c => rgbToHex(c[0], c[1], c[2]));
};

const ImagePaletteExtractor = ({ onBack, isDark, addToPalette }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [extractedColors, setExtractedColors] = useState([]);
  const [numColors, setNumColors] = useState(5);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hoveredColor, setHoveredColor] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  
  const { notifications, showSnackbar, removeNotification } = useSnackbar();

  // Draw image on canvas when it's loaded
  useEffect(() => {
    if (uploadedImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const maxWidth = 800;
      const scale = Math.min(1, maxWidth / uploadedImage.width);
      
      canvas.width = uploadedImage.width * scale;
      canvas.height = uploadedImage.height * scale;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);
      
      setImageLoaded(true);
    }
  }, [uploadedImage]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setExtractedColors([]);
    setImageLoaded(false);
    setHoveredColor(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setUploadedImage(img);
        showSnackbar('Image loaded successfully!', 'success');
      };
      img.onerror = () => {
        showSnackbar('Failed to load image. Please try another file.', 'error');
        setUploadedImage(null);
      };
      img.src = event.target.result;
    };
    reader.onerror = () => {
      showSnackbar('Failed to read file. Please try again.', 'error');
    };
    reader.readAsDataURL(file);
  };

  const extractPalette = () => {
    if (!uploadedImage || !imageLoaded) {
      showSnackbar('Please wait for the image to load first.', 'warning');
      return;
    }
    
    setIsProcessing(true);
    
    setTimeout(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const colors = extractColorsFromImage(imageData, numColors);
        setExtractedColors(colors);
        showSnackbar(`Successfully extracted ${colors.length} colors!`, 'success');
      } catch (error) {
        console.error('Error extracting colors:', error);
        showSnackbar('Failed to extract colors. Please try again.', 'error');
      } finally {
        setIsProcessing(false);
      }
    }, 100);
  };

  const handleColorHover = (color) => {
    if (!color || !uploadedImage || !imageLoaded) return;
    
    setHoveredColor(color);
    
    const canvas = canvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const overlayCtx = overlayCanvas.getContext('2d');
    
    overlayCanvas.width = canvas.width;
    overlayCanvas.height = canvas.height;
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    
    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const targetRgb = color.match(/\w\w/g).map(x => parseInt(x, 16));
      
      // Highlight areas with similar colors
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        const distance = Math.sqrt(
          Math.pow(r - targetRgb[0], 2) +
          Math.pow(g - targetRgb[1], 2) +
          Math.pow(b - targetRgb[2], 2)
        );
        
        if (distance < 50) {
          overlayCtx.fillStyle = 'rgba(255, 255, 0, 0.4)';
          const x = (i / 4) % canvas.width;
          const y = Math.floor((i / 4) / canvas.width);
          overlayCtx.fillRect(x, y, 1, 1);
        }
      }
    } catch (error) {
      console.error('Error highlighting colors:', error);
    }
  };

  const handleColorLeave = () => {
    setHoveredColor(null);
    if (overlayCanvasRef.current) {
      const overlayCanvas = overlayCanvasRef.current;
      const overlayCtx = overlayCanvas.getContext('2d');
      overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    }
  };

  const handleAddToPalette = (color) => {
    if (addToPalette) {
      const result = addToPalette(color);
      if (result === true) {
        showSnackbar(`Color ${color} added to palette!`, 'success');
      } else if (result === false) {
        // Error messages already shown by addToPalette in App.jsx
        // We don't need to show duplicate messages
      }
    }
  };

  const handleAddAllToPalette = () => {
  if (!extractedColors.length) {
    showSnackbar('No colors to add. Extract colors first!', 'warning');
    return;
  }

  // 🔥 Deduplicate extracted colors (critical fix)
  const uniqueColors = [...new Set(extractedColors)];

  let addedCount = 0;
  let skippedCount = 0;

  for (const color of uniqueColors) {
    if (addToPalette) {
      const result = addToPalette(color);
      if (result === true) {
        addedCount++;
      } else {
        skippedCount++;
      }
    }
  }

  // Show appropriate feedback
  if (addedCount > 0 && skippedCount === 0) {
    showSnackbar(`Successfully added all ${addedCount} colors to palette!`, 'success');
  } else if (addedCount > 0 && skippedCount > 0) {
    showSnackbar(`Added ${addedCount} colors. ${skippedCount} skipped (duplicates or palette full).`, 'info');
  } else {
    showSnackbar('Could not add colors. Palette might be full or colors already exist.', 'warning');
  }
};

  // const handleAddAllToPalette = () => {
  //   if (!extractedColors.length) {
  //     showSnackbar('No colors to add. Extract colors first!', 'warning');
  //     return;
  //   }

  //   let addedCount = 0;
  //   let skippedCount = 0;

  //   for (const color of extractedColors) {
  //     if (addToPalette) {
  //       const result = addToPalette(color);
  //       if (result === true) {
  //         addedCount++;
  //       } else {
  //         skippedCount++;
  //       }
  //     }
  //   }

  //   if (addedCount > 0 && skippedCount === 0) {
  //     showSnackbar(`Successfully added all ${addedCount} colors to palette!`, 'success');
  //   } else if (addedCount > 0 && skippedCount > 0) {
  //     showSnackbar(`Added ${addedCount} colors. ${skippedCount} skipped (duplicates or palette full).`, 'info');
  //   } else {
  //     showSnackbar('Could not add colors. Palette might be full or colors already exist.', 'warning');
  //   }
  // };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const fakeEvent = { target: { files: [file] } };
      handleImageUpload(fakeEvent);
    } else if (file) {
      showSnackbar('Please upload an image file (JPG, PNG, etc.)', 'warning');
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    background: isDark ? '#1a1a1a' : '#f5f5f5',
    color: isDark ? '#e9ecef' : '#212529',
    padding: '2rem',
    overflowY: 'auto'
  };

  const cardStyle = {
    background: isDark ? '#2d2d2d' : '#fff',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.2s',
    background: '#007bff',
    color: '#fff'
  };

  const dropZoneStyle = {
    border: `3px dashed ${isDark ? '#555' : '#ccc'}`,
    borderRadius: '12px',
    padding: '3rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: isDark ? '#1a1a1a' : '#f9f9f9'
  };

  return (
    <>
      <div style={containerStyle}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <button onClick={onBack} style={{ ...buttonStyle, marginBottom: '1.5rem', background: '#6c757d' }}>
            ← Back to Picker
          </button>

          <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>🖼️ Extract Palette from Image</h1>

          {/* How to Use Guide */}
          <div style={{ 
            ...cardStyle, 
            background: isDark ? '#1a3a1a' : '#f0f9ff',
            border: isDark ? '2px solid #2d5f2d' : '2px solid #bfdbfe',
            marginBottom: '2rem'
          }}>
            <h3 style={{ marginBottom: '1rem', color: isDark ? '#7dd87d' : '#1e40af' }}>
              📖 How to Use Image Palette Extractor
            </h3>
            <div style={{ fontSize: '0.9rem', lineHeight: '1.7' }}>
              <p style={{ marginBottom: '0.75rem' }}>
                <strong>Step 1:</strong> Upload an image by dragging & dropping or clicking to browse (JPG, PNG supported)
              </p>
              <p style={{ marginBottom: '0.75rem' }}>
                <strong>Step 2:</strong> Adjust the slider to choose how many colors to extract (3-10 colors)
              </p>
              <p style={{ marginBottom: '0.75rem' }}>
                <strong>Step 3:</strong> Click "🎨 Extract Palette" to analyze the image using k-means clustering
              </p>
              <p style={{ marginBottom: '0.75rem' }}>
                <strong>Step 4:</strong> Hover over extracted colors to see where they appear in your image (highlighted in yellow)
              </p>
              <p style={{ marginBottom: '0.75rem' }}>
                <strong>Step 5:</strong> Click individual colors to add them one by one, or use "Add All to Palette" button
              </p>
              <p style={{ 
                marginTop: '1rem', 
                padding: '0.75rem', 
                background: isDark ? '#2d2d2d' : '#fff',
                borderRadius: '6px',
                borderLeft: `4px solid ${isDark ? '#7dd87d' : '#1e40af'}`
              }}>
                💡 <strong>Pro Tip:</strong> Your palette requires exactly 5 colors to save. Use "Add All to Palette" to quickly add multiple colors, then remove extras to keep your best 5!
              </p>
            </div>
          </div>

          {/* Upload Section */}
          <div style={cardStyle}>
            <h3 style={{ marginBottom: '1rem' }}>Upload Image</h3>
            
            <div 
              style={dropZoneStyle}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
              <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                Drag & drop an image here
              </p>
              <p style={{ color: isDark ? '#aaa' : '#666', fontSize: '0.9rem' }}>
                or click to browse (JPG, PNG)
              </p>
            </div>
            
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>

          {/* Image Preview */}
          {uploadedImage && (
            <div style={cardStyle}>
              <h3 style={{ marginBottom: '1rem' }}>
                Image Preview 
                {imageLoaded && <span style={{ color: '#10b981', marginLeft: '0.5rem' }}>✓ Loaded</span>}
                {!imageLoaded && <span style={{ color: '#f59e0b', marginLeft: '0.5rem' }}>⏳ Loading...</span>}
              </h3>
              <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
                <canvas 
                  ref={canvasRef}
                  style={{ 
                    width: '100%', 
                    height: 'auto',
                    borderRadius: '8px',
                    display: 'block',
                    border: isDark ? '2px solid #444' : '2px solid #ddd'
                  }}
                />
                <canvas 
                  ref={overlayCanvasRef}
                  style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '8px',
                    pointerEvents: 'none'
                  }}
                />
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Number of colors to extract: {numColors}
                </label>
                <input 
                  type="range" 
                  min="3" 
                  max="10" 
                  value={numColors}
                  onChange={(e) => setNumColors(parseInt(e.target.value))}
                  style={{ width: '100%', maxWidth: '300px', marginBottom: '1rem' }}
                />
              </div>

              <button 
                onClick={extractPalette}
                disabled={isProcessing || !imageLoaded}
                style={{ 
                  ...buttonStyle, 
                  opacity: (isProcessing || !imageLoaded) ? 0.6 : 1,
                  cursor: (isProcessing || !imageLoaded) ? 'not-allowed' : 'pointer'
                }}
              >
                {isProcessing ? '⏳ Processing...' : imageLoaded ? '🎨 Extract Palette' : '⏳ Loading Image...'}
              </button>
            </div>
          )}

          {/* Extracted Palette */}
          {extractedColors.length > 0 && (
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>Extracted Palette ({extractedColors.length} colors)</h3>
                <button 
                  onClick={handleAddAllToPalette}
                  style={{ 
                    ...buttonStyle, 
                    padding: '0.5rem 1rem',
                    background: '#10b981',
                    fontSize: '0.9rem'
                  }}
                >
                  ➕ Add All to Palette
                </button>
              </div>
              <p style={{ marginBottom: '1.5rem', color: isDark ? '#aaa' : '#666' }}>
                Hover over a color to see where it appears in the image. Click individual colors to add them one by one.
              </p>
              
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {extractedColors.map((color, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      textAlign: 'center',
                      transition: 'transform 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={() => handleColorHover(color)}
                    onMouseLeave={handleColorLeave}
                    onClick={() => handleAddToPalette(color)}
                  >
                    <div 
                      style={{ 
                        width: '100px', 
                        height: '100px', 
                        background: color,
                        borderRadius: '12px',
                        border: hoveredColor === color ? '4px solid #007bff' : (isDark ? '2px solid #444' : '2px solid #ddd'),
                        marginBottom: '0.75rem',
                        boxShadow: hoveredColor === color ? '0 4px 12px rgba(0,123,255,0.3)' : 'none',
                        transform: hoveredColor === color ? 'scale(1.05)' : 'scale(1)'
                      }}
                    />
                    <code style={{ 
                      fontSize: '0.9rem',
                      background: isDark ? '#1a1a1a' : '#f5f5f5',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px'
                    }}>
                      {color}
                    </code>
                  </div>
                ))}
              </div>

              <div style={{ 
                marginTop: '2rem', 
                padding: '1rem',
                background: isDark ? '#1a1a1a' : '#f9f9f9',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: isDark ? '#aaa' : '#666'
              }}>
                💡 <strong>Tip:</strong> Click on any color swatch to add it individually, or use the "Add All to Palette" button to add all colors at once.
                Hover to see where the color appears in your image. Remember: your palette requires exactly 5 colors to save!
              </div>
            </div>
          )}
        </div>
      </div>
      
      <SnackbarContainer notifications={notifications} removeNotification={removeNotification} />
    </>
  );
};

export default ImagePaletteExtractor;