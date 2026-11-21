import { MainSetProvider } from '@mainset/react/containers';
import React from 'react';
import {
  StaticRouterProvider,
  createStaticHandler,
  createStaticRouter,
} from 'react-router';

import type { DocsDocumentHead } from '../../index.mjs';
import { DocsHeadContext } from '../../index.mjs';
import { ROUTER_BASENAME } from './app.constants.js';
import { ROUTES } from './app.routes.js';

/** The page at {fullUrl}: its element, its `<head>` (filled while it renders) and its status */
async function provideServerReactApp({ fullUrl }: { fullUrl: string }) {
  const { query, dataRoutes } = createStaticHandler(ROUTES, {
    basename: ROUTER_BASENAME,
  });

  // NOTE: runs the matched routes' loaders: a docs page loads its HTML chunk here
  const routerContext = await query(new Request(fullUrl));

  // A redirect: the SSR server (and the static export) answers it as it is
  if (routerContext instanceof Response) {
    throw routerContext;
  }

  const staticRouter = createStaticRouter(dataRoutes, routerContext);
  // NOTE: filled while the element renders (title, description, lang, dir, links)
  const head: DocsDocumentHead = {};

  return {
    element: (
      <DocsHeadContext.Provider value={head}>
        <MainSetProvider>
          <StaticRouterProvider router={staticRouter} context={routerContext} />
        </MainSetProvider>
      </DocsHeadContext.Provider>
    ),
    head,
    // NOTE: 404 from the not-found route's loader
    status: routerContext.statusCode,
  };
}

export default provideServerReactApp;
