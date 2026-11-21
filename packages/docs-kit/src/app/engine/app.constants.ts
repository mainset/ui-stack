import publicPath from '@docs-app/public-path';

// The router's basename follows webpack's `output.publicPath`: `/` locally, `/repo` when the
// site is served from a sub-path (a GitHub Pages project site). Same value on the server and in
// the browser, both bundles are built with it.
const ROUTER_BASENAME = publicPath.replace(/\/+$/, '') || '/';

/** The `id` of the element the app renders into (see `index.template.html`) */
const APP_ROOT__ID = 'msd-root';

export { APP_ROOT__ID, ROUTER_BASENAME };
