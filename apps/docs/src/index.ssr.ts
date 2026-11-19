import { preloadDocsRoute } from '@mainset/docs-kit';
import ReactDOMClient from 'react-dom/client';

import BrowserReactApp from './app.browser';
import { ROUTER_BASENAME } from './router.constants';
import { ROUTES } from './routes';

const targetContainer = document.getElementById('ui-stack--docs');

if (targetContainer) {
  // NOTE: the server rendered the page's HTML (its own chunk), the first client render needs it
  // too, or hydration would find an empty page
  preloadDocsRoute(ROUTES, window.location.pathname, ROUTER_BASENAME).then(
    () => {
      ReactDOMClient.hydrateRoot(targetContainer, BrowserReactApp);
    },
  );
}
