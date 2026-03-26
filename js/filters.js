export function extractUniqueCategories(items) {
  const set = new Set();
  for (const item of items) {
    for (const cat of item.categories) {
      set.add(cat);
    }
  }
  return [...set].sort();
}

export function extractUniqueSpeakers(items) {
  const set = new Set();
  for (const item of items) {
    for (const speaker of item.speakers) {
      set.add(speaker);
    }
  }
  return [...set].sort();
}

export function filterItems(items, { search = '', category = '', speaker = '' }) {
  const query = search.toLowerCase().trim();

  return items.filter((item) => {
    // Category filter
    if (category && !item.categories.includes(category)) {
      return false;
    }

    // Speaker filter
    if (speaker && !item.speakers.includes(speaker)) {
      return false;
    }

    // Text search
    if (query) {
      const inTitle = item.title.toLowerCase().includes(query);
      const inDescription = item.description.toLowerCase().includes(query);
      const inSpeakers = item.speakers.some((s) =>
        s.toLowerCase().includes(query)
      );
      if (!inTitle && !inDescription && !inSpeakers) {
        return false;
      }
    }

    return true;
  });
}
