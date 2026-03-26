import { fetchFeed } from './api.js';
import { extractUniqueCategories, extractUniqueSpeakers, filterItems } from './filters.js';
import { renderGrid, renderCategoryPills, renderSpeakerOptions } from './render.js';
import { openDetail, destroyPlayer } from './detail.js';

// DOM elements
const gridView = document.getElementById('grid-view');
const detailView = document.getElementById('detail-view');
const grid = document.getElementById('grid');
const loading = document.getElementById('loading');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const categoryPills = document.getElementById('category-pills');
const speakerFilter = document.getElementById('speaker-filter');
const speakerFilterRow = document.getElementById('speaker-filter-row');
const loadMoreBtn = document.getElementById('load-more');

// Config
const PAGE_SIZE = 12;

// State
let allItems = [];
let filteredItems = [];
let visibleCount = PAGE_SIZE;
const filterState = { search: '', category: '', speaker: '' };

function applyFilters() {
  filteredItems = filterItems(allItems, filterState);
  visibleCount = PAGE_SIZE;
  renderPage();
}

function renderPage() {
  const visible = filteredItems.slice(0, visibleCount);
  renderGrid(visible, grid, handleCardClick);

  const hasMore = visibleCount < filteredItems.length;
  loadMoreBtn.hidden = !hasMore;

  emptyState.hidden = filteredItems.length > 0;
  grid.hidden = filteredItems.length === 0;
}

function handleCardClick(item) {
  gridView.hidden = true;
  detailView.hidden = false;
  window.scrollTo(0, 0);

  openDetail(item, detailView, allItems, handleCardClick, () => {
    // Back to grid
    detailView.hidden = true;
    gridView.hidden = false;
  });
}

function handleCategoryClick(category) {
  filterState.category = category;
  renderCategoryPills(
    extractUniqueCategories(allItems),
    categoryPills,
    filterState.category,
    handleCategoryClick
  );
  applyFilters();
}

// Debounce
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Event listeners
searchInput.addEventListener(
  'input',
  debounce((e) => {
    filterState.search = e.target.value;
    applyFilters();
  }, 300)
);

speakerFilter.addEventListener('change', (e) => {
  filterState.speaker = e.target.value;
  applyFilters();
});

loadMoreBtn.addEventListener('click', () => {
  visibleCount += PAGE_SIZE;
  renderPage();
});

// Init
async function init() {
  try {
    const loadingText = loading.querySelector('p');
    allItems = await fetchFeed((loaded, total) => {
      loadingText.textContent = `Loading videos... ${loaded} of ${total}`;
    });

    // Populate category pills
    const categories = extractUniqueCategories(allItems);
    renderCategoryPills(categories, categoryPills, '', handleCategoryClick);

    // Populate speaker dropdown
    const speakers = extractUniqueSpeakers(allItems);
    if (speakers.length > 0) {
      renderSpeakerOptions(speakers, speakerFilter);
      speakerFilterRow.hidden = false;
    }

    // Initial render
    loading.hidden = true;
    applyFilters();
  } catch (error) {
    console.error('Failed to load feed:', error);
    loading.innerHTML = `<p class="error">Failed to load feed. Please try again later.</p>`;
  }
}

init();
