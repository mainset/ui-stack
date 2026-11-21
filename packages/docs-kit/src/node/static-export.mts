import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Static export of an `ms-cli` SSR build (`ms-cli web-app --exec build`): every page the site
// links to, rendered once, written as plain HTML files a static host serves as they are
// (GitHub Pages, S3, any CDN). The pages hydrate like the SSR ones.
//
// It needs no list of routes: starting at the entries (`/`), it renders a page, follows the
// page's internal links, and so on, until every reachable page is written. A link that
// answers 404 fails the export, so a broken link never ships.

interface StaticExportOptions {
  /** The app's folder (holds `dist/`) @default process.cwd() */
  root?: string;
  /** Written here, the SSR build is left as it is @default '<root>/dist/static' */
  outDir?: string;
  /** Where crawling starts, router paths @default ['/'] */
  entries?: string[];
  /** Rendered into `404.html`, which static hosts serve for unknown URLs @default '/404' */
  notFoundPath?: string;
  /** `output.publicPath` of the build @default process.env.PUBLIC_PATH || '/' */
  basePath?: string;
  /** Report broken links without failing @default false */
  isBrokenLinkAllowed?: boolean;
}

interface StaticExportResult {
  pages: string[];
  redirects: string[];
  brokenLinks: { href: string; linkedFrom: string[] }[];
}

interface SSRRenderResult {
  html: string;
  status?: number;
}

type SSRRender = (params: {
  reqUrl: string;
  fullUrl: string;
  reqHeaders: Record<string, string>;
}) => Promise<SSRRenderResult>;

const EXPORT__ORIGIN = 'http://localhost';
const SSR_TEMPLATE__FILE_NAME = 'server.html';
const ASSET_EXTENSION__REGEX = /\.(?!html?$)[a-z\d]+$/i;

const normalizeBasePath = (basePath: string) =>
  `/${basePath.replace(/^\/+|\/+$/g, '')}/`.replace(/^\/\/$/, '/');

// `/ui-core/box/` → `/ui-core/box`; the root stays `/`
const normalizePathname = (pathname: string) =>
  pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;

function decodeHtmlAttribute(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'");
}

/**
 * The internal page URLs an HTML page links to: its `<a href>`s and its `<link href>`s (the
 * `hreflang` alternates lead to every translation). Hashes and queries dropped, assets skipped.
 */
