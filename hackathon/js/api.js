const FEED_URL =
  'https://api.sardius.media/feeds/b94F91A2A4c1c84/3F132018BD/public';

const PAGE_SIZE = 100;

function normalizeItem(hit) {
  const thumbnail =
    hit.files?.find(
      (f) => f.isDefault && f.types?.includes('thumbnail')
    )?.url ||
    hit.files?.find((f) => f.types?.includes('thumbnail'))?.url ||
    null;

  // Speakers are plain strings in this feed, not objects
  const speakers =
    hit.bios?.speakers
      ?.map((s) => (typeof s === 'string' ? s : s.name || s.title || ''))
      .filter(Boolean) || [];

  const categories = hit.categories || [];

  const duration = hit.duration || 0;

  return {
    id: hit.id,
    title: hit.title || 'Untitled',
    description: hit.description || '',
    thumbnail,
    speakers,
    categories,
    duration,
    airDate: hit.airDate || null,
    mediaUrl: hit.media?.url || null,
    series: hit.series || '',
  };
}

export async function fetchFeed(onProgress) {
  // First request to get total count
  const firstRes = await fetch(`${FEED_URL}?page=1&count=${PAGE_SIZE}`);
  if (!firstRes.ok) {
    throw new Error(`API error: ${firstRes.status} ${firstRes.statusText}`);
  }

  const firstData = await firstRes.json();
  const total = firstData.total || 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  let allHits = [...(firstData.hits || [])];

  if (onProgress) onProgress(allHits.length, total);

  // Fetch remaining pages in parallel
  if (totalPages > 1) {
    const pagePromises = [];
    for (let page = 2; page <= totalPages; page++) {
      pagePromises.push(
        fetch(`${FEED_URL}?page=${page}&count=${PAGE_SIZE}`)
          .then((res) => res.json())
          .then((data) => data.hits || [])
      );
    }

    const results = await Promise.all(pagePromises);
    for (const hits of results) {
      allHits = allHits.concat(hits);
    }
  }

  const items = allHits.map(normalizeItem);
  console.log(`Fetched ${items.length} of ${total} items from feed`);
  return items;
}
