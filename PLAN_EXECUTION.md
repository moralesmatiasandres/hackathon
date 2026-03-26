# Execution Plan — Sardius Feed Search & Filter Grid

## Phase 0 — Design & Plan (Luisa)

**Status:** Waiting for design mockup

- Luisa reviews the API feed and creates a mockup showing:
  - Grid layout with feed items (thumbnail, title, speaker, category)
  - Search bar placement and style
  - Category filter (dropdown or tag pills)
  - Speaker filter (dropdown or tag pills)
- Once received, we adapt our implementation to match the design

**Deliverable:** Design mockup + component breakdown shared with both teams

---

## Phase 1 — Project Scaffold & API Integration

**Owner:** Matias & Mabel
**Estimated effort:** ~30 min

### Tasks

- [ ] Create `index.html` with base HTML structure
  - Header section: app title, search bar, two filter controls
  - Main section: grid container
  - Footer (optional): result count
- [ ] Create `js/api.js`
  - `fetchFeed()` — GET request to `https://api.sardius.media/feeds/b94F91A2A4c1c84/3F132018BD/public`
  - `normalizeItem(hit)` — extract and flatten fields:
    - `id` ← `hit.id`
    - `title` ← `hit.title`
    - `thumbnail` ← `hit.files.find(f => f.isDefault && f.types.includes('thumbnail'))?.url`
    - `speakers` ← `hit.bios?.speakers?.map(s => s.name)` or `[]`
    - `categories` ← `hit.categories` or `[]`
    - `duration` ← `hit.duration`
    - `description` ← `hit.description` or `''`
    - `airDate` ← `hit.airDate`
  - `normalizeItems(hits)` — map all hits through normalizeItem
- [ ] Create `js/app.js` — entry point
  - Call `fetchFeed()`, store normalized data
  - Log to console to verify data integrity
- [ ] Verify: open in browser, check console for clean data

### Acceptance Criteria
- Feed data loads without errors
- Normalized items have all required fields
- Console shows array of clean objects

---

## Phase 2 — Grid Rendering

**Owner:** Matias & Mabel
**Estimated effort:** ~30 min

### Tasks

- [ ] Create `js/render.js`
  - `renderGrid(items, container)` — clears container, creates card elements
  - `createCard(item)` — returns a DOM element with:
    - Thumbnail image (with fallback placeholder)
    - Title
    - Speaker name(s) as comma-separated string
    - Category badges (small colored pills)
    - Optional: duration formatted as mm:ss
- [ ] Create `css/styles.css`
  - CSS reset / base styles
  - Grid container: `display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`
  - Card styles: rounded corners, shadow, hover effect
  - Thumbnail: aspect-ratio 16/9, object-fit cover
  - Category badge: small pill with background color
  - Responsive: stack to single column on mobile
- [ ] Wire `app.js` to call `renderGrid()` after data loads
- [ ] Add loading spinner / skeleton while fetching

### Acceptance Criteria
- Grid displays all items with thumbnails, titles, speakers, categories
- Layout is responsive (3-4 columns desktop, 2 tablet, 1 mobile)
- Missing thumbnails show placeholder
- Loading state visible while API call is in progress

---

## Phase 3 — Category & Speaker Filters

**Owner:** Matias & Mabel
**Estimated effort:** ~30 min

### Tasks

- [ ] Create `js/filters.js`
  - `extractUniqueCategories(items)` — returns sorted array of unique category strings
  - `extractUniqueSpeakers(items)` — returns sorted array of unique speaker names
  - `filterItems(items, { search, category, speaker })` — returns filtered array
    - If category selected: item must include that category
    - If speaker selected: item must include that speaker
    - Both filters use AND logic
- [ ] Render filter controls in `render.js`
  - `renderCategoryFilter(categories, container)` — dropdown or pill buttons
  - `renderSpeakerFilter(speakers, container)` — dropdown or pill buttons
  - Each has an "All" option to clear the filter
- [ ] Wire filters in `app.js`
  - On filter change → call `filterItems()` → call `renderGrid()` with filtered results
  - Store current filter state in a simple object `{ search: '', category: '', speaker: '' }`

### Acceptance Criteria
- Category dropdown/pills populated dynamically from feed data
- Speaker dropdown/pills populated dynamically from feed data
- Selecting a category shows only items in that category
- Selecting a speaker shows only items with that speaker
- "All" resets the filter
- Filters combine with AND logic

---

## Phase 4 — Text Search

**Owner:** Matias & Mabel
**Estimated effort:** ~20 min

### Tasks

- [ ] Add search input in the header
- [ ] Implement search in `filters.js`
  - `matchesSearch(item, query)` — case-insensitive match against title, description, speaker names
  - Integrate into `filterItems()` function
- [ ] Add debounce (300ms) to search input handler
- [ ] Show result count (e.g., "Showing 42 of 988 results")

### Acceptance Criteria
- Typing in search bar filters results in real-time
- Search matches against title, description, and speaker names
- Search works in combination with category and speaker filters (AND logic)
- Result count updates as filters change

---

## Phase 5 — Polish & Integration

**Owner:** Matias & Mabel
**Estimated effort:** ~20 min

### Tasks

- [ ] Apply Luisa's design mockup (colors, typography, spacing, layout adjustments)
- [ ] Empty state: "No results found" message when filters return zero items
- [ ] Clear all filters button
- [ ] Edge cases:
  - Items with no speakers → show "Unknown" or hide speaker field
  - Items with no categories → skip category badge
  - Items with no thumbnail → placeholder image
  - Very long titles → truncate with ellipsis
- [ ] Performance: ensure filtering 988 items feels instant
- [ ] Cross-browser check (Chrome, Firefox, Safari)
- [ ] Final responsive design pass

### Acceptance Criteria
- App matches design mockup
- All edge cases handled gracefully
- Filters are fast and responsive
- Works on mobile, tablet, desktop

---

## Phase 2 (QA) — Testing & Knowledge Base (Yoneko)

**Owner:** Yoneko
**Estimated effort:** ~30 min

### Tasks

- [ ] Generate test checklist with Claude (edge cases, empty states, filter combos)
- [ ] Run through checklist, log bugs
- [ ] Write "How to Use This App" tutorial for non-technical users

### Deliverable
- Bug/issue log
- User tutorial (1 page)

---

## Phase 3 (Marketing) — Marketing Email (Mari)

**Owner:** Mari
**Estimated effort:** ~30 min

### Tasks

- [ ] Take 2-3 screenshots of finished app
- [ ] Draft marketing email with Claude
- [ ] Polish email copy

### Deliverable
- Ready-to-send marketing email (subject line + body + screenshot references)

---

## Summary Timeline

| Phase | Task | Estimated |
|-------|------|-----------|
| 0 | Design & Plan (Luisa) | Pre-work |
| 1 | Scaffold + API | ~30 min |
| 2 | Grid Rendering | ~30 min |
| 3 | Category & Speaker Filters | ~30 min |
| 4 | Text Search | ~20 min |
| 5 | Polish & Design Integration | ~20 min |
| QA | Testing & Tutorial | ~30 min |
| Marketing | Email Draft | ~30 min |
