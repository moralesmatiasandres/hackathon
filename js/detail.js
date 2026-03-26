function formatDuration(ms) {
  if (!ms) return '';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function timeAgo(dateString) {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffWeeks < 5) return `${diffWeeks} weeks ago`;
  if (diffMonths < 12) return `${diffMonths} months ago`;
  return `${diffYears} years ago`;
}

function getRelatedItems(currentItem, allItems) {
  const related = [];

  // 1. Same series (strongest match)
  if (currentItem.series) {
    const seriesItems = allItems.filter(
      (i) => i.id !== currentItem.id && i.series === currentItem.series
    );
    related.push(...seriesItems);
  }

  // 2. Same category (if we need more)
  if (currentItem.categories.length > 0) {
    const categoryItems = allItems.filter(
      (i) =>
        i.id !== currentItem.id &&
        !related.some((r) => r.id === i.id) &&
        i.categories.some((c) => currentItem.categories.includes(c))
    );
    related.push(...categoryItems);
  }

  // 3. Fill remaining with other items
  if (related.length < 10) {
    const remaining = allItems.filter(
      (i) => i.id !== currentItem.id && !related.some((r) => r.id === i.id)
    );
    related.push(...remaining.slice(0, 10 - related.length));
  }

  return related.slice(0, 20);
}

let hlsInstance = null;

function initPlayer(videoEl, url) {
  if (!url) return;

  if (hlsInstance) {
    hlsInstance.destroy();
    hlsInstance = null;
  }

  if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
    videoEl.src = url;
  } else if (window.Hls && window.Hls.isSupported()) {
    hlsInstance = new window.Hls();
    hlsInstance.loadSource(url);
    hlsInstance.attachMedia(videoEl);
  } else {
    videoEl.src = url;
  }
}

export function destroyPlayer() {
  if (hlsInstance) {
    hlsInstance.destroy();
    hlsInstance = null;
  }
}

export function openDetail(item, container, allItems, onNavigate, onBack) {
  destroyPlayer();
  container.innerHTML = '';

  const speakerName = item.speakers.length > 0 ? item.speakers[0] : '';
  const categoryLabel = item.categories.length > 0 ? item.categories[0] : '';
  const ago = timeAgo(item.airDate);
  const related = getRelatedItems(item, allItems);

  // Count series items for label
  const seriesCount = item.series
    ? allItems.filter((i) => i.series === item.series).length
    : 0;

  const playlistLabel = item.series || (categoryLabel ? `More in ${categoryLabel}` : 'Up Next');
  const playlistCount = item.series ? `${seriesCount} videos` : `${related.length} videos`;

  const detail = document.createElement('div');
  detail.className = 'detail';

  detail.innerHTML = `
    <!-- Detail Header -->
    <header class="detail__header">
      <button class="detail__back" id="detail-back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
        Back to videos
      </button>
      <span class="detail__brand">SARDIUS</span>
      <button class="detail__close" id="detail-close" aria-label="Close">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </header>

    <!-- Video Player -->
    <div class="detail__player">
      <video
        id="detail-video"
        class="detail__video"
        poster="${item.thumbnail || ''}"
        controls
        playsinline
      ></video>
    </div>

    <!-- Info -->
    <div class="detail__info">
      <h2 class="detail__title">${item.title}</h2>
      <div class="detail__meta">
        ${categoryLabel ? `<span class="detail__category">${categoryLabel}</span>` : ''}
        ${speakerName ? `<span class="detail__meta-text">${speakerName}</span>` : ''}
        ${ago ? `<span class="detail__meta-text">${ago}</span>` : ''}
      </div>
    </div>

    <!-- Speaker -->
    ${speakerName ? `
    <div class="detail__speaker">
      <div class="detail__speaker-avatar">
        ${speakerName.charAt(0).toUpperCase()}
      </div>
      <div class="detail__speaker-info">
        <span class="detail__speaker-name">${speakerName}</span>
        <span class="detail__speaker-role">Speaker</span>
      </div>
    </div>
    ` : ''}

    <!-- Description -->
    ${item.description ? `<div class="detail__description-wrap"><p class="detail__description">${item.description}</p></div>` : ''}

    <!-- Playlist / Up Next -->
    ${related.length > 0 ? `
    <div class="playlist">
      <div class="playlist__header">
        <div class="playlist__label">
          <span class="playlist__accent"></span>
          <span class="playlist__title-text">${playlistLabel}</span>
        </div>
        <span class="playlist__count">${playlistCount}</span>
      </div>
      <div class="playlist__list" id="playlist-list"></div>
    </div>
    ` : ''}

    <!-- Footer -->
    <footer class="detail__footer">
      Powered by Sardius Media
    </footer>
  `;

  container.appendChild(detail);

  // Render playlist items
  if (related.length > 0) {
    const listEl = detail.querySelector('#playlist-list');
    for (const relItem of related) {
      const row = document.createElement('div');
      row.className = 'playlist__item';

      const thumb = relItem.thumbnail || 'https://placehold.co/160x90/2a2a2a/666?text=No+Thumb';
      const dur = formatDuration(relItem.duration);
      const relSpeaker = relItem.speakers.length > 0 ? relItem.speakers[0] : '';

      row.innerHTML = `
        <div class="playlist__thumb-wrap">
          <img class="playlist__thumb" src="${thumb}" alt="${relItem.title}" loading="lazy" />
          ${dur ? `<span class="playlist__duration">${dur}</span>` : ''}
        </div>
        <div class="playlist__item-info">
          <span class="playlist__item-title">${relItem.title}</span>
          ${relSpeaker ? `<span class="playlist__item-speaker">${relSpeaker}</span>` : ''}
        </div>
      `;

      row.addEventListener('click', () => {
        window.scrollTo(0, 0);
        onNavigate(relItem);
      });

      listEl.appendChild(row);
    }
  }

  // Wire back / close buttons
  const goBack = () => {
    destroyPlayer();
    onBack();
  };
  detail.querySelector('#detail-back').addEventListener('click', goBack);
  detail.querySelector('#detail-close').addEventListener('click', goBack);

  // Init video player
  const videoEl = detail.querySelector('#detail-video');
  if (item.mediaUrl) {
    initPlayer(videoEl, item.mediaUrl);
  }
}
