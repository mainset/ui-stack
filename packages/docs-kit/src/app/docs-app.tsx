'use client';

import i18next from 'i18next';
import type { i18n as I18nInstance } from 'i18next';
import React from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import type { RouteObject } from 'react-router';
import { Outlet } from 'react-router';

import { humanizeSegment } from '../core/content-path.mjs';
import type { DocsSectionDefinition } from '../core/define-docs.mjs';
import { defineDocsSection, defineDocsSite } from '../core/define-docs.mjs';
import type {
  DocsContentContext,
  DocsLocalized,
  DocsSite,
  DocsSiteOptions,
} from '../core/docs.types.mjs';
import type { DocsUiStrings } from '../core/ui-strings.mjs';
import {
  createDocsRoutes,
  createLocalizedRoutes,
  createNotFoundRoute,
} from '../react/docs-routes.js';

// The docs app: what `@mainset/docs-kit` builds from a project's files. The engine (entries,
// server render, routes) calls these, so the logic stays in the kit, also after `eject`.

interface DocsAppSectionConfig {
  label?: DocsLocalized<string>;
  /** URL segment @default the folder name */
  path?: string;
  /** The page's file (`en/01-getting-started/01-introduction.md`) is appended to it */
  editUrl?: string;
}

interface DocsAppConfig extends Omit<DocsSiteOptions, 'ui'> {
  /**
   * The sections are the folders `src/pages/<id>/content`; listed here, they come first, in
   * this order (the others after them, alphabetically), with their label and links
   */
  sections?: Record<string, DocsAppSectionConfig>;
  /**
   * Where `src/pages/` is in the repository's editor
   * (`https://github.com/org/repo/edit/main/docs/src/pages/`): every section's edit links
   * follow from it, unless the section has its own `editUrl`
   */
  editUrl?: string;
  /** In the header, linked to the home page @default the site title */
  logo?: React.ReactNode;
  /** Rewords the interface strings, per locale (also `"ui"` in a locale's `translation.json`) */
  ui?: DocsSiteOptions['ui'];
}

/** A locale's `src/i18n/locales/<locale>/translation.json` */
type DocsAppTranslation = Record<string, unknown> & {
  ui?: Partial<DocsUiStrings>;
};

/**
 * `src/routes.tsx`: the project's pages, in every locale, its home page (the index route)
 * among them; the docs pages and the not-found page come after them
 */
type DocsAppRoutes = RouteObject[] | ((locale: string) => RouteObject[]);

/** `src/providers.tsx`: wraps every page (inside the router and the locale's translations) */
type DocsAppProviders = React.ComponentType<{
  locale: string;
  children: React.ReactNode;
}>;

/** `src/docs.config.tsx`: `export default defineDocsApp({ … })` */
function defineDocsApp(config: DocsAppConfig): DocsAppConfig {
  return config;
}

const CONTENT_KEY__REGEX = /^\.\/([^/]+)\/content\/(.+)$/;
const TRANSLATION_KEY__REGEX = /^\.\/([^/]+)\/translation\.json$/;

/** `./ui-core/content/en/x.md` → the `ui-core` section's context, with the key `./en/x.md` */
function splitSectionContents(
  context: DocsContentContext,
): Map<string, DocsContentContext> {
  const keysBySection = new Map<string, string[]>();

  context.keys().forEach((key) => {
    const match = CONTENT_KEY__REGEX.exec(key);

    if (!match) return;

    const [, sectionId, rest] = match;

    if (!keysBySection.has(sectionId)) keysBySection.set(sectionId, []);
    keysBySection.get(sectionId)!.push(`./${rest}`);
  });

  return new Map(
    Array.from(keysBySection, ([sectionId, keys]) => [
      sectionId,
      Object.assign(
        (key: string) => context(`./${sectionId}/content/${key.slice(2)}`),
        { keys: () => keys },
      ),
    ]),
  );
}

/** `./uk/translation.json` → `{ uk: {…} }` */
function readTranslations(
  context: DocsContentContext | null,
): Record<string, DocsAppTranslation> {
  if (!context) return {};

  return Object.fromEntries(
    context.keys().flatMap((key) => {
      const match = TRANSLATION_KEY__REGEX.exec(key);

      return match ? [[match[1], context(key) as DocsAppTranslation]] : [];
    }),
  );
}

interface DocsAppSources {
  /** `src/pages`: `./<section>/content/<locale>/**` */
  content: DocsContentContext | null;
  /** `src/i18n/locales`: `./<locale>/translation.json` */
  translations: DocsContentContext | null;
}

