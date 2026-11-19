import React from 'react';
import type { RouteObject } from 'react-router';
import { matchRoutes, useMatches } from 'react-router';

import type { DocsPage, DocsSite } from '../core/docs.types.mjs';
import { loadPageContent } from '../core/page-content.mjs';
import { DocsPageView } from './DocsPageView.js';
import { DocsSectionLayout } from './DocsSectionLayout.js';
import { DocsLocaleRoute } from './docs-context.js';
import type { DocsChromeOptions } from './docs-context.js';

interface DocsRouteHandle {
  msdPage?: DocsPage;
}

/**
 * The app's routes once per locale: the default locale's at the root (`/`, `/ui-core/…`),
 * every other one's under its key (`/uk`, `/uk/ui-core/…`). {createChildren} gets the locale, so
 * each locale's routes know it without parsing URLs. Children paths are relative (no leading `/`).
 *
 * @example
 * createLocalizedRoutes(DOCS_SITE, (locale) => [
 *   { index: true, element: <HomePage /> },
 *   ...createDocsRoutes(DOCS_SITE, locale),
 *   createNotFoundRoute(<NotFoundPage />),
 * ]);
 */
function createLocalizedRoutes(
  site: DocsSite,
  createChildren: (locale: string) => RouteObject[],
  chrome: DocsChromeOptions = {},
): RouteObject[] {
  return Object.keys(site.locales).map((locale): RouteObject => {
    const route: RouteObject = {
      element: <DocsLocaleRoute site={site} locale={locale} chrome={chrome} />,
      children: createChildren(locale),
    };

    // NOTE: pathless for the default locale. A static segment (`uk`) outranks its splat, so
    // `/uk/…` never lands in the default locale's routes
    return locale === site.defaultLocale ? route : { ...route, path: locale };
  });
}

/**
 * One route per page of every section, in one locale. Each page's loader loads its HTML chunk,
 * so the page renders complete: on the server, and on the client before the navigation commits.
 */
function createDocsRoutes(site: DocsSite, locale: string): RouteObject[] {
  return site.sections.map((section): RouteObject => {
    const { pages, pageByKey } = section.getLocaleIndex(locale);
    // NOTE: without an `index.md`, the section's own URL shows its first page
    const indexPage = pageByKey.get('') ?? pages[0];

    const pageRoute = (page: DocsPage) => ({
      loader: () => loadPageContent(page).then(() => null),
      element: <DocsPageView />,
      handle: { msdPage: page } satisfies DocsRouteHandle,
    });

    return {
      path: section.path,
      element: <DocsSectionLayout sectionId={section.id} />,
      children: [
        ...(indexPage ? [{ index: true, ...pageRoute(indexPage) }] : []),
        ...pages
          .filter((page) => page.key !== '')
          .map((page) => ({ path: page.key, ...pageRoute(page) })),
      ],
    };
  });
}

/**
 * The catch-all of a locale: a real 404 status (the server's response, the static export's
 * broken-link check), and {element} as its page, in the browser too.
 */
function createNotFoundRoute(element: React.ReactNode): RouteObject {
  return {
    path: '*',
    loader() {
      throw new Response('Not Found', { status: 404 });
    },
    element,
    errorElement: element,
  };
}

/**
 * Loads the HTML of the page at {pathname}, if it is a docs page. Await it before hydrating:
 * the server rendered the page's HTML, the first client render must have it too.
 *
 * @example
 * preloadDocsRoute(ROUTES, window.location.pathname, BASENAME).then(() => hydrateRoot(…));
 */
async function preloadDocsRoute(
  routes: RouteObject[],
  pathname: string,
  basename?: string,
): Promise<void> {
  const matches = matchRoutes(routes, pathname, basename) ?? [];

  await Promise.all(
    matches.map(({ route }) => {
      const page = (route.handle as DocsRouteHandle | undefined)?.msdPage;

      return page ? loadPageContent(page) : undefined;
    }),
  );
}

/** The docs page of the current route, `null` outside docs pages */
function useDocsPage(): DocsPage | null {
  const matches = useMatches();

  for (let index = matches.length - 1; index >= 0; index--) {
    const page = (matches[index].handle as DocsRouteHandle | undefined)
      ?.msdPage;

    if (page) return page;
  }

  return null;
}

export {
  createDocsRoutes,
  createLocalizedRoutes,
  createNotFoundRoute,
  preloadDocsRoute,
  useDocsPage,
};
export type { DocsRouteHandle };
