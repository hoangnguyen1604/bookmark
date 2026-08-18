const STORAGE_KEYS = {
  FAVORITES: 'bookmark_hub_favorites',
  THEME: 'bookmark_hub_theme',
  VIEW_MODE: 'bookmark_hub_view_mode'
};

export function getFavorites() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error loading favorites:', e);
    return [];
  }
}

export function toggleFavorite(bookmarkId) {
  const favorites = getFavorites();
  const index = favorites.indexOf(bookmarkId);
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(bookmarkId);
  }
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  } catch (e) {
    console.error('Error saving favorite:', e);
  }
  return favorites;
}

export function isFavorite(bookmarkId) {
  return getFavorites().includes(bookmarkId);
}

export function getStoredTheme() {
  return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
}

export function setStoredTheme(theme) {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

export function getStoredViewMode() {
  return localStorage.getItem(STORAGE_KEYS.VIEW_MODE) || 'grid';
}

export function setStoredViewMode(mode) {
  localStorage.setItem(STORAGE_KEYS.VIEW_MODE, mode);
}
