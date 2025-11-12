// src/components/colorChallenge/AdditiveColorChallenge.jsx

/*
This feature includes a challenge for mixing colors to obtain another color

*/ 
import React, { useState, useEffect } from 'react';

const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const n = parseInt(hex, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};

const rgbToHex = (r, g, b) => {
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  return `#${[clamp(r), clamp(g), clamp(b)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`;
};


const getRgbDistance = (hex1, hex2) => {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
};

const getLuminance = (hex) => {
  const { r, g, b } = hexToRgb(hex);
  const [rs, gs, bs] = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

const addColorsAdditively = (hexes) => {
  if (hexes.length === 0) return '#000000';
  let r = 0, g = 0, b = 0;
  hexes.forEach(hex => {
    const { r: cr, g: cg, b: cb } = hexToRgb(hex);
    r += cr;
    g += cg;
    b += cb;
  });
  return rgbToHex(Math.min(255, r), Math.min(255, g), Math.min(255, b));
};

// Advanced challenges — progressively harder
const CHALLENGES = [
  { id: 1, title: "Make White", target: '#FFFFFF', maxColors: 3, hint: "Red + Green + Blue = White" },
  { id: 2, title: "Make Yellow", target: '#FFFF00', maxColors: 2, hint: "Red + Green = Yellow" },
  { id: 3, title: "Make Cyan", target: '#00FFFF', maxColors: 2, hint: "Green + Blue = Cyan" },
  { id: 4, title: "Make Magenta", target: '#FF00FF', maxColors: 2, hint: "Red + Blue = Magenta" },
  { id: 5, title: "Pure Red from Non-Reds", target: '#FF0000', maxColors: 3, hint: "⚠️ Impossible with standard RGB — explore why!" },
  { id: 6, title: "Bright Orange", target: '#FFA500', maxColors: 3, hint: "Use Red + Green in specific ratio" },
  { id: 7, title: "Hot Pink", target: '#FF69B4', maxColors: 3, hint: "Combine Red, Blue, and a touch of Green" },
  { id: 8, title: "Create Black", target: '#000000', maxColors: 1, hint: "Only one color works!" },
  { id: 9, title: "Sunset Yellow", target: '#FDB813', maxColors: 3, hint: "Approximate using Red + Green + a hint of Blue" },
  { id: 10, title: "Additive Gray", target: '#808080', maxColors: 2, hint: "Find two non-gray colors that sum to mid-gray" },
];

const STORAGE_KEY = 'colorAdditionCompletedChallenges';

const AdditiveColorChallenge = ({ onBack, isDark = false, initialColor = '#FF0000' }) => {
  const [completedChallenges, setCompletedChallenges] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const [activeChallenge, setActiveChallenge] = useState(CHALLENGES[0]);
  const [selectedColors, setSelectedColors] = useState([initialColor]);
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [customColor, setCustomColor] = useState('#FFFFFF');
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  // Persist completed challenges
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedChallenges]));
  }, [completedChallenges]);

  const mixedColor = addColorsAdditively(selectedColors);
  const isCorrect = mixedColor.toUpperCase() === activeChallenge.target.toUpperCase();

  const addColor = (hex) => {
    if (!hex || !/^#[0-9A-F]{6}$/i.test(hex)) return;
    if (selectedColors.length >= activeChallenge.maxColors) {
      setFeedback(`Max ${activeChallenge.maxColors} colors allowed.`);
      return;
    }
    setSelectedColors([...selectedColors, hex]);
    setFeedback('');
  };

  const removeColor = (index) => {
    setSelectedColors(selectedColors.filter((_, i) => i !== index));
    setFeedback('');
  };

  const resetChallenge = () => {
    setSelectedColors([initialColor]);
    setFeedback('');
    setShowHint(false);
  };

  const submitSolution = () => {
    if (selectedColors.length === 0) {
      setFeedback('Add at least one color.');
      return;
    }
    if (isCorrect) {
      setFeedback('🎉 Correct! Challenge completed!');
      if (!completedChallenges.has(activeChallenge.id)) {
        setCompletedChallenges(prev => new Set([...prev, activeChallenge.id]));
      }
    } else {
      setFeedback(`Not quite. Target: ${activeChallenge.target}`);
    }
  };

  const brightPresets = [
    '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#00FFFF', '#FF00FF',
    '#FFFFFF', '#000000', '#808080',
    '#FFA500', '#FF69B4', '#FDB813'
  ];

  return (
    <div className={`full-page-view ${isDark ? 'dark-mode' : ''}`} style={{
      padding: '2rem',
      background: 'var(--bg)',
      color: 'var(--text)',
      minHeight: '100vh'
    }}>
      <button
        onClick={onBack}
        style={{
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          padding: '0.5rem 1rem',
          background: '#044997',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          zIndex: 1000
        }}
      >
        Back to Picker
      </button>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', margin: '2rem 0' }}>Additive Color Challenge Lab</h1>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: isDark ? '#aaa' : '#666' }}>
          Completed: <strong>{completedChallenges.size} / {CHALLENGES.length}</strong> challenges
        </p>

        {/* Challenge Selector */}
        <div style={{ marginBottom: '2rem' }}>
          <h3>Select a Challenge</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {CHALLENGES.map(ch => (
              <button
                key={ch.id}
                onClick={() => {
                  setActiveChallenge(ch);
                  setSelectedColors([initialColor]);
                  setFeedback('');
                  setShowHint(false);
                }}
                style={{
                  padding: '0.4rem 0.8rem',
                  background: activeChallenge.id === ch.id ? '#044997' : completedChallenges.has(ch.id) ? '#28a745' : 'transparent',
                  color: activeChallenge.id === ch.id || completedChallenges.has(ch.id) ? '#fff' : (isDark ? '#eee' : '#111'),
                  border: `1px solid ${completedChallenges.has(ch.id) ? '#28a745' : '#044997'}`,
                  borderRadius: '4px',
                  opacity: completedChallenges.has(ch.id) ? 0.9 : 1
                }}
                title={completedChallenges.has(ch.id) ? '✅ Completed' : ch.title}
              >
                {completedChallenges.has(ch.id) ? '✓' : ch.id}
              </button>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2>{activeChallenge.title}</h2>
          <p>{activeChallenge.description || `Create ${activeChallenge.target}.`}</p>
          {showHint && <p style={{ fontStyle: 'italic', color: '#044997' }}>{activeChallenge.hint}</p>}
          <button onClick={() => setShowHint(!showHint)} style={{ fontSize: '0.9rem' }}>
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
        </div>

        {/* Input */}
        <h3>Add Colors (Max: {activeChallenge.maxColors})</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          {brightPresets.map((hex, i) => (
            <div key={i} onClick={() => addColor(hex)} style={{ cursor: 'pointer' }}>
              <div style={{
                width: '40px', height: '40px', background: hex,
                borderRadius: '4px', border: '1px solid #ccc'
              }} />
            </div>
          ))}
          <button
            onClick={() => setShowCustomPicker(!showCustomPicker)}
            style={{ width: '40px', height: '40px', background: '#eee', border: '1px solid #ccc', borderRadius: '4px' }}
            title="Custom Color"
          >
            +
          </button>
        </div>

        {showCustomPicker && (
          <div style={{ marginBottom: '1rem', padding: '0.8rem', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', borderRadius: '6px' }}>
            <input
              type="color"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              style={{ width: '50px', height: '40px', border: 'none', cursor: 'pointer' }}
            />
            <button onClick={() => addColor(customColor)} style={{ marginLeft: '0.5rem', padding: '0.3rem 0.6rem' }}>
              Add
            </button>
          </div>
        )}

        {/* Selected Colors */}
        <h3>Your Mix ({selectedColors.length}/{activeChallenge.maxColors})</h3>
        {selectedColors.length > 0 ? (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {selectedColors.map((hex, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <div style={{
                  width: '50px', height: '50px', background: hex,
                  borderRadius: '6px', border: '2px solid rgba(0,0,0,0.2)'
                }} />
                <button
                  onClick={() => removeColor(i)}
                  style={{
                    position: 'absolute', top: '-8px', right: '-8px',
                    background: '#dc3545', color: 'white', width: '20px', height: '20px',
                    borderRadius: '50%', fontSize: '0.8rem', border: 'none', cursor: 'pointer'
                  }}
                >×</button>
              </div>
            ))}
          </div>
        ) : (
          <p>Add colors to start!</p>
        )}

        {/* Result */}
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <h3>Result (Additive)</h3>
          <div style={{
            width: '100px', height: '100px', background: mixedColor,
            margin: '0 auto 1rem', borderRadius: '8px', border: '2px solid #ccc'
          }} />
          <code style={{ display: 'block', marginBottom: '1rem' }}>{mixedColor}</code>

          <div>
            <button onClick={submitSolution} disabled={selectedColors.length === 0} style={{
              padding: '0.6rem 1.2rem', marginRight: '0.8rem',
              background: isCorrect ? '#28a745' : '#007bff',
              color: 'white', border: 'none', borderRadius: '6px', fontSize: '1rem'
            }}>
              {isCorrect ? '✅ Solved!' : 'Submit Solution'}
            </button>
            <button onClick={resetChallenge} style={{
              padding: '0.6rem 1.2rem',
              background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px'
            }}>
              Reset
            </button>
          </div>

          {feedback && (
            <p style={{
              marginTop: '1rem',
              fontWeight: 'bold',
              color: isCorrect ? '#28a745' : '#dc3545'
            }}>
              {feedback}
            </p>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: isDark ? '#aaa' : '#666' }}>
          💡 Additive mixing = light model (RGB). Colors are summed per channel (capped at 255).
        </p>
      </div>
    </div>
  );
};

export default AdditiveColorChallenge;