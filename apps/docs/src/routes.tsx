import {
  createDocsRoutes,
  createLocalizedRoutes,
  createNotFoundRoute,
} from '@mainset/docs-kit';
// NOTE: every ui-core element's classes, for the live `html preview` examples of the docs
// (the docs chrome itself only brings the CSS of the elements it renders)
import '@mainset/ui-core/styles/index.css';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import type { RouteObject } from 'react-router';
import { Outlet } from 'react-router';

import { MainSetLogo } from './components';
import { DOCS_SITE } from './docs.config';
import { I18N_INSTANCE__BY_LOCALE } from './i18n/i18n.instances';
import { HomePage, NotFoundPage } from './pages';

// The app's routes, once per locale: `/` and `/ui-core/…` in English, `/uk` and
// `/uk/ui-core/…` in Ukrainian. Add any page next to the docs: paths are relative.
const ROUTES: RouteObject[] = createLocalizedRoutes(
  DOCS_SITE,
  (locale) => [
    {
      // NOTE: the app's own translations (react-i18next), in the route's language
      element: (
        <I18nextProvider i18n={I18N_INSTANCE__BY_LOCALE[locale]}>
          <Outlet />
        </I18nextProvider>
      ),
      children: [
        { index: true, element: <HomePage /> },
        ...createDocsRoutes(DOCS_SITE, locale),
        createNotFoundRoute(<NotFoundPage />),
      ],
    },
  ],
  { logo: <MainSetLogo /> },
);

export { ROUTES };
