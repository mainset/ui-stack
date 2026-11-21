// The interface strings of the docs chrome. Built in for English and Ukrainian; a site adds a
// locale or rewords one through `defineDocsSite({ ui: { de: { … } } })`.
const UI_STRINGS__EN = {
  skipToContent: 'Skip to content',
  mainNavigation: 'Main',
  sectionNavigation: 'Sections',
  pageNavigation: 'Pages',
  openMenu: 'Menu',
  menuTitle: 'Navigation',
  onThisPage: 'On this page',
  overview: 'Overview',
  previousPage: 'Previous',
  nextPage: 'Next',
  editPage: 'Edit this page',
  breadcrumb: 'Breadcrumb',
  notTranslated:
    'This page is not translated yet, so it is shown in the original language.',
  language: 'Language',
  colorScheme: 'Color scheme',
  colorSchemeLight: 'Light',
  colorSchemeDark: 'Dark',
  colorSchemeSystem: 'System',
  repository: 'Source code',
  search: 'Search',
  searchPlaceholder: 'Search the docs',
  searchNoResults: 'Nothing found',
  searchHint: 'Type to search pages and headings',
  copyCode: 'Copy',
  copiedCode: 'Copied',
  previewLabel: 'Preview',
  loading: 'Loading',
  readTheDocs: 'Read the docs',
  viewSource: 'View on GitHub',
  notFoundTitle: 'Page not found',
  notFoundText: "The page you are looking for doesn't exist, or it has moved.",
  backHome: 'Back to the home page',
};

type DocsUiStrings = typeof UI_STRINGS__EN;

const UI_STRINGS__UK: DocsUiStrings = {
  skipToContent: 'Перейти до вмісту',
  mainNavigation: 'Головна',
  sectionNavigation: 'Розділи',
  pageNavigation: 'Сторінки',
  openMenu: 'Меню',
  menuTitle: 'Навігація',
  onThisPage: 'На цій сторінці',
  overview: 'Огляд',
  previousPage: 'Назад',
  nextPage: 'Далі',
  editPage: 'Редагувати сторінку',
  breadcrumb: 'Навігаційний ланцюжок',
  notTranslated:
    'Цю сторінку ще не перекладено, тому вона показана мовою оригіналу.',
  language: 'Мова',
  colorScheme: 'Колірна схема',
  colorSchemeLight: 'Світла',
  colorSchemeDark: 'Темна',
  colorSchemeSystem: 'Системна',
  repository: 'Вихідний код',
  search: 'Пошук',
  searchPlaceholder: 'Шукати в документації',
  searchNoResults: 'Нічого не знайдено',
  searchHint: 'Почніть вводити, щоб знайти сторінки й заголовки',
  copyCode: 'Копіювати',
  copiedCode: 'Скопійовано',
  previewLabel: 'Приклад',
  loading: 'Завантаження',
  readTheDocs: 'Читати документацію',
  viewSource: 'Відкрити на GitHub',
  notFoundTitle: 'Сторінку не знайдено',
  notFoundText: 'Сторінки, яку ви шукаєте, не існує, або її перенесено.',
  backHome: 'На головну',
};

const UI_STRINGS__BY_LOCALE: Record<string, DocsUiStrings> = {
  en: UI_STRINGS__EN,
  uk: UI_STRINGS__UK,
};

/** The built-in strings of the locale (English when there are none), then the site's overrides */
function resolveUiStrings(
  locale: string,
  overrides: Record<string, Partial<DocsUiStrings>> = {},
): DocsUiStrings {
  return {
    ...UI_STRINGS__EN,
    ...UI_STRINGS__BY_LOCALE[locale],
    ...overrides[locale],
  };
}

export { UI_STRINGS__BY_LOCALE, resolveUiStrings };
export type { DocsUiStrings };
