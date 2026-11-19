// How a content file maps to a page. Shared by the runtime (routes, sidebar) and the markdown
// compiler (links between pages), so both always agree on a page's URL.

const ORDER_PREFIX__REGEX = /^(\d+)[-_.](.+)$/;
const MARKDOWN_EXTENSION__REGEX = /\.md$/i;

interface PathSegment {
  /** Without the order prefix */
  name: string;
  /** The `01-` prefix as a number */
  order: number | undefined;
}

/** `03-layout` → `{ name: 'layout', order: 3 }`; `layout` → `{ name: 'layout', order: undefined }` */
function parsePathSegment(segment: string): PathSegment {
  const match = ORDER_PREFIX__REGEX.exec(segment);

  return match
    ? { name: match[2], order: Number(match[1]) }
    : { name: segment, order: undefined };
}

/**
 * The page key of a markdown file, relative to its locale folder:
 * `03-layout/01-box.md` → `layout/box`, `03-layout/index.md` → `layout`, `index.md` → `''`
 */
function contentPathToPageKey(relativePath: string): string {
  const segments = relativePath
    .replace(MARKDOWN_EXTENSION__REGEX, '')
    .split('/')
    .filter(Boolean)
    .map((segment) => parsePathSegment(segment).name);

  if (segments[segments.length - 1] === 'index') segments.pop();

  return segments.join('/');
}

/** `layout`, `layout/box` → `Layout`, `Box` (a folder without a `_category.json` label) */
function humanizeSegment(name: string): string {
  const words = name.replace(/[-_]+/g, ' ').trim();

  return words.charAt(0).toUpperCase() + words.slice(1);
}

// NOTE: links between pages are compiled to `msd:<page key>#<hash>` (the compiler can't know
// where the section is mounted, nor the locale of the route), then resolved when rendered
const PAGE_LINK__PREFIX = 'msd:';

export {
  PAGE_LINK__PREFIX,
  contentPathToPageKey,
  humanizeSegment,
  parsePathSegment,
};
export type { PathSegment };
