import ReactDOMClient from 'react-dom/client';

import BrowserReactApp from './app.browser.js';
import { APP_ROOT__ID } from './app.constants.js';

const targetContainer = document.getElementById(APP_ROOT__ID);

if (targetContainer) {
  ReactDOMClient.createRoot(targetContainer).render(BrowserReactApp);
}
