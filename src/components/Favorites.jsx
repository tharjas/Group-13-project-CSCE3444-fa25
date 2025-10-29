// src/components/Favorites.jsx
import React, { useState, useEffect } from "react";

export default function Favorites({ currentColor, onSelectFavorite }) {
  const STORAGE_KEY = "favoriteColors";
  const [favorites, setFavorites] = useState([]);

  // Load from localStorage once
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch (e) {
      console.error("Failed to load favorites:", e);
    }
  }, []);

  // Save whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error("Failed to save favorites:", e);
    }
  }, [favorites]);

  const normalize = (hex) => (hex || "").toLowerCase();
  const isSaved = (hex) =>
    !!hex && favorites.some((f) => normalize(f) === normalize(hex));

  const addCurrent = () => {
    if (!currentColor) return;
    if (isSaved(currentColor)) return;
    setFavorites((prev) => [currentColor, ...prev]);
  };

  const removeFavorite = (hex) => {
    setFavorites((prev) => prev.filter((f) => normalize(f) !== normalize(hex)));
  };

  const handleSelect = (hex) => {
    if (onSelectFavorite) onSelectFavorite(hex);
  };

  const styles = {
    container: { marginTop: 16, padding: 8, border: "1px solid #eee", borderRadius: 6 },
    header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
    title: { fontSize: 14, fontWeight: 600 },
    addButton: {
      padding: "6px 10px",
      fontSize: 13,
      cursor: "pointer",
      borderRadius: 6,
      border: "1px solid #ddd",
      background: "#fff",
    },
    swatches: { display: "flex", gap: 8, flexWrap: "wrap" },
    swatchWrap: { position: "relative", width: 40, height: 40 },
    swatch: {
      width: "100%",
      height: "100%",
      borderRadius: 4,
      boxSizing: "border-box",
      border: "1px solid rgba(0,0,0,0.15)",
      cursor: "pointer",
    },
    removeBtn: {
      position: "absolute",
      top: -8,
      right: -8,
      width: 20,
      height: 20,
      borderRadius: 10,
      border: "none",
      background: "#fff",
      cursor: "pointer",
      fontSize: 12,
      lineHeight: "20px",
      boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
    },
    empty: { color: "#666", fontSize: 13 },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>Favorite Colors</div>
        <button
          style={styles.addButton}
          onClick={addCurrent}
          disabled={!currentColor || isSaved(currentColor)}
          title={currentColor || "No current color"}
        >
          Add Current Color
        </button>
      </div>

      {favorites.length === 0 ? (
        <div style={styles.empty}>No favorites yet — add the current color.</div>
      ) : (
        <div style={styles.swatches}>
          {favorites.map((hex) => (
            <div key={hex} style={styles.swatchWrap}>
              <div
                role="button"
                title={hex}
                onClick={() => handleSelect(hex)}
                style={{ ...styles.swatch, background: hex }}
              />
              <button
                aria-label={`Remove ${hex}`}
                title={`Remove ${hex}`}
                onClick={() => removeFavorite(hex)}
                style={styles.removeBtn}
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}