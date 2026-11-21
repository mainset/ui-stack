import { MainSetProvider } from '@mainset/react/containers';
import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router';

import { ROUTER_BASENAME } from './app.constants.js';
import { ROUTES } from './app.routes.js';

// NOTE: picks up the server's router state (`window.__staticRouterHydrationData`), so the
// first render matches the server's HTML
const BrowserReactApp = (
  <MainSetProvider>
    <RouterProvider
      router={createBrowserRouter(ROUTES, { basename: ROUTER_BASENAME })}
    />
  </MainSetProvider>
);

export default BrowserReactApp;
