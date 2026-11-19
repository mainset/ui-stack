import type { DocsSection, DocsSite } from './docs.types.mjs';

// URLs: the default locale has no prefix (`/ui-core/layout/box`), every other one has its key
// (`/uk/ui-core/layout/box`). So a static host serves the default language at `/` without a
// redirect. Paths here are router paths: without the basename (`output.publicPath`).

function localePrefix(site: DocsSite, locale: string): string {
  return locale === site.defaultLocale ? '' : `/${locale}`;
}

/** `/`, `/uk` */
function localeHomePath(site: DocsSite, locale: string): string {
  return localePrefix(site, locale) || '/';
}

/** `/ui-core`, `/uk/ui-core/layout/box` */
function sectionPagePath(
  site: DocsSite,
  section: DocsSection,
  locale: string,
  pageKey = '',
): string {
  return `${localePrefix(site, locale)}/${section.path}${pageKey ? `/${pageKey}` : ''}`;
}

/** The locale a path is in, and the path without its locale prefix */
function splitLocalePath(
  site: DocsSite,
  pathname: string,
): { locale: string; restPath: string } {
  const [, firstSegment = ''] = pathname.split('/');

  if (firstSegment !== site.defaultLocale && firstSegment in site.locales) {
    return {
      locale: firstSegment,
      restPath: pathname.slice(firstSegment.length + 1) || '/',
    };
  }

  return { locale: site.defaultLocale, restPath: pathname || '/' };
}

/** The same page in another locale: `/ui-core/x` → `/uk/ui-core/x` */
function switchLocalePath(
  site: DocsSite,
  pathname: string,
  nextLocale: string,
): string {
  const { restPath } = splitLocalePath(site, pathname);
  const prefix = localePrefix(site, nextLocale);

  return restPath === '/' ? prefix || '/' : `${prefix}${restPath}`;
}

function resolveLocalized<T>(
  value: T | Record<string, T>,
  locale: string,
  defaultLocale: string,
): T {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const byLocale = value as Record<string, T>;

    return byLocale[locale] ?? byLocale[defaultLocale];
  }

  return value as T;
}

export {
  localeHomePath,
  localePrefix,
  resolveLocalized,
  sectionPagePath,
  splitLocalePath,
  switchLocalePath,
};
