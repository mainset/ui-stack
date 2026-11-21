import { describe, expect, it } from 'vitest';

import type { DocsContentContext } from '../core/docs.types.mjs';
import {
  createDocsAppSite,
  readTranslations,
  splitSectionContents,
} from './docs-app.js';

const page = (title: string) => ({
  meta: { title, description: '', headings: [], frontmatter: {} },
  loadContent: async () => ({ html: '' }),
});

/** A stand-in for `import.meta.webpackContext()` over {modules} */
const fakeContext = (modules: Record<string, unknown>): DocsContentContext =>
  Object.assign((key: string) => modules[key], {
    keys: () => Object.keys(modules),
  });

const CONTENT = fakeContext({
  './zeta/content/en/index.md': page('Zeta'),
  './ui-core/content/en/index.md': page('Introduction'),
  './ui-core/content/en/01-start/_category.json': { label: 'Start' },
  './ui-core/content/en/01-start/01-install.md': page('Install'),
  './ui-core/content/uk/index.md': page('Вступ'),
  './Home/HomePage.md': page('not a section'),
});

const TRANSLATIONS = fakeContext({
  './en/translation.json': { home: { title: 'Hi' } },
  './uk/translation.json': { ui: { search: 'Знайти' } },
});

const CONFIG = {
  title: 'Docs',
  defaultLocale: 'en',
  locales: { en: { label: 'English' }, uk: { label: 'Українська' } },
};

describe('splitSectionContents', () => {
  it('gives each section its own context, keyed inside its `content` folder', () => {
    const sections = splitSectionContents(CONTENT);

    expect(Array.from(sections.keys())).toEqual(['zeta', 'ui-core']);
    expect(sections.get('ui-core')!.keys()).toEqual([
      './en/index.md',
      './en/01-start/_category.json',
      './en/01-start/01-install.md',
      './uk/index.md',
    ]);
    expect(sections.get('ui-core')!('./en/01-start/_category.json')).toEqual({
      label: 'Start',
    });
  });
});

describe('readTranslations', () => {
  it('reads each locale, nothing without the folder', () => {
    expect(readTranslations(TRANSLATIONS)).toEqual({
      en: { home: { title: 'Hi' } },
      uk: { ui: { search: 'Знайти' } },
    });
    expect(readTranslations(null)).toEqual({});
  });
});

describe('createDocsAppSite', () => {
  it('orders the configured sections first, then the others alphabetically', () => {
    const site = createDocsAppSite(
      { ...CONFIG, sections: { zeta: { label: 'Zeta docs' } } },
      { content: CONTENT, translations: null },
    );

    expect(site.sections.map(({ id, label }) => [id, label])).toEqual([
      ['zeta', 'Zeta docs'],
      ['ui-core', 'Ui core'],
    ]);
  });

  it('builds edit links from the base, unless the section has its own', () => {
    const site = createDocsAppSite(
      {
        ...CONFIG,
        editUrl: 'https://github.com/org/repo/edit/main/src/pages',
        sections: { zeta: { editUrl: 'https://example.com/zeta/' } },
      },
      { content: CONTENT, translations: null },
    );

    expect(site.sections.map(({ editUrl }) => editUrl)).toEqual([
      'https://example.com/zeta/',
      'https://github.com/org/repo/edit/main/src/pages/ui-core/content/',
    ]);
  });

  it("rewords the interface from a translation's `ui`, the config's `ui` winning", () => {
    const site = createDocsAppSite(
      { ...CONFIG, ui: { uk: { searchHint: 'Пишіть' } } },
      { content: CONTENT, translations: TRANSLATIONS },
    );

    expect(site.ui).toEqual({
      en: {},
      uk: { search: 'Знайти', searchHint: 'Пишіть' },
    });
  });

  it('fails on a configured section without a folder', () => {
    expect(() =>
      createDocsAppSite(
        { ...CONFIG, sections: { react: {} } },
        { content: CONTENT, translations: null },
      ),
    ).toThrow('sections.react: there is no src/pages/react/content folder');
  });
});
