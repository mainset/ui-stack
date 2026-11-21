import { defineDocsSite } from '@mainset/docs-kit';

import { UI_CORE_DOCS } from './pages/ui-core';

// The docs site: its languages and sections. Each section is a folder of markdown pages,
// see `src/pages/ui-core/index.ts`.
const DOCS_SITE = defineDocsSite({
  title: 'mainset UI',
  defaultLocale: 'en',
  locales: {
    en: { label: 'English' },
    uk: { label: 'Українська' },
  },
  sections: [UI_CORE_DOCS],
  repositoryUrl: 'https://github.com/mainset/ui-stack',
});

export { DOCS_SITE };
