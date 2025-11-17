// Utilities to manage a recent color history (max N, newest first, no duplicates)
// Uses localStorage under the key `colorHistory` when persistence is desired.

const HISTORY_KEY = 'colorHistory';
const normalize = (hex) => String(hex || '').toUpperCase();

export const loadHistory = (fallback = []) => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map(normalize);
    return fallback;
  } catch (e) {
    return fallback;
  }
};

export const saveHistory = (history = []) => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.map(normalize)));
  } catch (e) {
    // ignore storage errors
  }
};

// Add a color to history, return the new history array.
// Ensures newest-first order, removes duplicates, enforces max length.
export const addColorToHistory = (hex, max = 10) => {
  if (!hex) return loadHistory();
  const h = loadHistory().filter((c) => c !== normalize(hex));
  h.unshift(normalize(hex));
  if (h.length > max) h.splice(max);
  saveHistory(h);
  return h;
};

export const removeColorFromHistory = (hex) => {
  if (!hex) return loadHistory();
  const h = loadHistory().filter((c) => c !== normalize(hex));
  saveHistory(h);
  return h;
};

export const clearHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    // ignore
  }
  return [];
};

export const setHistory = (arr = []) => {
  const h = Array.isArray(arr) ? arr.map(normalize).slice(0, 10) : [];
  saveHistory(h);
  return h;
};

export const getHistory = () => loadHistory();

export default {
  loadHistory,
  saveHistory,
  addColorToHistory,
  removeColorFromHistory,
  clearHistory,
  setHistory,
  getHistory,
};
