function formatDuration(ms) {
  if (!ms) return '';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function createCard(item) {
  const card = document.createElement('article');
  card.className = 'card';
  card.tabIndex = 0;
  card.setAttribute('role', 'button');

  const thumbnailSrc = item.thumbnail || 'https://placehold.co/640x360/2a2a2a/666?text=No+Thumbnail';

  const speakerText = item.speakers.length > 0
    ? item.speakers.join(', ')
    : '';

  const duration = formatDuration(item.duration);

  card.innerHTML = `
    <div class="card__thumbnail-wrapper">
      <img
        class="card__thumbnail"
        src="${thumbnailSrc}"
        alt="${item.title}"
        loading="lazy"
      />
      ${duration ? `<span class="card__duration">${duration}</span>` : ''}
    </div>
    <div class="card__info">
      <h3 class="card__title">${item.title}</h3>
      ${speakerText ? `<p class="card__speaker">${speakerText}</p>` : ''}
    </div>
  `;

  return card;
}

export function renderGrid(items, container, onCardClick) {
  container.innerHTML = '';
  const fragment = document.createDocumentFragment();
  for (const item of items) {
    const card = createCard(item);
    if (onCardClick) {
      card.addEventListener('click', () => onCardClick(item));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onCardClick(item);
        }
      });
    }
    fragment.appendChild(card);
  }
  container.appendChild(fragment);
}

export function renderCategoryPills(categories, container, activeCategory, onClick) {
  container.innerHTML = '';

  // "All" pill
  const allBtn = document.createElement('button');
  allBtn.className = `pill${activeCategory === '' ? ' pill--active' : ''}`;
  allBtn.dataset.category = '';
  allBtn.textContent = 'All';
  allBtn.addEventListener('click', () => onClick(''));
  container.appendChild(allBtn);

  for (const cat of categories) {
    const btn = document.createElement('button');
    btn.className = `pill${activeCategory === cat ? ' pill--active' : ''}`;
    btn.dataset.category = cat;
    btn.textContent = cat;
    btn.addEventListener('click', () => onClick(cat));
    container.appendChild(btn);
  }
}

export function renderSpeakerOptions(speakers, selectElement) {
  selectElement.innerHTML = '<option value="">All Speakers</option>';
  for (const name of speakers) {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    selectElement.appendChild(option);
  }
}
