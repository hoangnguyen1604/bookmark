import { BOOKMARKS, CATEGORIES } from '../data/bookmarks.js';
import { filterBookmarks, calculateCategoryCounts } from './searchFilter.js';
import { 
  getFavorites, 
  toggleFavorite, 
  isFavorite, 
  getStoredTheme, 
  setStoredTheme, 
  getStoredViewMode, 
  setStoredViewMode 
} from './storage.js';

// Application State
const state = {
  activeCategory: 'all',
  searchQuery: '',
  viewMode: getStoredViewMode(), // 'grid' or 'list'
  theme: getStoredTheme() // 'light' or 'dark'
};

// DOM Elements
const sidebarNavList = document.getElementById('sidebarNavList');
const sectionsWrapper = document.getElementById('sectionsWrapper');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const gridViewBtn = document.getElementById('gridViewBtn');
const listViewBtn = document.getElementById('listViewBtn');
const sidebar = document.getElementById('sidebar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const themeLightBtn = document.getElementById('themeLightBtn');
const themeDarkBtn = document.getElementById('themeDarkBtn');

// Initialize Application
function init() {
  setupTheme();
  setupViewMode();
  renderSidebarNav();
  renderBookmarks();
  setupEventListeners();
}

// Theme Management
function setupTheme() {
  if (state.theme === 'dark') {
    document.documentElement.classList.add('dark');
    themeDarkBtn.classList.add('active');
    themeLightBtn.classList.remove('active');
  } else {
    document.documentElement.classList.remove('dark');
    themeLightBtn.classList.add('active');
    themeDarkBtn.classList.remove('active');
  }
}

function setTheme(theme) {
  state.theme = theme;
  setStoredTheme(theme);
  setupTheme();
}

// View Mode Management
function setupViewMode() {
  if (state.viewMode === 'list') {
    listViewBtn.classList.add('active');
    gridViewBtn.classList.remove('active');
  } else {
    gridViewBtn.classList.add('active');
    listViewBtn.classList.remove('active');
  }
}

function changeViewMode(mode) {
  state.viewMode = mode;
  setStoredViewMode(mode);
  setupViewMode();
  renderBookmarks();
}

// Render Sidebar Nav Links
function renderSidebarNav() {
  const counts = calculateCategoryCounts(BOOKMARKS);

  let html = `
    <li>
      <a href="#" class="nav-item-link ${state.activeCategory === 'all' ? 'active' : ''}" data-cat="all">
        <span>⚡ Tất cả Bookmark</span>
        <span class="nav-badge-count">${counts.all}</span>
      </a>
    </li>
    <li>
      <a href="#" class="nav-item-link ${state.activeCategory === 'favorites' ? 'active' : ''}" data-cat="favorites">
        <span>⭐ Đã Yêu Thích</span>
        <span class="nav-badge-count">${counts.favorites}</span>
      </a>
    </li>
  `;

  CATEGORIES.forEach(cat => {
    const isActive = state.activeCategory === cat.id;
    const count = counts[cat.id] || 0;
    const catName = cat.title.replace(/^[^\s]+\s+/, '').split(' (')[0];

    html += `
      <li>
        <a href="#" class="nav-item-link ${isActive ? 'active' : ''}" data-cat="${cat.id}">
          <span>${cat.title.split(' ')[0]} ${catName}</span>
          <span class="nav-badge-count">${count}</span>
        </a>
      </li>
    `;
  });

  sidebarNavList.innerHTML = html;
}



// Render Bookmark Cards
function renderBookmarks() {
  const filtered = filterBookmarks(BOOKMARKS, {
    query: state.searchQuery,
    category: state.activeCategory,
    showFavoritesOnly: state.activeCategory === 'favorites'
  });

  if (filtered.length === 0) {
    sectionsWrapper.innerHTML = `
      <section class="showcase-section">
        <div class="empty-search-box">
          <div class="empty-search-icon">🔍</div>
          <h3>No bookmarks found</h3>
          <p>Try adjusting your search query or select another category.</p>
          <button class="reset-btn" id="resetSearchBtn">Clear Search</button>
        </div>
      </section>
    `;

    document.getElementById('resetSearchBtn')?.addEventListener('click', () => {
      state.searchQuery = '';
      searchInput.value = '';
      clearSearchBtn.style.display = 'none';
      renderBookmarks();
    });
    return;
  }

  // If showing ALL bookmarks with NO search query: group into 8 distinct showcase sections
  if (state.activeCategory === 'all' && !state.searchQuery) {
    let sectionsHTML = '';

    CATEGORIES.forEach((cat, index) => {
      const catBookmarks = filtered.filter(b => b.category === cat.id);
      if (catBookmarks.length === 0) return;

      const numStr = index + 1 < 10 ? `0${index + 1}` : `${index + 1}`;
      const isListView = state.viewMode === 'list';

      sectionsHTML += `
        <section class="showcase-section" id="section-${cat.id}">
          <div class="showcase-header">
            <span class="section-number">${numStr}</span>
            <div class="section-title-group">
              <h2 class="section-title">${cat.title}</h2>
            </div>
            <span class="section-count-pill">${catBookmarks.length} links</span>
          </div>

          <div class="bookmarks-grid ${isListView ? 'list-view' : ''}">
            ${catBookmarks.map(item => renderCardHTML(item)).join('')}
          </div>
        </section>
      `;
    });

    sectionsWrapper.innerHTML = sectionsHTML;
  } else {
    // Single view section for specific category / favorites / search query
    let headerTitle = 'Tất cả Bookmark';
    let headerDesc = '314 liên kết thiết kế & công nghệ đã qua sàng lọc';
    let numStr = '01';

    if (state.activeCategory === 'favorites') {
      headerTitle = '⭐ Bookmark Yêu Thích';
      headerDesc = 'Các liên kết bạn đã đánh dấu sao';
      numStr = '★';
    } else if (state.activeCategory !== 'all') {
      const idx = CATEGORIES.findIndex(c => c.id === state.activeCategory);
      if (idx !== -1) {
        headerTitle = CATEGORIES[idx].title;
        headerDesc = 'Các tài nguyên và công cụ thuộc danh mục';
        numStr = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;
      }
    }

    if (state.searchQuery) {
      headerDesc = `Search results for "${state.searchQuery}"`;
    }

    const isListView = state.viewMode === 'list';

    sectionsWrapper.innerHTML = `
      <section class="showcase-section">
        <div class="showcase-header">
          <span class="section-number">${numStr}</span>
          <div class="section-title-group">
            <h2 class="section-title">${headerTitle}</h2>
            <p class="section-desc">${headerDesc}</p>
          </div>
          <span class="section-count-pill">${filtered.length} links</span>
        </div>

        <div class="bookmarks-grid ${isListView ? 'list-view' : ''}">
          ${filtered.map(item => renderCardHTML(item)).join('')}
        </div>
      </section>
    `;
  }

  attachCardActionListeners();
}

// Generate Card HTML according to View Mode
function renderCardHTML(item) {
  const favoriteActive = isFavorite(item.id) ? 'active' : '';
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${item.domain}&sz=64`;
  const titleHighlighted = highlightText(item.title, state.searchQuery);

  const starIcon = isFavorite(item.id) 
    ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`
    : `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;

  const copyIcon = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>`;

  const globeIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`;

  if (state.viewMode === 'list') {
    const displayTags = item.tags.slice(0, 2);
    return `
      <div class="bookmark-card" data-id="${item.id}">
        <div class="card-left-group">
          <div class="favicon-icon-box">
            <img src="${faviconUrl}" alt="${item.domain}" class="favicon-img" loading="lazy" onerror="this.src='https://icons.duckduckgo.com/ip3/${item.domain}.ico'" />
          </div>
          <div class="card-content-body">
            <h3 class="bookmark-title-text">
              <a href="${item.url}" target="_blank" rel="noopener noreferrer" title="${item.title}">
                ${titleHighlighted}
              </a>
            </h3>
            <div class="domain-text">
              ${globeIcon} <span>${item.domain}</span>
              ${item.date ? `<span class="date-badge">• ${item.date}</span>` : ''}
            </div>
          </div>
        </div>

        <div class="card-right-group">
          <div class="card-tags-row">
            ${displayTags.map(t => `<span class="tag-chip">#${t}</span>`).join('')}
          </div>
          <div class="card-action-btns">
            <button class="card-btn copy-btn" data-url="${item.url}" aria-label="Copy Link" title="Copy Link">
              ${copyIcon}
            </button>
            <button class="card-btn favorite-btn ${favoriteActive}" data-id="${item.id}" aria-label="Favorite" title="Star Favorite">
              ${starIcon}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Grid View format
  return `
    <div class="bookmark-card" data-id="${item.id}">
      <div class="card-top-row">
        <div class="favicon-icon-box">
          <img src="${faviconUrl}" alt="${item.domain}" class="favicon-img" loading="lazy" onerror="this.src='https://icons.duckduckgo.com/ip3/${item.domain}.ico'" />
        </div>
        <div class="card-action-btns">
          <button class="card-btn copy-btn" data-url="${item.url}" aria-label="Copy Link" title="Copy Link">
            ${copyIcon}
          </button>
          <button class="card-btn favorite-btn ${favoriteActive}" data-id="${item.id}" aria-label="Favorite" title="Star Favorite">
            ${starIcon}
          </button>
        </div>
      </div>

      <div class="card-content-body">
        <h3 class="bookmark-title-text">
          <a href="${item.url}" target="_blank" rel="noopener noreferrer" title="${item.title}">
            ${titleHighlighted}
          </a>
        </h3>

        <div class="domain-text">
          ${globeIcon} <span>${item.domain}</span>
          ${item.date ? `<span class="date-badge">• ${item.date}</span>` : ''}
        </div>
      </div>

      <div class="card-tags-row">
        ${item.tags.map(t => `<span class="tag-chip">#${t}</span>`).join('')}
      </div>
    </div>
  `;
}

function getCategoryName(catId) {
  const cat = CATEGORIES.find(c => c.id === catId);
  return cat ? cat.title.split(' ')[0] + ' ' + cat.title.split(' ')[1] : catId;
}

function highlightText(text, query) {
  if (!query) return text;
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  return text.replace(regex, '<mark class="search-match">$1</mark>');
}

// Action Event Listeners
function attachCardActionListeners() {
  document.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      toggleFavorite(id);
      renderSidebarNav();
      renderBookmarks();
      showToast(isFavorite(id) ? 'Added to favorites ⭐' : 'Removed from favorites');
    });
  });

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const url = btn.getAttribute('data-url');
      const originalSvg = btn.innerHTML;

      navigator.clipboard.writeText(url).then(() => {
        btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        showToast('Link copied to clipboard');

        setTimeout(() => {
          btn.innerHTML = originalSvg;
        }, 1500);
      }).catch(err => {
        console.error('Failed to copy link:', err);
      });
    });
  });
}

function showToast(message) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.innerHTML = `<span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'all 0.2s ease';
    setTimeout(() => toast.remove(), 200);
  }, 2200);
}

// Global Event Listeners
function setupEventListeners() {
  searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    clearSearchBtn.style.display = state.searchQuery ? 'block' : 'none';
    renderBookmarks();
  });

  clearSearchBtn.addEventListener('click', () => {
    state.searchQuery = '';
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    renderBookmarks();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
    } else if (e.key === 'Escape' && document.activeElement === searchInput) {
      searchInput.blur();
    }
  });

  sidebarNavList.addEventListener('click', (e) => {
    const navLink = e.target.closest('[data-cat]');
    if (navLink) {
      e.preventDefault();
      state.activeCategory = navLink.getAttribute('data-cat');
      renderSidebarNav();
      renderBookmarks();
      sidebar.classList.remove('mobile-open');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  gridViewBtn.addEventListener('click', () => changeViewMode('grid'));
  listViewBtn.addEventListener('click', () => changeViewMode('list'));

  themeLightBtn.addEventListener('click', () => setTheme('light'));
  themeDarkBtn.addEventListener('click', () => setTheme('dark'));

  mobileMenuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('mobile-open');
  });
}

init();
