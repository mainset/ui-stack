import {
  contentPathToPageKey,
  humanizeSegment,
  parsePathSegment,
} from './content-path.mjs';
import type {
  DocsCategoryConfig,
  DocsContentContext,
  DocsMarkdownModule,
  DocsNavCategory,
  DocsNavItem,
  DocsPage,
  DocsSection,
  DocsSectionLocaleIndex,
  DocsSectionOptions,
  DocsSite,
  DocsSiteOptions,
} from './docs.types.mjs';
import { resolveUiStrings } from './ui-strings.mjs';

const CATEGORY_CONFIG__FILE_NAME = '_category.json';

interface ContentFile {
  key: string;
  locale: string;
  /** `en/03-layout/01-box.md` */
  filePath: string;
  /** Folder of the file inside its locale, without order prefixes: `layout` */
  categoryKey: string;
  order: number | undefined;
  module: DocsMarkdownModule;
}

interface ContentCategory {
  key: string;
  name: string;
  order: number | undefined;
  configByLocale: Record<string, DocsCategoryConfig>;
}

interface DocsSectionDefinition {
  options: DocsSectionOptions;
  filesByLocale: Map<string, Map<string, ContentFile>>;
  categoryByKey: Map<string, ContentCategory>;
}

// NOTE: a JSON module through a webpack context may come as `{ default }`
function unwrapModule<T>(value: unknown): T {
  return ((value as { default?: T })?.default ?? value) as T;
}

function readContent(context: DocsContentContext) {
  const filesByLocale = new Map<string, Map<string, ContentFile>>();
  const categoryByKey = new Map<string, ContentCategory>();

  // NOTE: webpack lists each file twice when a `resolve.modules` entry contains the folder
  // (`./en/x.md` and `pages/…/en/x.md`), the relative keys are the ones to read
  const contextKeys = context
    .keys()
    .filter((contextKey) => contextKey.startsWith('./'))
    .sort();

  contextKeys.forEach((contextKey) => {
    const filePath = contextKey.slice(2);
    const [locale, ...segments] = filePath.split('/');
    const fileName = segments.pop();

    if (!fileName) return;

    const parsedFolders = segments.map(parsePathSegment);
    const categoryKey = parsedFolders.map(({ name }) => name).join('/');

    parsedFolders.forEach(({ name, order }, index) => {
      const key = parsedFolders
        .slice(0, index + 1)
        .map((folder) => folder.name)
        .join('/');

      if (!categoryByKey.has(key)) {
        categoryByKey.set(key, { key, name, order, configByLocale: {} });
      }
    });

    if (fileName === CATEGORY_CONFIG__FILE_NAME) {
      const category = categoryByKey.get(categoryKey);

      if (category) {
        category.configByLocale[locale] = unwrapModule<DocsCategoryConfig>(
          context(contextKey),
        );
      }

      return;
    }

    if (!fileName.endsWith('.md')) return;

    const files = filesByLocale.get(locale) ?? new Map<string, ContentFile>();
    const key = contentPathToPageKey([...segments, fileName].join('/'));

    files.set(key, {
      key,
      locale,
      filePath,
      categoryKey,
      order: parsePathSegment(fileName.replace(/\.md$/i, '')).order,
      module: unwrapModule<DocsMarkdownModule>(context(contextKey)),
    });
    filesByLocale.set(locale, files);
  });

  return { filesByLocale, categoryByKey };
}

/**
 * A section of the docs: its pages are the markdown files of the `content` context, its first
 * folder level is the locale. Folders become sidebar categories, a `01-` prefix orders a file or a
 * folder (and is not part of the URL), `_category.json` names a folder per locale.
 *
 * @example
 * const UI_CORE_DOCS = defineDocsSection({
 *   id: 'ui-core',
 *   label: 'UI Core',
 *   content: import.meta.webpackContext('./content', { recursive: true, regExp: /\.(md|json)$/ }),
 * });
 */
function defineDocsSection(options: DocsSectionOptions): DocsSectionDefinition {
  return { options, ...readContent(options.content) };
}

type Sortable = { label: string; order: number | undefined; isIndex: boolean };

// Index page first, then by order (unordered last), then alphabetically
function compareNavItems(a: Sortable, b: Sortable): number {
  if (a.isIndex !== b.isIndex) return a.isIndex ? -1 : 1;
  if (a.order !== b.order) {
    if (a.order === undefined) return 1;
    if (b.order === undefined) return -1;

    return a.order - b.order;
  }

  return a.label.localeCompare(b.label);
}

