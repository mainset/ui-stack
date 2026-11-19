import type {
  DocsNavCategory,
  DocsNavItem,
  DocsPage,
  DocsSectionLocaleIndex,
} from './docs.types.mjs';

/** The categories from the top of the sidebar down to the page (empty: the page is top-level) */
function findNavTrail(
  items: DocsNavItem[],
  pageKey: string,
): DocsNavCategory[] {
  for (const item of items) {
    if (item.type === 'page') {
      if (item.key === pageKey) return [];
    } else {
      const trail = findNavTrail(item.items, pageKey);

      if (trail.length > 0 || containsPage(item, pageKey))
        return [item, ...trail];
    }
  }

  return [];
}

function containsPage(category: DocsNavCategory, pageKey: string): boolean {
  return category.items.some((item) =>
    item.type === 'page' ? item.key === pageKey : containsPage(item, pageKey),
  );
}

/** The pages before and after it in sidebar order (hidden pages have neither) */
function findSiblingPages(
  index: DocsSectionLocaleIndex,
  page: DocsPage,
): { previous?: DocsPage; next?: DocsPage } {
  const listed = index.pages.filter((listedPage) => !listedPage.isHidden);
  const position = listed.findIndex(({ key }) => key === page.key);

  if (position === -1) return {};

  return { previous: listed[position - 1], next: listed[position + 1] };
}

export { containsPage, findNavTrail, findSiblingPages };
