import type { PaginationRangeItem } from './pagination.types.mjs';

interface PaginationRangeOptions {
  /** The current page, from 1 */
  page: number;
  pageCount: number;
  /** Pages shown on each side of the current one @default 1 */
  siblingCount?: number;
  /** Pages always shown at the start and at the end @default 1 */
  boundaryCount?: number;
}

const range = (start: number, end: number) =>
  Array.from({ length: Math.max(end - start + 1, 0) }, (_, i) => start + i);

/**
 * The pages to show, with `'ellipsis'` for the hidden ones. Framework-agnostic: render it
 * with any template. The list keeps the same length while the page changes (an ellipsis only
 * replaces two or more pages), so the buttons don't jump under the pointer.
 *
 * @example paginationRange({ page: 6, pageCount: 20 })
 * // → [1, 'ellipsis', 5, 6, 7, 'ellipsis', 20]
 */
function paginationRange({
  page,
  pageCount,
  siblingCount = 1,
  boundaryCount = 1,
}: PaginationRangeOptions): PaginationRangeItem[] {
  const count = Math.max(Math.floor(pageCount), 0);
  const current = Math.min(Math.max(Math.floor(page), 1), count);

  // Everything fits: boundaries, siblings, the current page and the two ellipses' slots
  if (count <= 2 * boundaryCount + 2 * siblingCount + 3) return range(1, count);

  const startPages = range(1, boundaryCount);
  const endPages = range(count - boundaryCount + 1, count);

  // The sibling window, kept clear of the boundaries (and full width near them)
  const siblingsStart = Math.max(
    Math.min(
      current - siblingCount,
      count - boundaryCount - 2 * siblingCount - 1,
    ),
    boundaryCount + 2,
  );
  const siblingsEnd = Math.min(
    Math.max(current + siblingCount, boundaryCount + 2 * siblingCount + 2),
    count - boundaryCount - 1,
  );

  return [
    ...startPages,
    // a single hidden page is shown rather than replaced by an ellipsis
    siblingsStart > boundaryCount + 2 ? 'ellipsis' : boundaryCount + 1,
    ...range(siblingsStart, siblingsEnd),
    siblingsEnd < count - boundaryCount - 1
      ? 'ellipsis'
      : count - boundaryCount,
    ...endPages,
  ];
}

export { paginationRange };
export type { PaginationRangeOptions };