function buildLocaleIndex(
  definition: DocsSectionDefinition,
  site: DocsSite,
  locale: string,
): DocsSectionLocaleIndex {
  const { options, filesByLocale, categoryByKey } = definition;
  const ui = resolveUiStrings(locale, site.ui);
  const defaultFiles = filesByLocale.get(site.defaultLocale) ?? new Map();
  const localeFiles = filesByLocale.get(locale) ?? new Map();

  // NOTE: the default locale defines the pages; a translation replaces a page, a missing one
  // falls back to the default locale's file (flagged, so the page can say so)
  const keys = Array.from(
    new Set([...defaultFiles.keys(), ...localeFiles.keys()]),
  );

  // NOTE: the folder of each page's file, for the tree (not part of the public page object)
  const categoryKeyByPageKey = new Map<string, string>();

  const allPages = keys.map((key): DocsPage => {
    const file: ContentFile = localeFiles.get(key) ?? defaultFiles.get(key);
    const { meta } = file.module;
    const sidebar = meta.frontmatter.sidebar ?? {};
    const isCategoryIndex = key !== '' && key === file.categoryKey;

    categoryKeyByPageKey.set(key, file.categoryKey);

    return {
      sectionId: options.id,
      key,
      locale,
      contentLocale: file.locale,
      isFallback: file.locale !== locale,
      filePath: file.filePath,
      order: sidebar.order ?? file.order,
      label: sidebar.label ?? (isCategoryIndex ? ui.overview : meta.title),
      isHidden: Boolean(sidebar.hidden),
      meta,
      loadContent: file.module.loadContent,
    };
  });

  const resolveCategoryConfig = (key: string): DocsCategoryConfig => {
    const configByLocale = categoryByKey.get(key)?.configByLocale ?? {};

    return { ...configByLocale[site.defaultLocale], ...configByLocale[locale] };
  };

  const root: DocsNavCategory = {
    type: 'category',
    key: '',
    label: '',
    isCollapsed: false,
    items: [],
  };
  const navCategoryByKey = new Map<string, DocsNavCategory>([['', root]]);
  const sortableByItem = new Map<DocsNavItem, Sortable>();

  const ensureNavCategory = (key: string): DocsNavCategory => {
    const existing = navCategoryByKey.get(key);

    if (existing) return existing;

    const parentKey = key.includes('/')
      ? key.slice(0, key.lastIndexOf('/'))
      : '';
    const config = resolveCategoryConfig(key);
    const category = categoryByKey.get(key);
    const navCategory: DocsNavCategory = {
      type: 'category',
      key,
      label: config.label ?? humanizeSegment(category?.name ?? key),
      isCollapsed: config.collapsed ?? true,
      items: [],
    };

    ensureNavCategory(parentKey).items.push(navCategory);
    navCategoryByKey.set(key, navCategory);
    sortableByItem.set(navCategory, {
      label: navCategory.label,
      order: config.order ?? category?.order,
      isIndex: false,
    });

    return navCategory;
  };

  allPages
    .filter((page) => !page.isHidden)
    .forEach((page) => {
      const item: DocsNavItem = {
        type: 'page',
        key: page.key,
        label: page.label,
        page,
      };

      const categoryKey = categoryKeyByPageKey.get(page.key) ?? '';

      ensureNavCategory(categoryKey).items.push(item);
      sortableByItem.set(item, {
        label: page.label,
        order: page.order,
        isIndex: page.key === categoryKey,
      });
    });

  const listedPages: DocsPage[] = [];
  const sortAndCollect = (items: DocsNavItem[]) => {
    items.sort((a, b) =>
      compareNavItems(sortableByItem.get(a)!, sortableByItem.get(b)!),
    );
    items.forEach((item) => {
      if (item.type === 'page') listedPages.push(item.page);
      else sortAndCollect(item.items);
    });
  };

  sortAndCollect(root.items);

  const pages = [...listedPages, ...allPages.filter((page) => page.isHidden)];
  const pageByKey = new Map(pages.map((page) => [page.key, page]));

  return { nav: root.items, pages, pageByKey };
}

function bindSection(
  definition: DocsSectionDefinition,
  site: DocsSite,
): DocsSection {
  const { id, path = id, label, editUrl } = definition.options;
  const indexByLocale = new Map<string, DocsSectionLocaleIndex>();

  return {
    id,
    path,
    label,
    editUrl,
    getLocaleIndex(locale) {
      let index = indexByLocale.get(locale);

      if (!index) {
        index = buildLocaleIndex(definition, site, locale);
        indexByLocale.set(locale, index);
      }

      return index;
    },
  };
}

/**
 * The whole docs site: its locales and sections. Pass it to `createLocalizedRoutes` and
 * `createDocsRoutes`.
 */
function defineDocsSite(
  options: DocsSiteOptions & { sections: DocsSectionDefinition[] },
): DocsSite {
  if (!(options.defaultLocale in options.locales)) {
    throw new Error(
      `[docs-kit] defaultLocale "${options.defaultLocale}" is not one of the locales: ${Object.keys(options.locales).join(', ')}`,
    );
  }

  const site: DocsSite = {
    ...options,
    locales: Object.fromEntries(
      Object.entries(options.locales).map(([key, config]) => [
        key,
        { lang: key, dir: 'ltr', ...config },
      ]),
    ),
    sections: [],
  };

  site.sections = options.sections.map((definition) =>
    bindSection(definition, site),
  );

  const paths = site.sections.map((section) => section.path);
  const duplicatePath = paths.find(
    (path, index) => paths.indexOf(path) !== index,
  );

  if (duplicatePath) {
    throw new Error(`[docs-kit] two sections use the path "${duplicatePath}"`);
  }

  const clashingPath = paths.find((path) => path in site.locales);

  if (clashingPath) {
    throw new Error(
      `[docs-kit] the section path "${clashingPath}" is also a locale, so its URLs would be ambiguous`,
    );
  }

  return site;
}

export { defineDocsSection, defineDocsSite };
export type { DocsSectionDefinition };
