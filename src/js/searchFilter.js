import { getFavorites } from './storage.js';

export function filterBookmarks(bookmarks, { query = '', category = 'all', showFavoritesOnly = false }) {
  const cleanQuery = query.toLowerCase().trim();
  const favorites = getFavorites();

  return bookmarks.filter(item => {
    // Category match
    if (category !== 'all' && category !== 'favorites' && item.category !== category) {
      return false;
    }

    // Favorites match
    if (showFavoritesOnly || category === 'favorites') {
      if (!favorites.includes(item.id)) return false;
    }

    // Query search match
    if (cleanQuery) {
      const matchTitle = item.title.toLowerCase().includes(cleanQuery);
      const matchUrl = item.url.toLowerCase().includes(cleanQuery);
      const matchDomain = item.domain.toLowerCase().includes(cleanQuery);
      const matchTags = item.tags.some(t => t.toLowerCase().includes(cleanQuery));

      if (!matchTitle && !matchUrl && !matchDomain && !matchTags) {
        return false;
      }
    }

    return true;
  });
}

export function calculateCategoryCounts(bookmarks) {
  const favorites = getFavorites();
  const counts = {
    all: bookmarks.length,
    favorites: favorites.length
  };

  bookmarks.forEach(item => {
    counts[item.category] = (counts[item.category] || 0) + 1;
  });

  return counts;
}
