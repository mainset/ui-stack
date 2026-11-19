import type { DocsDocumentHead } from '@mainset/docs-kit';
import { DocsHeadContext } from '@mainset/docs-kit';
import { MainSetProvider } from '@mainset/react/containers';
import React from 'react';
import {
  StaticRouterProvider,
  createStaticHandler,
  createStaticRouter,
} from 'react-router';

import { ROUTER_BASENAME } from './router.constants';
import { ROUTES } from './routes';

type ProvideServerReactAppParams = {
  fullUrl: string;
};

const provideServerReactApp = async ({
  fullUrl,
}: ProvideServerReactAppParams) => {
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
  // NOTE: filled while the element renders (title, description, lang, dir)
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
};

export default provideServerReactApp;
