import { docsWebpackConfig } from '@mainset/docs-kit/node';

// The whole docs app: the kit brings the engine (entries, server render, HTML template), this
// project its config (`src/docs.config.tsx`), routes, pages and translations. A sub-path (a
// GitHub Pages project site) is `PUBLIC_PATH=/repo/`, the router and `ms-docs export` follow it.
export default docsWebpackConfig();
