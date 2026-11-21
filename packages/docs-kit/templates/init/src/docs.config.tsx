import { defineDocsApp } from '@mainset/docs-kit';

// The site: its languages and sections. A section is a folder of markdown pages,
// `src/pages/<section>/content/<locale>/**/*.md`: a folder is a sidebar category (named after
// it; `content/_categories.json` sets its order and collapsed state, a locale's own its label), a
// `01-` prefix orders a file or folder and is left out of the URL. A page missing in a locale
// shows the default locale's version, with a notice.
export default defineDocsApp({
  title: 'Docs',
  defaultLocale: 'en',
  locales: {
    en: { label: 'English' },
  },
  sections: {
    docs: { label: 'Docs' },
  },
  // logo: <Logo />,
  // repositoryUrl: 'https://github.com/org/repo',
  // editUrl: 'https://github.com/org/repo/edit/main/src/pages/',
});
