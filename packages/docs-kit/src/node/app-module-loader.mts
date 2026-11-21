import fs from 'node:fs';
import path from 'node:path';

// Writes the modules that list a project's folders: webpack reads them at build time
// (`import.meta.webpackContext`), watching them for added and removed files. The kit ships a
// placeholder for each (`app/generated/*.mjs`), this loader replaces its source.

type DocsAppModule = 'content' | 'translations' | 'public-path';

interface DocsAppModuleLoaderOptions {
  module: DocsAppModule;
  /** The project's folder (`process.cwd()` of ms-cli) */
  root: string;
}

interface LoaderContext {
  getOptions(): DocsAppModuleLoaderOptions;
  addMissingDependency(file: string): void;
}

const APP_FOLDER_MODULE__BY_NAME: Record<
  Exclude<DocsAppModule, 'public-path'>,
  { dir: string[]; regExp: string }
> = {
  // `src/pages/<section>/content/<locale>/**`: the pages and the categories' `_category.json`
  content: {
    dir: ['src', 'pages'],
    regExp: String.raw`/^\.\/[^/]+\/content\/.+\.(md|json)$/`,
  },
  // `src/i18n/locales/<locale>/translation.json`
  translations: {
    dir: ['src', 'i18n', 'locales'],
    regExp: String.raw`/^\.\/[^/]+\/translation\.json$/`,
  },
};

function docsAppModuleLoader(this: LoaderContext): string {
  const { module, root } = this.getOptions();

  // NOTE: webpack's `output.publicPath` at runtime: the router's basename follows it
  if (module === 'public-path')
    return 'export default __webpack_public_path__;\n';

  const { dir, regExp } = APP_FOLDER_MODULE__BY_NAME[module];
  const dirPath = path.join(root, ...dir);

  if (!fs.existsSync(dirPath)) {
    // NOTE: rebuilt once the folder is created
    this.addMissingDependency(dirPath);

    return 'export default null;\n';
  }

  return `export default import.meta.webpackContext(${JSON.stringify(dirPath)}, { recursive: true, regExp: ${regExp} });\n`;
}

export default docsAppModuleLoader;
export type { DocsAppModule, DocsAppModuleLoaderOptions };