/** The site of a project: its config, its sections' folders and its translations */
function createDocsAppSite(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- the logo is the chrome's
  { sections = {}, editUrl, logo, ui, ...options }: DocsAppConfig,
  { content, translations }: DocsAppSources,
): DocsSite {
  const contentBySection = content
    ? splitSectionContents(content)
    : new Map<string, DocsContentContext>();
  const configuredIds = Object.keys(sections);
  const missingId = configuredIds.find((id) => !contentBySection.has(id));

  if (missingId) {
    throw new Error(
      `[docs-kit] sections.${missingId}: there is no src/pages/${missingId}/content folder`,
    );
  }

  const sectionIds = [
    ...configuredIds,
    ...Array.from(contentBySection.keys())
      .filter((id) => !(id in sections))
      .sort(),
  ];
  const editBaseUrl = editUrl?.replace(/\/?$/, '/');
  const definitions: DocsSectionDefinition[] = sectionIds.map((id) => {
    const section = sections[id] ?? {};

    return defineDocsSection({
      id,
      path: section.path,
      label: section.label ?? humanizeSegment(id),
      content: contentBySection.get(id)!,
      editUrl:
        section.editUrl ??
        (editBaseUrl ? `${editBaseUrl}${id}/content/` : undefined),
    });
  });

  // NOTE: a translation's `ui` rewords the interface; the config's `ui` wins over it
  const translationByLocale = readTranslations(translations);
  const uiByLocale = Object.fromEntries(
    Object.keys(options.locales).map((locale) => [
      locale,
      { ...translationByLocale[locale]?.ui, ...ui?.[locale] },
    ]),
  );

  return defineDocsSite({ ...options, ui: uiByLocale, sections: definitions });
}

/**
 * One i18next instance per locale, its language fixed: the locale comes from the route, so
 * nothing switches a shared instance (the server renders pages of every language at once).
 */
function createDocsAppI18n(
  site: DocsSite,
  translations: DocsContentContext | null,
): Record<string, I18nInstance> {
  const resources = Object.fromEntries(
    Object.entries(readTranslations(translations)).map(
      ([locale, translation]) => [locale, { translation }],
    ),
  );

  return Object.fromEntries(
    Object.keys(site.locales).map((locale) => {
      const instance = i18next.createInstance();

      instance.use(initReactI18next).init({
        lng: locale,
        fallbackLng: site.defaultLocale,
        resources,
        // NOTE: the resources are bundled, so the instance is ready at once, on the server too
        initAsync: false,
        interpolation: { escapeValue: false }, // React already escapes
      });

      return [locale, instance];
    }),
  );
}

interface DocsAppRoutesOptions {
  i18n: Record<string, I18nInstance>;
  logo?: React.ReactNode;
  /** The project's pages, its home page among them */
  routes: DocsAppRoutes;
  NotFound: React.ComponentType;
  Providers?: DocsAppProviders;
}

const PassThroughProviders: DocsAppProviders = ({ children }) => children;

/** A route of the locale's home (`/`, `/uk`): an index route, or one inside a pathless layout */
function hasHomeRoute(routes: RouteObject[]): boolean {
  return routes.some(
    (route) =>
      route.index ||
      route.path === '' ||
      route.path === '/' ||
      (route.path === undefined && hasHomeRoute(route.children ?? [])),
  );
}

/**
 * Every locale's routes: the project's (its home page among them), the docs pages and the
 * not-found page (a real 404), each wrapped in the locale's translations and the providers
 */
function createDocsAppRoutes(
  site: DocsSite,
  {
    i18n,
    logo,
    routes,
    NotFound,
    Providers = PassThroughProviders,
  }: DocsAppRoutesOptions,
): RouteObject[] {
  const projectRoutes = (locale: string) => {
    const localeRoutes = typeof routes === 'function' ? routes(locale) : routes;

    if (!hasHomeRoute(localeRoutes)) {
      throw new Error(
        `[docs-kit] src/routes.tsx has no home page for the locale "${locale}": ` +
          'add { index: true, element: <HomePage /> } to its routes',
      );
    }

    return localeRoutes;
  };

  return createLocalizedRoutes(
    site,
    (locale) => [
      {
        element: (
          <I18nextProvider i18n={i18n[locale]}>
            <Providers locale={locale}>
              <Outlet />
            </Providers>
          </I18nextProvider>
        ),
        children: [
          ...projectRoutes(locale),
          ...createDocsRoutes(site, locale),
          createNotFoundRoute(<NotFound />),
        ],
      },
    ],
    { logo },
  );
}

export {
  createDocsAppI18n,
  createDocsAppRoutes,
  createDocsAppSite,
  defineDocsApp,
  readTranslations,
  splitSectionContents,
};
export type {
  DocsAppConfig,
  DocsAppProviders,
  DocsAppRoutes,
  DocsAppRoutesOptions,
  DocsAppSectionConfig,
  DocsAppSources,
  DocsAppTranslation,
};
