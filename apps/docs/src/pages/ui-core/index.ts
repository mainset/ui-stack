import { defineDocsSection } from '@mainset/docs-kit';

// `content/<locale>/**/*.md` are the pages: a folder is a sidebar category (named by its
// `_category.json`), a `01-` prefix orders a file or folder and is left out of the URL. A page
// missing in a locale shows the default locale's version, with a notice.
const UI_CORE_DOCS = defineDocsSection({
  id: 'ui-core',
  label: 'UI Core',
  content: import.meta.webpackContext('./content', {
    recursive: true,
    regExp: /\.(md|json)$/,
  }),
  editUrl:
    'https://github.com/mainset/ui-stack/edit/main/apps/docs/src/pages/ui-core/content/',
});

export { UI_CORE_DOCS };
