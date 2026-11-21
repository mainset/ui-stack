export {
  createDocsAppI18n,
  createDocsAppRoutes,
  createDocsAppSite,
  defineDocsApp,
  readTranslations,
  splitSectionContents,
} from './docs-app.js';
export type {
  DocsAppConfig,
  DocsAppProviders,
  DocsAppRoutes,
  DocsAppRoutesOptions,
  DocsAppSectionConfig,
  DocsAppSources,
  DocsAppTranslation,
} from './docs-app.js';
export { DocsNotFoundPage } from './DocsNotFoundPage.js';
// NOTE: the kit's own copy, so a project's pages read the same i18n instances as the kit (a
// copy of the project's would have its own React context)
export { Trans, useTranslation } from 'react-i18next';
