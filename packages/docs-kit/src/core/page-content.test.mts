import { describe, expect, it, vi } from 'vitest';

import type { DocsPage } from './docs.types.mjs';
import {
  loadPageContent,
  readPageContent,
  resolvePageLinks,
} from './page-content.mjs';

const fakePage = (filePath: string, loadContent: DocsPage['loadContent']) =>
  ({ sectionId: 'test', filePath, loadContent }) as DocsPage;

describe('page content', () => {
  it('points page links at the section, in any locale and under any base path', () => {
    const html =
      '<a href="msd:layout/box#props">Box</a> <a href="msd:">Intro</a> <a href="msd:#top">Top</a> <a href="https://x.dev">x</a>';

    expect(resolvePageLinks(html, '/ui-stack/uk/ui-core')).toBe(
      '<a href="/ui-stack/uk/ui-core/layout/box#props">Box</a> <a href="/ui-stack/uk/ui-core">Intro</a> <a href="/ui-stack/uk/ui-core#top">Top</a> <a href="https://x.dev">x</a>',
    );
  });

  it('loads a page once, then reads it synchronously', async () => {
    const loadContent = vi.fn(async () => ({ html: '<p>Box</p>' }));
    const page = fakePage('en/box.md', loadContent);

    expect(readPageContent(page)).toBeUndefined();
    await Promise.all([loadPageContent(page), loadPageContent(page)]);
    await loadPageContent(page);

    expect(loadContent).toHaveBeenCalledTimes(1);
    expect(readPageContent(page)).toEqual({ html: '<p>Box</p>' });
  });

  it('tries again after a failed load (a chunk on a flaky network)', async () => {
    const loadContent = vi
      .fn<DocsPage['loadContent']>()
      .mockRejectedValueOnce(new Error('ChunkLoadError'))
      .mockResolvedValueOnce({ html: '<p>Grid</p>' });
    const page = fakePage('en/grid.md', loadContent);

    await expect(loadPageContent(page)).rejects.toThrow('ChunkLoadError');
    await expect(loadPageContent(page)).resolves.toEqual({
      html: '<p>Grid</p>',
    });
  });
});
