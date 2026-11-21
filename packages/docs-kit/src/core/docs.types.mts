import type { DocsUiStrings } from './ui-strings.mjs';

// ========== Markdown modules (what the loader makes of a `*.md` file) ==========

/** A heading of a page, as listed in its table of contents */
interface DocsHeading {
  depth: 2 | 3;
  /** GitHub-compatible slug, the heading's `id` */
  id: string;
  text: string;
}

interface DocsPageFrontmatter {
  /** Defaults to the page's `# h1`, then to its file name */
  title?: string;
  /** Defaults to the first paragraph */
  description?: string;
  sidebar?: {
    /** Shorter label for the sidebar, defaults to the title */
    label?: string;
    /** Position among its siblings; defaults to the file's `01-` prefix */
    order?: number;
    /** Routable, but not listed in the sidebar (nor in prev / next) */
    hidden?: boolean;
    /** Lists the page's `##` headings under it in the sidebar, as anchors */
    anchors?: boolean;
  };
  /** `false` hides the "On this page" panel */
  toc?: boolean;
  [key: string]: unknown;
}

/** Eager part of a page: small, it feeds the sidebar, search and `<head>` */
interface DocsPageMeta {
  title: string;
  description: string;
  headings: DocsHeading[];
  frontmatter: DocsPageFrontmatter;
}

/** Lazy part of a page: its own chunk, loaded by the page's route */
interface DocsPageContent {
  html: string;
}

interface DocsMarkdownModule {
  meta: DocsPageMeta;
  loadContent: () => Promise<DocsPageContent>;
}

/** `_category.json` beside the pages of a folder (per locale) */
interface DocsCategoryConfig {
  label?: string;
  /** Defaults to the folder's `01-` prefix */
  order?: number;
  /** Closed until it holds the current page @default true */
  collapsed?: boolean;
}

/** What `import.meta.webpackContext()` / `require.context()` return */
interface DocsContentContext {
  keys(): string[];
  (key: string): unknown;
}

// ========== Site configuration ==========

type DocsLocalized<T> = T | Record<string, T>;

interface DocsLocaleConfig {
  /** In its own language: `Українська` */
  label: string;
  /** BCP 47 tag for `<html lang>` @default the locale key */
  lang?: string;
  /** @default 'ltr' */
  dir?: 'ltr' | 'rtl';
}

interface DocsSectionOptions {
  id: string;
  /** URL segment of the section @default id */
  path?: string;
  label: DocsLocalized<string>;
  /**
   * The section's pages: `import.meta.webpackContext('./content', { recursive: true, regExp: /\.(md|json)$/ })`.
   * Its first folder level is the locale: `./en/01-getting-started/01-introduction.md`.
   */
  content: DocsContentContext;
  /** The page's file (`en/01-getting-started/01-introduction.md`) is appended to it */
  editUrl?: string;
}

interface DocsSiteOptions {
  title: DocsLocalized<string>;
  defaultLocale: string;
  locales: Record<string, DocsLocaleConfig>;
  /** Overrides of the built-in interface strings, per locale */
  ui?: Record<string, Partial<DocsUiStrings>>;
  /** Shown as an icon link in the header */
  repositoryUrl?: string;
  /**
   * Where the site is published, base path included (`https://mainset.github.io/ui-stack`):
   * makes the canonical and `hreflang` links absolute, as search engines expect
   */
  url?: string;
}

// ========== Runtime model ==========

interface DocsPage {
  sectionId: string;
  /** Path inside the section, without locale and order prefixes: `layout/box`, `''` = index */
  key: string;
  /** The locale of the route the page is shown in */
  locale: string;
  /** The locale of the file shown: differs from {locale} when the page isn't translated */
  contentLocale: string;
  isFallback: boolean;
  /** Relative to the section's content folder: `en/03-layout/01-box.md` */
  filePath: string;
  order: number | undefined;
  label: string;
  isHidden: boolean;
  meta: DocsPageMeta;
  loadContent: () => Promise<DocsPageContent>;
}

interface DocsNavPage {
  type: 'page';
  key: string;
  label: string;
  page: DocsPage;
}

interface DocsNavCategory {
  type: 'category';
  key: string;
  label: string;
  isCollapsed: boolean;
  items: DocsNavItem[];
}

type DocsNavItem = DocsNavPage | DocsNavCategory;

/** One section, localized: the sidebar tree and every routable page in reading order */
interface DocsSectionLocaleIndex {
  nav: DocsNavItem[];
  /** Listed pages first, in sidebar order (prev / next), then the hidden ones */
  pages: DocsPage[];
  pageByKey: Map<string, DocsPage>;
}

interface DocsSection {
  id: string;
  path: string;
  label: DocsLocalized<string>;
  editUrl?: string;
  /** Built on first use and cached: the sidebar and pages of the section in one locale */
  getLocaleIndex: (locale: string) => DocsSectionLocaleIndex;
}

interface DocsSite {
  title: DocsLocalized<string>;
  defaultLocale: string;
  locales: Record<string, Required<DocsLocaleConfig>>;
  sections: DocsSection[];
  ui?: Record<string, Partial<DocsUiStrings>>;
  repositoryUrl?: string;
  url?: string;
}

export type {
  DocsCategoryConfig,
  DocsContentContext,
  DocsHeading,
  DocsLocaleConfig,
  DocsLocalized,
  DocsMarkdownModule,
  DocsNavCategory,
  DocsNavItem,
  DocsNavPage,
  DocsPage,
  DocsPageContent,
  DocsPageFrontmatter,
  DocsPageMeta,
  DocsSection,
  DocsSectionLocaleIndex,
  DocsSectionOptions,
  DocsSite,
  DocsSiteOptions,
};
