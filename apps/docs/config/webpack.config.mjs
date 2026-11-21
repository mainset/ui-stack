import { docsWebpackConfig } from '@mainset/docs-kit/node';

// The whole docs app: the kit brings the engine (entries, server render, routes), this project
// its config (`src/docs.config.tsx`), pages and translations. A sub-path (GitHub Pages project
// site) is `PUBLIC_PATH=/ui-stack/`, the router and `ms-docs export` follow it.
export default docsWebpackConfig();
