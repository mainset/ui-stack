import {
  generateEnvBasedWebpackConfig,
  mergeWebpackConfig,
} from '@mainset/bundler-webpack';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { DocsAppModule } from './app-module-loader.mjs';
import { APP_DIST__PATH, ENGINE_SOURCE__PATH } from './engine-paths.mjs';
import { docsWebpackConfigFragment } from './webpack-config.mjs';
import type { DocsMarkdownLoaderOptions } from './webpack-loader.mjs';

// The whole docs app, as one `ms-cli` webpack config: the project's `config/webpack.config.mjs`
// is `export default docsWebpackConfig()`. The engine (entries, server render, HTML template)
// is the kit's; the project brings its config, pages and translations, and the optional files
// below. A project file of the engine (after `ms-docs eject`) takes the place of the kit's.

type WebpackConfig = NonNullable<
  Parameters<typeof generateEnvBasedWebpackConfig>[0]
>;

interface DocsWebpackConfigOptions {
  /** Merged last, into the server and the browser bundle alike */
  webpack?: WebpackConfig;
  /** Options of the markdown loader */
  markdown?: DocsMarkdownLoaderOptions;
  /** The project's folder @default process.cwd() (where ms-cli runs) */
  root?: string;
}

const APP_MODULE_LOADER__PATH = fileURLToPath(
  new URL('./app-module-loader.mjs', import.meta.url),
);

const SCRIPT_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js'];

/** The project's `src/<name>.{tsx,ts,jsx,js}` that exists, if any */
function findProjectModule(root: string, name: string): string | undefined {
  return SCRIPT_EXTENSIONS.map((extension) =>
    path.join(root, 'src', `${name}${extension}`),
  ).find((filePath) => fs.existsSync(filePath));
}

/** {filePath} under {root}, if it exists: the project's own engine file */
function findProjectFile(root: string, filePath: string): string | undefined {
  const projectPath = path.join(root, filePath);

  return fs.existsSync(projectPath) ? projectPath : undefined;
}

/** `@docs-app/*`: the project's files, the kit's defaults where the project has none */
function resolveAppAliases(root: string): Record<string, string> {
  const config = findProjectModule(root, 'docs.config');

  if (!config) {
    throw new Error(
      `[docs-kit] no src/docs.config.tsx in ${root}: export default defineDocsApp({ … }) from it`,
    );
  }

  const optional = (name: string, defaultModule: string) =>
    findProjectModule(root, name) ??
    path.join(APP_DIST__PATH, 'defaults', defaultModule);

  return {
    '@docs-app/config$': config,
    '@docs-app/home$': optional('home', 'home.mjs'),
    '@docs-app/not-found$': optional('not-found', 'not-found.mjs'),
    '@docs-app/routes$': optional('routes', 'routes.mjs'),
    '@docs-app/providers$': optional('providers', 'providers.mjs'),
    '@docs-app/content$': path.join(APP_DIST__PATH, 'generated', 'content.mjs'),
    '@docs-app/translations$': path.join(
      APP_DIST__PATH,
      'generated',
      'translations.mjs',
    ),
    '@docs-app/public-path$': path.join(
      APP_DIST__PATH,
      'generated',
      'public-path.mjs',
    ),
  };
}

const appModuleRule = (module: DocsAppModule, root: string) => ({
  test: path.join(APP_DIST__PATH, 'generated', `${module}.mjs`),
  use: [{ loader: APP_MODULE_LOADER__PATH, options: { module, root } }],
});

/** The CSS reset first (it has no specificity, so it must come before any element's CSS) */
function resolveGlobalStyles(root: string): string[] {
  const reset = createRequire(import.meta.url).resolve(
    '@mainset/ui-core/styles/reset.css',
  );
  const projectStyles = ['global.css', 'global.scss']
    .map((fileName) => path.join(root, 'src', 'styles', fileName))
    .filter((filePath) => fs.existsSync(filePath));

  return [reset, ...projectStyles];
}

/**
 * The webpack config of a docs app, for `ms-cli web-app` (`config/webpack.config.mjs`):
 * `export default docsWebpackConfig()`.
 */
function docsWebpackConfig({
  webpack = {},
  markdown,
  root = process.cwd(),
}: DocsWebpackConfigOptions = {}): ReturnType<
  typeof generateEnvBasedWebpackConfig
> {
  const engineFile = (fileName: string) =>
    path.join(APP_DIST__PATH, 'engine', fileName);

  return generateEnvBasedWebpackConfig(
    // NOTE: arrays (rules) are concatenated, objects merged
    mergeWebpackConfig<WebpackConfig>(
      docsWebpackConfigFragment(markdown),
      {
        // NOTE: a sub-path (a GitHub Pages project site) is `PUBLIC_PATH=/repo/`; the router's
        // basename follows it
        output: { publicPath: process.env.PUBLIC_PATH || '/' },
        resolve: { alias: resolveAppAliases(root) },
        module: {
          rules: [
            appModuleRule('content', root),
            appModuleRule('translations', root),
            appModuleRule('public-path', root),
          ],
        },
      },
      webpack,
    ),
    {
      paths: {
        ssrEntry:
          findProjectFile(root, 'src/index.ssr.ts') ??
          engineFile('index.ssr.mjs'),
        csrEntry:
          findProjectFile(root, 'src/index.csr.ts') ??
          engineFile('index.csr.mjs'),
        htmlTemplate:
          findProjectFile(root, 'src/index.template.html') ??
          path.join(ENGINE_SOURCE__PATH, 'index.template.html'),
        ssrServerConfig:
          findProjectFile(root, 'config/ssr-server.config.mts') ??
          engineFile('ssr-server.config.mjs'),
        globalStyles: resolveGlobalStyles(root),
      },
    },
  );
}

export { docsWebpackConfig };
export type { DocsWebpackConfigOptions };
