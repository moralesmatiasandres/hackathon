# CLAUDE.md — Hackathon: Sardius Feed Search & Filter Grid

## Project Overview

A standalone web app (plain HTML + vanilla JavaScript — no frameworks) that fetches the Sardius public media feed and displays it as a searchable, filterable grid.

- **API Feed:** `https://api.sardius.media/feeds/b94F91A2A4c1c84/3F132018BD/public`
- **API Docs:** `https://docs.sardius.media/reference/getpublicfeed`

## Tech Stack

- HTML5 + CSS3 (responsive grid with CSS Grid / Flexbox)
- Vanilla JavaScript (ES modules)
- No build step — open `index.html` directly or serve with any static server

## API Data Model

The feed returns `{ total: number, hits: [...] }`. Each item in `hits` contains:

| UI Element    | API Field                                      |
|---------------|-------------------------------------------------|
| Title         | `title`                                         |
| Thumbnail     | `files[]` where `isDefault: true` → `.url`      |
| Speaker       | `bios.speakers[]` (array of speaker objects)     |
| Category      | `categories[]` (string array)                    |
| Duration      | `duration` (milliseconds)                        |
| Date          | `airDate`                                        |
| Description   | `description`                                    |

## File Structure

```
hackathon/
  index.html          — Main HTML (grid layout, search bar, filter controls)
  css/
    styles.css        — All styling (grid, cards, filters, responsive)
  js/
    app.js            — Entry point, initializes the app
    api.js            — Fetch logic, data normalization
    filters.js        — Search, category filter, speaker filter logic
    render.js         — DOM rendering (grid cards, filter dropdowns)
  CLAUDE.md           — This file
  PLAN_EXECUTION.md   — Detailed development phases
```

## Implementation Phases

### Phase 1 — Project Scaffold & API Integration
1. Create `index.html` with semantic structure (header with filters, main grid area)
2. Create `api.js` — fetch the feed, normalize items into a clean array of objects
3. Verify data loads correctly in the console

### Phase 2 — Grid Rendering
1. Create `render.js` — function to render an array of items as card elements
2. Each card shows: thumbnail, title, speaker name(s), category badge(s)
3. Create `styles.css` — responsive CSS Grid (auto-fill columns, min 280px)
4. Handle missing thumbnails with a placeholder

### Phase 3 — Filters: Categories & Speakers
1. Extract unique categories from the feed data
2. Extract unique speakers from `bios.speakers[]`
3. Render filter controls (dropdown or pill/tag buttons) populated dynamically
4. Create `filters.js` — filtering logic that combines category + speaker selection

### Phase 4 — Search Bar
1. Add text input for real-time search
2. Filter items by matching `title`, `description`, or speaker name against query
3. Debounce input (300ms) for performance

### Phase 5 — Combined Filters + Polish
1. Wire all three filters together (search AND category AND speaker)
2. Show result count and "no results" empty state
3. Add loading spinner while fetching
4. Responsive design check (mobile, tablet, desktop)
5. Apply design mockup from Luisa when available

## Commands

```bash
# Serve locally (any of these work)
npx serve hackathon/
python3 -m http.server 8080 -d hackathon/
open hackathon/index.html   # or just open the file directly
```

## Key Conventions

- No frameworks, no build tools — keep it simple
- All filtering happens client-side (the full dataset is ~988 items)
- Filter state is combined with AND logic (search AND category AND speaker)
- Speakers and categories are extracted dynamically from the feed — no hardcoded values
