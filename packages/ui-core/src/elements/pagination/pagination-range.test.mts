import { describe, expect, it } from 'vitest';

import { paginationRange } from './pagination-range.mjs';

const pages = (page: number, pageCount: number, extra = {}) =>
  paginationRange({ page, pageCount, ...extra });

describe('paginationRange', () => {
  it('shows every page when they fit', () => {
    expect(pages(1, 0)).toEqual([]);
    expect(pages(1, 1)).toEqual([1]);
    expect(pages(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('hides pages behind ellipses around the current one', () => {
    expect(pages(1, 20)).toEqual([1, 2, 3, 4, 5, 'ellipsis', 20]);
    expect(pages(6, 20)).toEqual([1, 'ellipsis', 5, 6, 7, 'ellipsis', 20]);
    expect(pages(20, 20)).toEqual([1, 'ellipsis', 16, 17, 18, 19, 20]);
  });

  it('keeps the same length on every page, so buttons never jump', () => {
    const lengths = Array.from(
      { length: 20 },
      (_, i) => pages(i + 1, 20).length,
    );
    expect(new Set(lengths)).toEqual(new Set([7]));
  });

  it('shows a single hidden page instead of an ellipsis', () => {
    // 2 would be the only page behind the ellipsis
    expect(pages(4, 20)).toEqual([1, 2, 3, 4, 5, 'ellipsis', 20]);
    expect(pages(5, 20)).toEqual([1, 'ellipsis', 4, 5, 6, 'ellipsis', 20]);
  });

  it('takes sibling and boundary counts, and clamps the page', () => {
    expect(pages(10, 20, { siblingCount: 2, boundaryCount: 2 })).toEqual([
      1,
      2,
      'ellipsis',
      8,
      9,
      10,
      11,
      12,
      'ellipsis',
      19,
      20,
    ]);
    expect(pages(10, 20, { siblingCount: 0, boundaryCount: 0 })).toEqual([
      'ellipsis',
      10,
      'ellipsis',
    ]);
    expect(pages(99, 20)).toEqual(pages(20, 20));
  });
});
