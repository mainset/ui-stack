// The router's basename follows webpack's `output.publicPath`: `/` locally, `/ui-stack` when
// the site is served from a sub-path (a GitHub Pages project site). Same value on the server
// and in the browser, both bundles are built with it.
const ROUTER_BASENAME = __webpack_public_path__.replace(/\/+$/, '') || '/';

export { ROUTER_BASENAME };
