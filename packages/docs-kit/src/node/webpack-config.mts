import { fileURLToPath } from 'node:url';

import type { DocsMarkdownLoaderOptions } from './webpack-loader.mjs';

const MARKDOWN_LOADER__PATH = fileURLToPath(
  new URL('./webpack-loader.mjs', import.meta.url),
);

const CATEGORIES_LOADER__PATH = fileURLToPath(
  new URL('./categories-loader.mjs', import.meta.url),
);

/**
 * The webpack config fragment that turns `*.md` pages into modules (and checks the locales'
 * `_categories.json`). Merge it into the app's
 * config, e.g. `generateEnvBasedWebpackConfig(docsWebpackConfigFragment())` (it applies to the
 * server and the browser bundle alike).
 */
function docsWebpackConfigFragment(options: DocsMarkdownLoaderOptions = {}) {
  return {
    module: {
      rules: [
        {
          test: /\.md$/i,
          type: 'javascript/auto',
          use: [{ loader: MARKDOWN_LOADER__PATH, options }],
        },
        {
          test: /[\\/]_categories\.json$/,
          use: [
            {
              loader: CATEGORIES_LOADER__PATH,
              options: { contentDirName: options.contentDirName },
            },
          ],
        },
      ],
    },
  };
}

export { MARKDOWN_LOADER__PATH, docsWebpackConfigFragment };
