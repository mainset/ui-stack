import fs from 'node:fs';
import path from 'node:path';

import { parsePathSegment } from '../core/content-path.mjs';

// webpack loader for the `_categories.json` files of a section: `content/_categories.json` (the
// folders' URL path, order and collapsed state) and `content/<locale>/_categories.json` (their labels).
// Checks them against the section's folders, so a typo or a renamed folder is a build warning,
// not a setting silently lost. The JSON itself is left to webpack.

interface CategoriesLoaderOptions {
  /** The section's folder of locales @default 'content' */
  contentDirName?: string;
}

interface CategoriesLoaderContext {
  resourcePath: string;
  getOptions: () => CategoriesLoaderOptions | undefined;
  emitWarning: (warning: Error) => void;
  addContextDependency: (dir: string) => void;
}

const CATEGORY_FIELD_TYPES: Record<string, string> = {
  path: 'string',
  order: 'number',
  collapsed: 'boolean',
};

const KEY__HINT = 'keys are folder paths without the "01-" prefixes';

// NOTE: one URL segment, left as written in the URL (no encoding needed)
const PATH_SEGMENT__REGEX = /^[\w.~-]+$/;

const parentKey = (key: string) =>
  key.includes('/') ? key.slice(0, key.lastIndexOf('/')) : '';

/** Folders under one parent that end up at one URL: `{ "a": { "path": "b" } }` beside `b/` */
function findPathCollisions(
  keys: Set<string>,
  categories: Record<string, unknown>,
): string[] {
  const keyByUrl = new Map<string, string>();

  return Array.from(keys).flatMap((key) => {
    const config = categories[key];
    const path =
      isPlainObject(config) && typeof config.path === 'string'
        ? config.path
        : key.slice(key.lastIndexOf('/') + 1);
    const url = `${parentKey(key)}/${path}`;
    const other = keyByUrl.get(url);

    if (other === undefined) {
      keyByUrl.set(url, key);

      return [];
    }

    return [`"${key}" and "${other}" have the same URL segment "${path}"`];
  });
}

/** The category keys of the folders under {dir}: `elements`, `elements/layout`… */
function listCategoryKeys(dir: string, parentKey = ''): string[] {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => {
      const { name } = parsePathSegment(entry.name);
      const key = parentKey ? `${parentKey}/${name}` : name;

      return [key, ...listCategoryKeys(path.join(dir, entry.name), key)];
    });
}

/**
 * The section's categories: the folders of any of its locales (the default locale's define
 * them, a translation may have none, its pages falling back to the default's)
 */
function listSectionCategoryKeys(contentDir: string): Set<string> {
  return new Set(
    fs
      .readdirSync(contentDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .flatMap((entry) => listCategoryKeys(path.join(contentDir, entry.name))),
  );
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

/**
 * What's wrong with a `_categories.json`: {isLocale} for a locale's (labels), else the
 * section's (structure), in the section's folder {contentDir}
 */
function checkCategoriesConfig(
  categories: unknown,
  { contentDir, isLocale }: { contentDir: string; isLocale: boolean },
): string[] {
  if (!isPlainObject(categories)) {
    return [
      isLocale
        ? 'an object of labels is expected: { "<folder>": "<label>" }'
        : 'an object is expected: { "<folder>": { order, collapsed } }',
    ];
  }

  const keys = listSectionCategoryKeys(contentDir);

  const problems = Object.entries(categories).flatMap(
    ([key, value]): string[] => {
      if (!keys.has(key)) {
        return [`"${key}" is no folder of the section (${KEY__HINT})`];
      }

      if (isLocale) {
        return typeof value === 'string'
          ? []
          : [
              `"${key}": a label is expected (order and collapsed are in content/_categories.json)`,
            ];
      }

      if (!isPlainObject(value)) {
        return [
          `"${key}": { order, collapsed } is expected (labels are in content/<locale>/_categories.json)`,
        ];
      }

      return Object.entries(value).flatMap(([field, fieldValue]) => {
        const expectedType = CATEGORY_FIELD_TYPES[field];

        if (field === 'label') {
          return [
            `"${key}".label: labels are in content/<locale>/_categories.json`,
          ];
        }

        if (!expectedType) return [`"${key}": unknown field "${field}"`];
        if (typeof fieldValue !== expectedType) {
          return [`"${key}".${field}: a ${expectedType} is expected`];
        }

        return field === 'path' &&
          !PATH_SEGMENT__REGEX.test(fieldValue as string)
          ? [
              `"${key}".path: one URL segment is expected (letters, digits, "-", "_", ".", "~"), not "${fieldValue}"`,
            ]
          : [];
      });
    },
  );

  return isLocale
    ? problems
    : [...problems, ...findPathCollisions(keys, categories)];
}

function docsCategoriesLoader(this: CategoriesLoaderContext, source: string) {
  const { contentDirName = 'content' } = this.getOptions() ?? {};
  const fileDir = path.dirname(this.resourcePath);
  const isLocale = path.basename(fileDir) !== contentDirName;
  const contentDir = isLocale ? path.dirname(fileDir) : fileDir;

  // NOTE: checked again when a folder is added, renamed or removed, in any locale
  this.addContextDependency(contentDir);

  let categories: unknown;

  try {
    categories = JSON.parse(source);
  } catch {
    // NOTE: webpack's JSON parser reports it, with the position
    return source;
  }

  checkCategoriesConfig(categories, { contentDir, isLocale }).forEach(
    (problem) =>
      this.emitWarning(
        new Error(`[docs-kit] ${this.resourcePath}: ${problem}`),
      ),
  );

  return source;
}

export default docsCategoriesLoader;
export { checkCategoriesConfig };
export type { CategoriesLoaderOptions };
