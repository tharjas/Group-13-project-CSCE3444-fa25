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
  const clearAllFavorites = () => {
  if (favorites.length === 0) return;
  if (window.confirm("Are you sure you want to clear all favorite colors?")) {
    setFavorites([]);
  }
};


  const handleSelect = (hex) => {
    if (onSelectFavorite) onSelectFavorite(hex);
  };

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <div className="favorites-title">Favorite Colors</div>
        <button
          className="add-favorite-btn"
          onClick={addCurrent}
          disabled={!currentColor || isSaved(currentColor)}
          title={currentColor || "No current color"}
        >
          Add Current Color
        </button>

        <button
        className="add-favorite-btn"
        onClick={clearAllFavorites}
        disabled={favorites.length === 0}
        title="Clear all favorite colors"
        >
        Clear All Favorites
        </button>

      </div>

      {favorites.length === 0 ? (
        <div className="favorites-empty">No favorites yet — add the current color.</div>
      ) : (
        <div className="favorites-swatches">
          {favorites.map((hex) => (
            <div key={hex} className="favorite-swatch-wrap">
              <div
                role="button"
                title={hex}
                onClick={() => handleSelect(hex)}
                className="favorite-swatch"
                style={{ background: hex }}
              />
              <button
                aria-label={`Remove ${hex}`}
                title={`Remove ${hex}`}
                onClick={() => removeFavorite(hex)}
                className="remove-favorite-btn"
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
