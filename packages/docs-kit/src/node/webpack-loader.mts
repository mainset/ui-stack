import path from 'node:path';

import type {
  CompileMarkdownOptions,
  CompiledMarkdown,
} from './compile-markdown.mjs';
import { compileMarkdown } from './compile-markdown.mjs';

// webpack loader for `*.md` pages. One file makes two modules:
// - `page.md`: the page's meta, eager (sidebar, search, <head>), and `loadContent()`,
// - `page.md?msd-content`: its HTML, in a chunk of its own, loaded when the page is opened.

const CONTENT__RESOURCE_QUERY = 'msd-content';

type DocsMarkdownLoaderOptions = Pick<
  CompileMarkdownOptions,
  'contentDirName'
> & {
  /**
   * `lazy`: a chunk per page (browser). `eager`: in the bundle that imports it (Node: a server
   * bundle has no use for chunks, and resolves them against `output.publicPath`, a URL, not a
   * folder). @default eager for a Node target, lazy otherwise
   */
  contentMode?: 'lazy' | 'eager';
};

// NOTE: the minimal slice of webpack's LoaderContext this loader uses (webpack isn't a
// dependency of this package, the app's bundler provides it)
interface MarkdownLoaderContext {
  resourcePath: string;
  resourceQuery: string;
  target?: string;
  _compiler?: { options?: { externalsPresets?: { node?: boolean } } };
  async: () => (error: Error | null, result?: string) => void;
  getOptions: () => DocsMarkdownLoaderOptions;
  emitWarning: (warning: Error) => void;
}

// NOTE: both modules of a file need the same compile, and the server and browser bundles are
// built in one process: compiled once per file content
const compiledByFile = new Map<
  string,
  { source: string; compiled: Promise<CompiledMarkdown> }
>();

function compileOnce(
  filePath: string,
  source: string,
  options: DocsMarkdownLoaderOptions,
) {
  const cached = compiledByFile.get(filePath);

  if (cached?.source === source) return cached.compiled;

  const compiled = compileMarkdown(source, { ...options, filePath });

  compiledByFile.set(filePath, { source, compiled });

  return compiled;
}

function docsMarkdownLoader(this: MarkdownLoaderContext, source: string) {
  const callback = this.async();
  const isContentModule = this.resourceQuery.includes(CONTENT__RESOURCE_QUERY);
  const { contentMode, ...compileOptions } = this.getOptions() ?? {};
  const isNodeTarget =
    String(this.target ?? '').includes('node') ||
    this._compiler?.options?.externalsPresets?.node === true;
  const isEager =
    (contentMode ?? (isNodeTarget ? 'eager' : 'lazy')) === 'eager';

  compileOnce(this.resourcePath, source, compileOptions).then(
    ({ meta, html, warnings }) => {
      if (isContentModule) {
        callback(null, `export const html = ${JSON.stringify(html)};\n`);

        return;
      }

      warnings.forEach((warning) =>
        this.emitWarning(new Error(`[docs-kit] ${warning}`)),
      );

      const contentRequest = JSON.stringify(
        `./${path.basename(this.resourcePath)}?${CONTENT__RESOURCE_QUERY}`,
      );

      callback(
        null,
        [
          `export const meta = ${JSON.stringify(meta)};`,
          // NOTE: no chunk name: webpack merges the chunks that share one, every page must
          // stay a chunk of its own
          `export function loadContent() { return import(${isEager ? '/* webpackMode: "eager" */ ' : ''}${contentRequest}); }`,
          '',
        ].join('\n'),
      );
    },
    (error: Error) => callback(error),
  );
}

export default docsMarkdownLoader;
export type { DocsMarkdownLoaderOptions };
