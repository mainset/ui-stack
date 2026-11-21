import type { Element, ElementContent, Root as HastRoot } from 'hast';
import type { Code, Root as MdastRoot } from 'mdast';
import path from 'node:path';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

import {
  PAGE_LINK__PREFIX,
  contentPathToPageKey,
} from '../core/content-path.mjs';
import type {
  DocsHeading,
  DocsPageFrontmatter,
  DocsPageMeta,
} from '../core/docs.types.mjs';
import {
  FrontmatterError,
  checkFrontmatter,
  parseFrontmatter,
} from './frontmatter.mjs';
import { highlightCode } from './highlight-code.mjs';
import { createSlugger } from './slugger.mjs';
import { SKIP, nodeToText, visit } from './syntax-tree.mjs';

interface CompileMarkdownOptions {
  /** Absolute path of the markdown file */
  filePath: string;
  /**
   * Name of the folder that holds the locale folders, to tell the locale and resolve links
   * between pages @default 'content'
   */
  contentDirName?: string;
}

interface CompiledMarkdown {
  meta: DocsPageMeta;
  html: string;
  /** Links that can't be resolved, and the like: reported by the loader as build warnings */
  warnings: string[];
}

const FRONTMATTER__REGEX = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;
const DESCRIPTION__MAX_LENGTH = 200;

// GitHub's alert syntax (`> [!NOTE]`), rendered as ui-core alerts: it reads well on GitHub too
const CALLOUT__REGEX = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/;
const CALLOUT_TONE__BY_TYPE: Record<string, string> = {
  note: 'info',
  tip: 'success',
  important: 'primary',
  warning: 'warning',
  caution: 'error',
};
const CALLOUT_TITLE__BY_LOCALE: Record<string, Record<string, string>> = {
  en: {
    note: 'Note',
    tip: 'Tip',
    important: 'Important',
    warning: 'Warning',
    caution: 'Caution',
  },
  uk: {
    note: 'Примітка',
    tip: 'Порада',
    important: 'Важливо',
    warning: 'Увага',
    caution: 'Обережно',
  },
};

const TABLE_ALIGN__BY_GFM_ALIGN: Record<string, string> = {
  left: 'start',
  center: 'center',
  right: 'end',
};

/** Where the file sits: its locale and its path inside the locale folder */
function locateContentFile(filePath: string, contentDirName: string) {
  const segments = filePath.split(path.sep);
  const contentIndex = segments.lastIndexOf(contentDirName);

  if (contentIndex === -1 || contentIndex + 2 >= segments.length) return null;

  return {
    locale: segments[contentIndex + 1],
    localeRoot: segments.slice(0, contentIndex + 2).join(path.sep),
  };
}

function splitFrontmatter(
  source: string,
  filePath: string,
): { frontmatter: DocsPageFrontmatter; body: string; warnings: string[] } {
  const match = FRONTMATTER__REGEX.exec(source);

  if (!match) return { frontmatter: {}, body: source, warnings: [] };

  try {
    return {
      ...checkFrontmatter(parseFrontmatter(match[1])),
      body: source.slice(match[0].length),
    };
  } catch (error) {
    if (!(error instanceof Error)) throw error;

    // NOTE: the frontmatter starts on the file's 2nd line, after `---`
    const line = error instanceof FrontmatterError ? `:${error.line + 1}` : '';

    error.message = `${filePath}${line}: frontmatter: ${error.message}`;
    throw error;
  }
}

const isExternalUrl = (url: string) => /^[a-z][a-z\d+.-]*:/i.test(url);

/** `./tokens.md#colors` → `msd:theming/tokens#colors` (null: not a link to a page) */
function resolvePageLink(
  url: string,
  file: { filePath: string; localeRoot: string },
): string | null {
  if (!url || url.startsWith('#') || url.startsWith('/') || isExternalUrl(url))
    return null;

  const [linkPath, hash = ''] = url.split('#');

  if (!/\.md$/i.test(linkPath)) return null;

  const target = path.resolve(path.dirname(file.filePath), linkPath);
  const relativeTarget = path.relative(file.localeRoot, target);

  if (relativeTarget.startsWith('..') || path.isAbsolute(relativeTarget))
    return null;

  const pageKey = contentPathToPageKey(
    relativeTarget.split(path.sep).join('/'),
  );

  return `${PAGE_LINK__PREFIX}${pageKey}${hash ? `#${hash}` : ''}`;
}

