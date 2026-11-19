import { describe, expect, it } from 'vitest';

import { compileMarkdown } from './compile-markdown.mjs';

const FILE_PATH = '/repo/src/pages/ui-core/content/en/03-elements/01-box.md';

const compile = (source: string, filePath = FILE_PATH) =>
  compileMarkdown(source, { filePath });

describe('compileMarkdown', () => {
  it('takes the title from the h1 and the description from the first paragraph', async () => {
    const { meta, html } = await compile('# Box\n\nA box with **spacing**.\n');

    expect(meta.title).toBe('Box');
    expect(meta.description).toBe('A box with spacing.');
    expect(html).not.toContain('<h1');
  });

  it('prefers the frontmatter', async () => {
    const { meta } = await compile(
      '---\ntitle: Box element\ndescription: Short.\nsidebar:\n  order: 2\n---\n\n# Box\n\nLong text.\n',
    );

    expect(meta).toMatchObject({
      title: 'Box element',
      description: 'Short.',
      frontmatter: { sidebar: { order: 2 } },
    });
  });

  it('gives headings GitHub ids and lists h2 / h3 for the table of contents', async () => {
    const { meta, html } = await compile(
      '# Box\n\n## Usage\n\n### With `code`\n\n#### Deep\n\n## Usage\n',
    );

    expect(meta.headings).toEqual([
      { depth: 2, id: 'usage', text: 'Usage' },
      { depth: 3, id: 'with-code', text: 'With code' },
      { depth: 2, id: 'usage-1', text: 'Usage' },
    ]);
    expect(html).toContain('<h4 id="deep">');
    expect(html).toContain('<a class="msd-heading-anchor" href="#usage"');
  });

  it('turns links to other pages into page links, by key', async () => {
    const { html, warnings } = await compile(
      '[tokens](../02-theming/04-tokens.md#spacing) [grid](./grid.md) [readme](../../../README.md) [web](https://x.dev)',
    );

    expect(html).toContain('href="msd:theming/tokens#spacing"');
    expect(html).toContain('href="msd:elements/grid"');
    expect(html).toContain('href="https://x.dev"');
    expect(warnings).toEqual([
      'link to "../../../README.md" points outside the "en" pages, so it is left as it is',
    ]);
  });

  it('renders GitHub alerts as ui-core alerts, titled in the page language', async () => {
    const { html } = await compile(
      '> [!WARNING]\n> Mind the gap.\n',
      '/repo/content/uk/x.md',
    );

    expect(html).toContain('ms-alert');
    expect(html).toContain('ms-tone-warning');
    expect(html).toContain('<p class="ms-alert__title">Увага</p>');
    expect(html).toContain('Mind the gap.');
    expect(html).not.toContain('[!WARNING]');
  });

  it('styles tables with ui-core classes and logical alignment', async () => {
    const { html } = await compile('| A | B |\n| :-- | --: |\n| 1 | 2 |\n');

    expect(html).toContain(
      '<div class="ms-table-wrapper" tabindex="0"><table class="ms-table ms-table--size-sm">',
    );
    expect(html).toContain('class="ms-table__cell ms-table__cell--align-end"');
    expect(html).not.toContain('align=');
  });

  it('highlights code and renders `html preview` fences live', async () => {
    const { html } = await compile(
      '```ts\nconst a = 1;\n```\n\n```html preview\n<button class="ms-button">Hi</button>\n```\n',
    );

    expect(html).toContain('<div class="msd-code" data-lang="ts">');
    expect(html).toContain('--shiki-light');
    expect(html).toContain(
      '<div class="msd-preview__canvas"><button class="ms-button">Hi</button>',
    );
  });
});
