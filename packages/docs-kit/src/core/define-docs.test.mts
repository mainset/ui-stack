import { describe, expect, it } from 'vitest';

import { defineDocsSection, defineDocsSite } from './define-docs.mjs';
import type {
  DocsContentContext,
  DocsMarkdownModule,
  DocsNavCategory,
  DocsPageFrontmatter,
} from './docs.types.mjs';
import { findNavTrail, findSiblingPages } from './nav-tree.mjs';

const page = (
  title: string,
  frontmatter: DocsPageFrontmatter = {},
): DocsMarkdownModule => ({
  meta: { title, description: '', headings: [], frontmatter },
  loadContent: async () => ({ html: `<p>${title}</p>` }),
});

// A stand-in for `import.meta.webpackContext()`
function fakeContext(files: Record<string, unknown>): DocsContentContext {
  return Object.assign((key: string) => files[key], {
    keys: () => Object.keys(files),
  });
}

const SECTION = defineDocsSection({
  id: 'ui-core',
  label: 'UI Core',
  content: fakeContext({
    './en/index.md': page('Introduction'),
    './en/01-getting-started/_category.json': {
      label: 'Getting started',
      collapsed: false,
    },
    './en/01-getting-started/02-browser-support.md': page('Browser support'),
    './en/01-getting-started/01-installation.md': page('Installation'),
    './en/02-elements/index.md': page('Elements'),
    './en/02-elements/zeta.md': page('Zeta'),
    './en/02-elements/alpha.md': page('Alpha'),
    './en/02-elements/first.md': page('First', { sidebar: { order: 1 } }),
    './en/02-elements/hidden.md': page('Hidden', { sidebar: { hidden: true } }),
    './uk/01-getting-started/_category.json': {
      default: { label: 'Початок роботи' },
    },
    './uk/01-getting-started/01-installation.md': page('Встановлення'),
    // NOTE: webpack also lists files by module path when `resolve.modules` holds the folder
    'pages/ui-core/content/en/02-elements/zeta.md': page('Duplicate'),
  }),
});

const SITE = defineDocsSite({
  title: 'Docs',
  defaultLocale: 'en',
  locales: { en: { label: 'English' }, uk: { label: 'Українська' } },
  sections: [SECTION],
});

const [section] = SITE.sections;
const labels = (items: { label: string }[]) => items.map(({ label }) => label);

describe('defineDocsSection / defineDocsSite', () => {
  it('builds the sidebar from folders: index page first, then by `01-` prefix', () => {
    const { nav } = section.getLocaleIndex('en');

    expect(labels(nav)).toEqual([
      'Introduction',
      'Getting started',
      'Elements',
    ]);
    expect(labels((nav[1] as DocsNavCategory).items)).toEqual([
      'Installation',
      'Browser support',
    ]);
  });

  it('orders by `sidebar.order`, then alphabetically; a category index is its Overview', () => {
    const elements = section.getLocaleIndex('en').nav[2] as DocsNavCategory;

    expect(labels(elements.items)).toEqual([
      'Overview',
      'First',
      'Alpha',
      'Zeta',
    ]);
    expect(elements.isCollapsed).toBe(true);
    expect(
      (section.getLocaleIndex('en').nav[1] as DocsNavCategory).isCollapsed,
    ).toBe(false);
  });

  it('strips locale and order prefixes from page keys', () => {
    const keys = section.getLocaleIndex('en').pages.map(({ key }) => key);

    expect(keys).toEqual([
      '',
      'getting-started/installation',
      'getting-started/browser-support',
      'elements',
      'elements/first',
      'elements/alpha',
      'elements/zeta',
      // NOTE: hidden: routable, not listed, so last
      'elements/hidden',
    ]);
  });

  it('keeps hidden pages out of the sidebar and of previous / next', () => {
    const index = section.getLocaleIndex('en');
    const hidden = index.pageByKey.get('elements/hidden')!;

    expect(hidden.isHidden).toBe(true);
    expect(findSiblingPages(index, hidden)).toEqual({});
    expect(
      findSiblingPages(index, index.pageByKey.get('elements/zeta')!),
    ).toEqual({
      previous: index.pageByKey.get('elements/alpha'),
      next: undefined,
    });
  });

  it('falls back to the default locale, page by page, and says so', () => {
    const { pageByKey, nav } = section.getLocaleIndex('uk');
    const installation = pageByKey.get('getting-started/installation')!;
    const browserSupport = pageByKey.get('getting-started/browser-support')!;

    expect(installation).toMatchObject({
      label: 'Встановлення',
      isFallback: false,
    });
    expect(browserSupport).toMatchObject({
      label: 'Browser support',
      isFallback: true,
      locale: 'uk',
      contentLocale: 'en',
      filePath: 'en/01-getting-started/02-browser-support.md',
    });
    // a category label per locale (`{ default }` JSON modules too), the built-in Overview label
    expect(labels(nav)).toEqual(['Introduction', 'Початок роботи', 'Elements']);
    expect((nav[2] as DocsNavCategory).items[0].label).toBe('Огляд');
  });

  it('finds the categories above a page', () => {
    const { nav } = section.getLocaleIndex('en');

    expect(labels(findNavTrail(nav, 'elements/alpha'))).toEqual(['Elements']);
    expect(findNavTrail(nav, '')).toEqual([]);
  });

  it('rejects a default locale that is not a locale, and a section path that is one', () => {
    expect(() =>
      defineDocsSite({
        title: 'Docs',
        defaultLocale: 'de',
        locales: { en: { label: 'English' } },
        sections: [],
      }),
    ).toThrow(/defaultLocale "de"/);

    expect(() =>
      defineDocsSite({
        title: 'Docs',
        defaultLocale: 'en',
        locales: { en: { label: 'English' }, uk: { label: 'Українська' } },
        sections: [defineDocsSection({ ...SECTION.options, id: 'uk' })],
      }),
    ).toThrow(/also a locale/);
  });
});
