# @mainset/docs-kit

A documentation site from a folder of localized markdown pages: install the kit, write the
pages, run `ms-cli`. The app itself (entries, server render, routes, HTML template) is the kit's,
so it updates with the package; the project holds only its config, pages and translations.
Server-rendered while you write, exported as static HTML for any static host (GitHub Pages).

- **Two sidebars.** The pages on the start side, folders as collapsible categories; "On this
  page" on the end side, the heading being read marked as you scroll. A page can list its own
  headings in the sidebar too (`sidebar.anchors`).
- **Localized.** One folder per locale; a page missing in a locale shows the default locale's
  version, with a notice. The interface (search, menus, labels) is translated too.
- **Your routes.** The docs are route objects next to your own pages, in every locale.
- **Search** (⌘K / Ctrl+K / `/`) over every page title and heading, language and color scheme
  menus, previous / next, breadcrumbs, edit links, a menu drawer on small screens.
- **Fast.** Each page's HTML is a chunk of its own, the code is highlighted at build time, the
  pages hydrate (no duplicated payload).

## A docs project

```
my-docs/
├── package.json                  @mainset/docs-kit, @mainset/cli (+ the kit's peers)
├── config/webpack.config.mjs     export default docsWebpackConfig()
├── public/favicon.svg
└── src/
    ├── docs.config.tsx           export default defineDocsApp({ … })
    ├── pages/
    │   └── ui-core/content/      ← a section: `src/pages/<section>/content/<locale>/**`
    ├── i18n/locales/             optional: <locale>/translation.json
    ├── home.tsx                  optional: replaces the home page
    ├── not-found.tsx             optional: replaces the not-found page
    ├── routes.tsx                optional: your own routes, next to the docs
    ├── providers.tsx             optional: wraps every page (analytics, contexts…)
    └── styles/global.scss        optional: after ui-core's reset (theme tokens)
```

```json
{
  "scripts": {
    "dev": "cross-env NODE_ENV=development ms-cli web-app --exec serve",
    "build": "ms-cli web-app --exec build",
    "serve": "ms-cli web-app --exec serve-static",
    "build:static": "ms-cli web-app --exec build && ms-docs export",
    "preview:static": "ms-docs preview"
  }
}
```

**`config/webpack.config.mjs`**, the whole app:

```js
import { docsWebpackConfig } from '@mainset/docs-kit/node';

export default docsWebpackConfig();
// docsWebpackConfig({ webpack: { … } }): merged last, into both bundles
```

**`src/docs.config.tsx`:**

```tsx
import { defineDocsApp } from '@mainset/docs-kit';

export default defineDocsApp({
  title: 'mainset UI',
  defaultLocale: 'en',
  locales: { en: { label: 'English' }, uk: { label: 'Українська' } }, // + lang, dir: 'rtl'
  // every `src/pages/<id>/content` folder is a section; listed ones come first, in this order
  sections: { 'ui-core': { label: 'UI Core' } }, // + path, editUrl; label: { en, uk }
  logo: <Logo />, // default: the title
  repositoryUrl: 'https://github.com/org/repo',
  editUrl: 'https://github.com/org/repo/edit/main/docs/src/pages/', // every section's edit links
  url: 'https://org.github.io/repo', // optional: absolute canonical / hreflang links
});
```

**Translations**, `src/i18n/locales/<locale>/translation.json`: your components' strings
(`useTranslation()` from `react-i18next`, one instance per locale), the default home page's texts
and rewordings of the interface:

```json
{
  "home": {
    "overline": "mainset UI stack",
    "title": "One design system, any framework",
    "lead": "CSS elements, tokens and themes…",
    "description": "The page's <meta> description (default: the lead)"
  },
  "ui": { "search": "Find" }
}
```

**Optional files**, each a default export:

```tsx
// src/routes.tsx: the paths are relative, in every locale (`/about`, `/uk/about`)
const routes: DocsAppRoutes = (locale) => [
  {
    path: 'about',
    element: (
      <DocsShell>
        <main id={DOCS_MAIN__ID}>…</main>
      </DocsShell>
    ),
  },
];
export default routes;

// src/providers.tsx
const Providers: DocsAppProviders = ({ locale, children }) => (
  <Analytics>{children}</Analytics>
);
export default Providers;

// src/home.tsx, src/not-found.tsx: a component; `DocsHomePage` / `DocsNotFoundPage` are the defaults
```

Your pages use the same frame: `<DocsShell><main id={DOCS_MAIN__ID}>…</main></DocsShell>`, and
`useDocs()` for the site, the locale and the interface strings.

### `ms-docs eject`

Copies the engine into the project (`src/index.ssr.ts`, `src/index.csr.ts`,
`src/index.template.html`, `src/app.{browser,server,routes,constants}.ts(x)`,
`config/ssr-server.config.mts`), to change what the config doesn't cover. `docsWebpackConfig()`
then builds the project's copies instead of the kit's; they call the kit's public API
(`createDocsAppSite`, `createDocsAppRoutes`…), so that logic still updates with the package.
It never overwrites a file. The engine is the kit's until then: don't add those files by hand.

## Pages of a section

```
src/pages/ui-core/content/          ← a section (any name)
├── en/                             ← a locale: the default one defines the pages
│   ├── index.md                    → /ui-core
│   ├── 01-getting-started/         ← a category (the `01-` orders it, it's not in the URL)
│   │   ├── _category.json          ← { "label": "Getting started", "collapsed": false }
│   │   └── 01-installation.md      → /ui-core/getting-started/installation
│   └── 02-elements/
│       ├── index.md                → /ui-core/elements (the category's "Overview")
│       └── 01-layout/…             ← categories nest
└── uk/                             → /uk/ui-core/…, same file names
    ├── 01-getting-started/_category.json   ← { "label": "Початок роботи" }
    └── 01-getting-started/01-installation.md
```

Order: `sidebar.order` in the frontmatter, else the `01-` prefix, else alphabetical; a folder's
`index.md` comes first.

## Writing pages

````md
---
title: Button # default: the `# h1`, then the file name
description: Short summary # default: the first paragraph (search, <meta>)
sidebar:
  label: Button # shorter sidebar label
  order: 3
  hidden: false # routable, not listed
  anchors: true # lists the page's `##` headings under it in the sidebar
toc: true # `false` hides "On this page"
---

# Button

Links to other pages are relative `.md` paths: [tokens](../02-theming/04-tokens.md#button).

> [!TIP]
> GitHub's alerts (NOTE, TIP, IMPORTANT, WARNING, CAUTION) render as ui-core alerts.

```html preview
<button class="ms-surface ms-surface--variant-solid ms-control ms-button">
  Live
</button>
```
````

- The frontmatter is a strict subset of YAML: `key: value` lines nested by indentation, values
  are plain or quoted text, numbers, `true` / `false`. Anything else (lists, multi-line text,
  `[…]` / `{…}`) fails the build with its line; an unknown field (a typo) is a build warning.
- `##` / `###` headings make "On this page", with GitHub-compatible ids (the same anchors work on
  GitHub and on the site).
- `html preview` code blocks render their HTML above the code: a live example.
- Code is highlighted by [Shiki](https://shiki.style) at build time, in a light and a dark theme
  that follow `data-theme`.
- Tables, links and alerts get ui-core classes. A link to a `.md` file outside the locale folder
  stays as written and warns at build time.

## Static export

```sh
ms-cli web-app --exec build && ms-docs export   # → dist/static
ms-docs preview                                  # serves it like GitHub Pages does
```

`ms-docs export` renders every page of the SSR build into HTML. It needs no list of routes: from
`/`, it follows each page's links (and its `hreflang` alternates, so every locale), writes
`404.html` and `.nojekyll`, and **fails on a broken internal link**. For a project site, build and
export with the same base path: `PUBLIC_PATH=/repo/`.

| Option                 | Default               |
| ---------------------- | --------------------- |
| `--out <dir>`          | `dist/static`         |
| `--entry <path>`       | `/` (repeatable)      |
| `--not-found <path>`   | `/404`                |
| `--base <path>`        | `$PUBLIC_PATH` or `/` |
| `--allow-broken-links` | off                   |
| `--port <number>`      | `4173` (`preview`)    |

## Entries

| Import                           | Holds                                                                       |
| -------------------------------- | --------------------------------------------------------------------------- |
| `@mainset/docs-kit`              | `defineDocsApp`, routes, React components and hooks (browser and server)    |
| `@mainset/docs-kit/node`         | `docsWebpackConfig`, `ejectDocsApp`, `compileMarkdown`, `exportStaticSite`… |
| `@mainset/docs-kit/global-types` | types for `*.md` modules and `import.meta.webpackContext`                   |
| `ms-docs` (bin)                  | `export`, `preview`, `eject`                                                |

The pure model (`src/core`: content registry, sidebar tree, locale paths) has no React and no
Node; the markdown compiler (`src/node`) is a plain function with a thin webpack loader around it,
so another bundler needs only another wrapper.

## Customizing the look

The chrome is built from `@mainset/react` and ui-core tokens, so a ui-core theme themes it too.
Its own sizes are tokens: `--msd-header-height`, `--msd-sidebar-width`, `--msd-toc-width`,
`--msd-content-max-width`, `--msd-page-max-width`: override them, and ui-core's tokens, in
`src/styles/global.scss`. Every class is `msd-*` (BEM). The app loads ui-core's reset first and the
classes of every ui-core element (the live previews use them).