function extractInternalLinks(html: string, basePath: string): string[] {
  const links = new Set<string>();

  for (const match of html.matchAll(/<(?:a|link)\b[^>]*?\shref="([^"]*)"/gi)) {
    const href = decodeHtmlAttribute(match[1]);

    if (!href.startsWith(basePath) || href.startsWith('//')) continue;

    const pathname = normalizePathname(href.split(/[?#]/)[0]);

    if (!ASSET_EXTENSION__REGEX.test(pathname)) links.add(pathname);
  }

  return Array.from(links);
}

function redirectHtml(location: string) {
  const escaped = location.replace(/"/g, '&quot;');

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Redirecting…</title>
    <meta http-equiv="refresh" content="0; url=${escaped}" />
    <link rel="canonical" href="${escaped}" />
  </head>
  <body><a href="${escaped}">${escaped}</a></body>
</html>
`;
}

function writeFile(filePath: string, content: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

async function loadRender(root: string): Promise<SSRRender> {
  const configPath = path.join(
    root,
    'dist',
    'private',
    'ssr-server.config.mjs',
  );

  if (!fs.existsSync(configPath)) {
    throw new Error(
      `[docs-kit] no SSR build at ${configPath}: run \`ms-cli web-app --exec build\` first`,
    );
  }

  const config = (await import(pathToFileURL(configPath).href)).default as {
    renderSSRContentByPath: Record<string, SSRRender>;
  };
  const [render] = Object.values(config.renderSSRContentByPath ?? {});

  if (!render) {
    throw new Error(`[docs-kit] ${configPath} has no renderSSRContentByPath`);
  }

  return render;
}

type RenderOutcome =
  | { type: 'page'; html: string }
  | { type: 'redirect'; location: string }
  | { type: 'broken'; status: number };

function classifyRender(rendered: SSRRenderResult | Response): RenderOutcome {
  if (rendered instanceof Response) {
    const location = rendered.headers.get('Location');

    return location && rendered.status >= 300 && rendered.status < 400
      ? { type: 'redirect', location }
      : { type: 'broken', status: rendered.status };
  }

  const status = rendered.status ?? 200;

  return status >= 400
    ? { type: 'broken', status }
    : { type: 'page', html: rendered.html };
}

function assertNoBrokenLinks({ brokenLinks }: StaticExportResult) {
  if (brokenLinks.length === 0) return;

  const report = brokenLinks
    .map(
      ({ href, linkedFrom }) =>
        `  ${href}\n    linked from: ${linkedFrom.join(', ')}`,
    )
    .join('\n');

  throw new Error(`[docs-kit] broken links:\n${report}`);
}

async function exportStaticSite({
  root = process.cwd(),
  outDir = path.join(root, 'dist', 'static'),
  entries = ['/'],
  notFoundPath = '/404',
  basePath: rawBasePath = process.env.PUBLIC_PATH || '/',
  isBrokenLinkAllowed = false,
}: StaticExportOptions = {}): Promise<StaticExportResult> {
  const basePath = normalizeBasePath(rawBasePath);
  const publicDir = path.join(root, 'dist', 'public');
  const render = await loadRender(root);

  // Step 1: the build's assets (scripts, styles, fonts, images), minus the SSR template
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.cpSync(publicDir, outDir, {
    recursive: true,
    filter: (source) =>
      path.relative(publicDir, source) !== SSR_TEMPLATE__FILE_NAME,
  });

  // NOTE: GitHub Pages runs Jekyll by default, which drops `_`-prefixed files
  writeFile(path.join(outDir, '.nojekyll'), '');

  const toFilePath = (href: string, fileName = 'index.html') =>
    path.join(outDir, href.slice(basePath.length), fileName);

  const renderHref = async (href: string) => {
    try {
      return await render({
        reqUrl: href,
        fullUrl: `${EXPORT__ORIGIN}${href}`,
        reqHeaders: { host: new URL(EXPORT__ORIGIN).host },
      });
    } catch (error) {
      // NOTE: a router's redirect (or a thrown error status) arrives as a fetch Response
      if (error instanceof Response) return error;
      throw error;
    }
  };

  // Step 2: crawl from the entries, breadth first
  const toHref = (routerPath: string) =>
    normalizePathname(`${basePath}${routerPath.replace(/^\/+/, '')}`);
  const queue = entries.map(toHref);
  const linkedFrom = new Map<string, Set<string>>(
    queue.map((href) => [href, new Set(['(entry)'])]),
  );
  const visited = new Set<string>();
  const result: StaticExportResult = {
    pages: [],
    redirects: [],
    brokenLinks: [],
  };

  const enqueue = (href: string, from: string) => {
    if (!linkedFrom.has(href)) linkedFrom.set(href, new Set());
    linkedFrom.get(href)!.add(from);
    if (!visited.has(href) && !queue.includes(href)) queue.push(href);
  };

  while (queue.length > 0) {
    const href = queue.shift()!;

    if (visited.has(href)) continue;
    visited.add(href);

    // NOTE: one page at a time, so the crawl order (and the report) is the same on every run
    // eslint-disable-next-line no-await-in-loop
    const outcome = classifyRender(await renderHref(href));

    if (outcome.type === 'page') {
      writeFile(toFilePath(href), outcome.html);
      result.pages.push(href);
      extractInternalLinks(outcome.html, basePath).forEach((link) =>
        enqueue(link, href),
      );
    } else if (outcome.type === 'redirect') {
      writeFile(toFilePath(href), redirectHtml(outcome.location));
      result.redirects.push(`${href} → ${outcome.location}`);
      if (outcome.location.startsWith(basePath)) {
        enqueue(normalizePathname(outcome.location), href);
      }
    } else {
      result.brokenLinks.push({
        href: `${href} (${outcome.status})`,
        linkedFrom: Array.from(linkedFrom.get(href) ?? []),
      });
    }
  }

  // Step 3: the not-found page, served by static hosts for any unknown URL
  const notFound = await renderHref(toHref(notFoundPath));

  if (!(notFound instanceof Response)) {
    writeFile(path.join(outDir, '404.html'), notFound.html);
  }

  if (!isBrokenLinkAllowed) assertNoBrokenLinks(result);

  return result;
}

export { exportStaticSite, extractInternalLinks };
export type { StaticExportOptions, StaticExportResult };