const element = (
  tagName: string,
  properties: Element['properties'],
  children: ElementContent[] = [],
): Element => ({ type: 'element', tagName, properties, children });

const CODE_BLOCK__COPY_BUTTON =
  '<button type="button" class="msd-code__copy" data-msd-copy hidden></button>';

async function renderCodeBlock(node: Code): Promise<string> {
  const highlighted = await highlightCode(node.value, node.lang);
  const language = node.lang ? ` data-lang="${node.lang}"` : '';
  const codeBlock = `<div class="msd-code"${language}>${CODE_BLOCK__COPY_BUTTON}${highlighted}</div>`;

  // NOTE: ```html preview — the markup itself, rendered above its code (ui-core is plain CSS
  // classes, so a snippet of HTML is a live example of the element)
  if (node.lang === 'html' && /(^|\s)preview(\s|$)/.test(node.meta ?? '')) {
    return `<div class="msd-preview"><div class="msd-preview__canvas">${node.value}</div>${codeBlock}</div>`;
  }

  return codeBlock;
}

/** A GitHub-compatible `id`, an anchor link, and a TOC entry for `##` / `###` */
function addHeadingAnchor(
  node: Element,
  slug: (text: string) => string,
  headings: DocsHeading[],
) {
  const text = nodeToText(node).trim();
  const id =
    typeof node.properties.id === 'string' ? node.properties.id : slug(text);
  const depth = Number(node.tagName.slice(1));

  node.properties.id = id;
  if (depth === 2 || depth === 3) headings.push({ depth, id, text });

  node.children.push(
    element(
      'a',
      {
        className: ['msd-heading-anchor'],
        href: `#${id}`,
        ariaHidden: 'true',
        tabIndex: -1,
      },
      [{ type: 'text', value: '#' }],
    ),
  );
}

/** ui-core table classes, GFM column alignment as logical alignment, a scrolling wrapper */
function wrapTable(table: Element): Element {
  table.properties.className = ['ms-table', 'ms-table--size-sm'];
  visit(table, 'element', (cell) => {
    if (cell.tagName !== 'th' && cell.tagName !== 'td') return;

    const align = TABLE_ALIGN__BY_GFM_ALIGN[String(cell.properties.align)];

    cell.properties.className = [
      'ms-table__cell',
      ...(align ? [`ms-table__cell--align-${align}`] : []),
    ];
    delete cell.properties.align;
  });

  // NOTE: a wide table scrolls inside its wrapper, focusable so the keyboard can scroll it
  return element('div', { className: ['ms-table-wrapper'], tabIndex: 0 }, [
    table,
  ]);
}

/** `> [!NOTE] …` as a ui-core alert in the type's tone; `null` for a plain quote */
function toCallout(blockquote: Element, locale: string): Element | null {
  const firstParagraph = blockquote.children.find(
    (child): child is Element =>
      child.type === 'element' && child.tagName === 'p',
  );
  const firstText = firstParagraph?.children[0];

  if (firstText?.type !== 'text') return null;

  const calloutMatch = CALLOUT__REGEX.exec(firstText.value);

  if (!calloutMatch) return null;

  const type = calloutMatch[1].toLowerCase();
  const title = (CALLOUT_TITLE__BY_LOCALE[locale] ??
    CALLOUT_TITLE__BY_LOCALE.en)[type];

  firstText.value = firstText.value.slice(calloutMatch[0].length);

  return element(
    'div',
    {
      className: [
        'ms-alert',
        'ms-background',
        'ms-border',
        'ms-surface',
        'ms-surface--variant-soft',
        `ms-tone-${CALLOUT_TONE__BY_TYPE[type]}`,
        'msd-callout',
      ],
      role: 'note',
    },
    [
      element('div', { className: ['ms-alert__content'] }, [
        element('p', { className: ['ms-alert__title'] }, [
          { type: 'text', value: title },
        ]),
        element(
          'div',
          { className: ['ms-alert__description'] },
          blockquote.children,
        ),
      ]),
    ],
  );
}

