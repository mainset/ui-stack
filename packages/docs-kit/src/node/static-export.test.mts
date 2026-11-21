import { describe, expect, it } from 'vitest';

import { extractInternalLinks } from './static-export.mjs';

describe('extractInternalLinks', () => {
  it('follows the pages a page links to, under the base path only', () => {
    const html = `
      <a href="/ui-stack/ui-core/box#props">Box</a>
      <a class="x" href="/ui-stack/ui-core/grid/?tab=1">Grid</a>
      <a href="/ui-stack/">Home</a>
      <a href="/elsewhere">Elsewhere</a>
      <a href="https://github.com/mainset">GitHub</a>
      <a href="#top">Top</a>
      <link rel="alternate" hreflang="uk" href="/ui-stack/uk/ui-core/box" />
      <link rel="stylesheet" href="/ui-stack/css/main.css" />
      <a href="/ui-stack/assets/report.pdf">PDF</a>
    `;

    expect(extractInternalLinks(html, '/ui-stack/').sort()).toEqual([
      '/ui-stack',
      '/ui-stack/ui-core/box',
      '/ui-stack/ui-core/grid',
      '/ui-stack/uk/ui-core/box',
    ]);
  });
});
