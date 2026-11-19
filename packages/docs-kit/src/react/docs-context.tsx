'use client';

import React from 'react';
import { Outlet, ScrollRestoration, useHref, useLocation } from 'react-router';

import type { DocsLocaleConfig, DocsSite } from '../core/docs.types.mjs';
import { resolveLocalized, switchLocalePath } from '../core/locale-path.mjs';
import type { DocsUiStrings } from '../core/ui-strings.mjs';
import { resolveUiStrings } from '../core/ui-strings.mjs';
import { DocsHead } from './docs-head.js';

/** What the docs chrome needs from the app that React can render, set once for all routes */
interface DocsChromeOptions {
  /** In the header, linked to the home page. Defaults to the site title */
  logo?: React.ReactNode;
}

interface DocsContextValue {
  site: DocsSite;
  locale: string;
  localeConfig: Required<DocsLocaleConfig>;
  ui: DocsUiStrings;
  siteTitle: string;
  chrome: DocsChromeOptions;
}

const DocsContext = React.createContext<DocsContextValue | null>(null);

/** The site, the locale of the current route and its interface strings */
function useDocs(): DocsContextValue {
  const context = React.useContext(DocsContext);

  if (!context) {
    throw new Error(
      '[docs-kit] useDocs() is used outside the routes of createLocalizedRoutes()',
    );
  }

  return context;
}

interface DocsLocaleRouteProps {
  site: DocsSite;
  locale: string;
  chrome: DocsChromeOptions;
}

/** The root of one locale's routes: provides the docs context, sets `<html lang dir>` */
function DocsLocaleRoute({ site, locale, chrome }: DocsLocaleRouteProps) {
  const value = React.useMemo<DocsContextValue>(
    () => ({
      site,
      locale,
      localeConfig: site.locales[locale],
      ui: resolveUiStrings(locale, site.ui),
      siteTitle: resolveLocalized(site.title, locale, site.defaultLocale),
      chrome,
    }),
    [site, locale, chrome],
  );

  // NOTE: the same page in every locale (each locale has the same routes), as real URLs:
  // absolute with `site.url`, else with the router's basename
  const { pathname } = useLocation();
  const basePath = useHref('/').replace(/\/$/, '');
  const toUrl = (routerPath: string) =>
    `${site.url ? site.url.replace(/\/$/, '') : basePath}${routerPath}`;
  const alternates = Object.entries(site.locales).map(([key, config]) => ({
    hreflang: config.lang,
    href: toUrl(switchLocalePath(site, pathname, key)),
  }));

  alternates.push({
    hreflang: 'x-default',
    href: toUrl(switchLocalePath(site, pathname, site.defaultLocale)),
  });

  return (
    <DocsContext.Provider value={value}>
      <DocsHead
        title={value.siteTitle}
        lang={value.localeConfig.lang}
        dir={value.localeConfig.dir}
        canonical={site.url ? toUrl(pathname) : undefined}
        alternates={
          Object.keys(site.locales).length > 1 ? alternates : undefined
        }
      />
      <Outlet />
      {/* NOTE: a new page starts at its top, or at its #heading; back / forward restore */}
      <ScrollRestoration />
    </DocsContext.Provider>
  );
}

export { DocsContext, DocsLocaleRoute, useDocs };
export type { DocsChromeOptions, DocsContextValue };