/**
 * Markdown → the page's meta (title, description, headings) and HTML. Pure: no file system
 * access, the caller passes the source. GitHub-flavored (tables, task lists, alerts), headings
 * get GitHub-compatible ids, code is highlighted at build time, links to other `.md` pages of
 * the same locale become page links.
 */
async function compileMarkdown(
  source: string,
  { filePath, contentDirName = 'content' }: CompileMarkdownOptions,
): Promise<CompiledMarkdown> {
  const { frontmatter, body, warnings } = splitFrontmatter(source, filePath);
  const location = locateContentFile(filePath, contentDirName);
  const locale = location?.locale ?? 'en';

  const mdast = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .parse(body) as MdastRoot;

  // ========== title: the leading `# h1` (the layout renders the title itself) ==========
  let { title } = frontmatter;
  const [firstNode] = mdast.children;

  if (firstNode?.type === 'heading' && firstNode.depth === 1) {
    title ??= nodeToText(firstNode);
    mdast.children.shift();
  }

  title ??= path.basename(filePath, path.extname(filePath));

  // ========== description: frontmatter, else the first paragraph ==========
  let description = frontmatter.description ?? '';
  const firstParagraph = mdast.children.find(
    (node) => node.type === 'paragraph',
  );

  if (!description && firstParagraph) {
    const text = nodeToText(firstParagraph).replace(/\s+/g, ' ').trim();

    description =
      text.length > DESCRIPTION__MAX_LENGTH
        ? `${text.slice(0, DESCRIPTION__MAX_LENGTH - 1).trimEnd()}…`
        : text;
  }

  // ========== links between pages ==========
  visit(mdast, 'link', (node) => {
    if (!location) return;

    const pageLink = resolvePageLink(node.url, {
      filePath,
      localeRoot: location.localeRoot,
    });

    if (pageLink) {
      node.url = pageLink;
    } else if (/\.md(#|$)/i.test(node.url) && !isExternalUrl(node.url)) {
      warnings.push(
        `link to "${node.url}" points outside the "${locale}" pages, so it is left as it is`,
      );
    }
  });

  // ========== code blocks: highlighted at build time ==========
  const codeNodes: Code[] = [];

  visit(mdast, 'code', (node) => {
    codeNodes.push(node);
  });

  const renderedCodeBlocks = await Promise.all(codeNodes.map(renderCodeBlock));

  codeNodes.forEach((node, index) => {
    // NOTE: mutated in place into an `html` node, so its position in the tree stays
    Object.assign(node, { type: 'html', value: renderedCodeBlocks[index] });
  });

  // ========== HTML ==========
  // NOTE: HTML in the markdown (the highlighted code, the live previews) stays as it is written:
  // passed through, never parsed into the page, so a preview's headings or tables are not the
  // page's own (no TOC entry, no table wrapper)
  const hast = (await unified()
    .use(remarkRehype, { allowDangerousHtml: true })
    .run(mdast)) as HastRoot;

  const slug = createSlugger();
  const headings: DocsHeading[] = [];

  visit(hast, 'element', (node, index, parent) => {
    if (/^h[2-6]$/.test(node.tagName)) {
      addHeadingAnchor(node, slug, headings);

      return SKIP;
    }

    if (node.tagName === 'table' && parent && typeof index === 'number') {
      parent.children[index] = wrapTable(node);

      return SKIP;
    }

    const callout =
      node.tagName === 'blockquote' ? toCallout(node, locale) : null;

    if (callout && parent && typeof index === 'number') {
      parent.children[index] = callout;

      return SKIP;
    }

    if (node.tagName === 'a' && !node.properties.className) {
      node.properties.className = ['ms-link'];
    }

    if (node.tagName === 'img') {
      node.properties.loading ??= 'lazy';
    }

    return undefined;
  });

  const html = unified()
    .use(rehypeStringify, { allowDangerousHtml: true })
    .stringify(hast);

  return {
    meta: { title, description, headings, frontmatter },
    html,
    warnings,
  };
}

export { compileMarkdown };
export type { CompileMarkdownOptions, CompiledMarkdown };
