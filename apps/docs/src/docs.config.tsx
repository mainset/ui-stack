import { defineDocsApp } from '@mainset/docs-kit';
import React from 'react';

import { MainSetLogo } from './components';

// The site: its languages and sections. A section is a folder of markdown pages,
// `src/pages/<section>/content/<locale>/**/*.md`: a folder is a sidebar category (named after
// it; `content/_categories.json` sets its order and collapsed state, a locale's own its label), a
// `01-` prefix orders a file or folder and is left out of the URL. A page missing in a locale
// shows the default locale's version, with a notice.
export default defineDocsApp({
  title: 'mainset UI',
  defaultLocale: 'en',
  locales: {
    en: { label: 'English' },
    uk: { label: 'Українська' },
  },
  sections: {
    'ui-core': { label: 'UI Core' },
  },
  logo: <MainSetLogo />,
  repositoryUrl: 'https://github.com/mainset/ui-stack',
  editUrl: 'https://github.com/mainset/ui-stack/edit/main/apps/docs/src/pages/',
});
