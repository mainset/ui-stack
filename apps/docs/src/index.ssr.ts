import ReactDOMClient from 'react-dom/client';

import BrowserReactApp from './app.browser';

const targetContainer = document.getElementById('ui-stack--docs');

if (targetContainer) {
  ReactDOMClient.hydrateRoot(targetContainer, BrowserReactApp);
}
