import config from '@docs-app/config';
import content from '@docs-app/content';
import Home from '@docs-app/home';
import NotFound from '@docs-app/not-found';
import Providers from '@docs-app/providers';
import routes from '@docs-app/routes';
import translations from '@docs-app/translations';
// NOTE: every ui-core element's classes, for the live `html preview` examples of the pages
// (the docs chrome itself only brings the CSS of the elements it renders)
import '@mainset/ui-core/styles/index.css';

import {
  createDocsAppI18n,
  createDocsAppRoutes,
  createDocsAppSite,
} from '../../index.mjs';

// The project's files, put together: the site (config, sections, translations) and its routes
// in every locale (`/…` for the default one, `/uk/…` for the others)
const DOCS_SITE = createDocsAppSite(config, { content, translations });

const ROUTES = createDocsAppRoutes(DOCS_SITE, {
  i18n: createDocsAppI18n(DOCS_SITE, translations),
  logo: config.logo,
  Home,
  NotFound,
  routes,
  Providers,
});

export { DOCS_SITE, ROUTES };
