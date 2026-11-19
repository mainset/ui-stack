import {
  generateEnvBasedWebpackConfig,
  mergeWebpackConfig,
} from '@mainset/bundler-webpack';
import { docsWebpackConfigFragment } from '@mainset/docs-kit/node';

// NOTE: where the site is served from: `/` locally, `/ui-stack/` on GitHub Pages (a project
// site). The router's basename follows it at runtime (`src/router.constants.ts`), and the
// static export strips it from the file paths (`ms-docs export` reads the same variable).
const PUBLIC_PATH = process.env.PUBLIC_PATH || '/';

export default generateEnvBasedWebpackConfig(
  mergeWebpackConfig(
    // `*.md` pages: their meta eagerly, their HTML as a chunk per page
    docsWebpackConfigFragment(),
    { output: { publicPath: PUBLIC_PATH } },
  ),
);
