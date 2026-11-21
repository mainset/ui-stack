import ReactDOMClient from 'react-dom/client';

import { preloadDocsRoute } from '../../index.mjs';
import BrowserReactApp from './app.browser.js';
import { APP_ROOT__ID, ROUTER_BASENAME } from './app.constants.js';
import { ROUTES } from './app.routes.js';

const targetContainer = document.getElementById(APP_ROOT__ID);

if (targetContainer) {
  // NOTE: the server rendered the page's HTML (its own chunk), the first client render needs it
  // too, or hydration would find an empty page
  preloadDocsRoute(ROUTES, window.location.pathname, ROUTER_BASENAME).then(
    () => {
      ReactDOMClient.hydrateRoot(targetContainer, BrowserReactApp);
    },
  );
}
