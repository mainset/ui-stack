# @mainset/docs-kit

Documentation sites from a fixed folder structure of localized markdown pages, built with the
mainset UI and served by an `@mainset/cli` app: server-rendered while you write, exported as
static HTML for any static host (GitHub Pages).

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

## Folder structure

```
src/pages/ui-core/                ← a section (any name)
├── index.ts                      ← defineDocsSection()
└── content/
    ├── en/                       ← a locale: the default one defines the pages
    │   ├── index.md              → /ui-core
    │   ├── 01-getting-started/   ← a category (the `01-` orders it, it's not in the URL)
    │   │   ├── _category.json    ← { "label": "Getting started", "collapsed": false }
    │   │   └── 01-installation.md → /ui-core/getting-started/installation
    │   └── 02-elements/
    │       ├── index.md          → /ui-core/elements (the category's "Overview")
    │       └── 01-layout/…       ← categories nest
    └── uk/                       → /uk/ui-core/…, same file names
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

## Setup in an `@mainset/cli` app

**1. The markdown loader**, `config/webpack.config.mjs`:

```js
import {
  generateEnvBasedWebpackConfig,
  mergeWebpackConfig,
} from '@mainset/bundler-webpack';
import { docsWebpackConfigFragment } from '@mainset/docs-kit/node';

export default generateEnvBasedWebpackConfig(
  mergeWebpackConfig(docsWebpackConfigFragment(), {
    output: { publicPath: process.env.PUBLIC_PATH || '/' },
  }),
);
```

Types for `*.md` and `import.meta.webpackContext`, in `src/@types/*.d.ts`:
`/// <reference types="@mainset/docs-kit/global-types" />`.

**2. Sections and the site:**

```ts
// src/pages/ui-core/index.ts
const UI_CORE_DOCS = defineDocsSection({
  id: 'ui-core',
  label: 'UI Core', // or { en: '…', uk: '…' }
  content: import.meta.webpackContext('./content', {
    recursive: true,
    regExp: /\.(md|json)$/,
  }),
  editUrl:
    'https://github.com/org/repo/edit/main/apps/docs/src/pages/ui-core/content/',
});

// src/docs.config.ts
const DOCS_SITE = defineDocsSite({
  title: 'mainset UI',
  defaultLocale: 'en',
  locales: { en: { label: 'English' }, uk: { label: 'Українська' } }, // + lang, dir: 'rtl'
  sections: [UI_CORE_DOCS],
  repositoryUrl: 'https://github.com/org/repo',
  url: 'https://org.github.io/repo', // optional: absolute canonical / hreflang links
  ui: { uk: { search: 'Знайти' } }, // optional: reword or add interface strings
});
```

**3. Routes**, your pages next to the docs, once per locale (`/…` and `/uk/…`):

```tsx
const ROUTES = createLocalizedRoutes(
  DOCS_SITE,
  (locale) => [
    { index: true, element: <HomePage /> },
    ...createDocsRoutes(DOCS_SITE, locale),
    createNotFoundRoute(<NotFoundPage />), // a real 404 status
  ],
  { logo: <Logo /> },
);
```

Your pages use the same frame: `<DocsShell><main id={DOCS_MAIN__ID}>…</main></DocsShell>`, and
`useDocs()` for the site, the locale and the interface strings.

**4. Server render and hydration.** The server collects the page's `<head>` while it renders:

```tsx
// src/app.server.tsx: return the head with the element
const head: DocsDocumentHead = {};
const element = (
  <DocsHeadContext.Provider value={head}>
    <MainSetProvider>
      <StaticRouterProvider router={router} context={context} />
    </MainSetProvider>
  </DocsHeadContext.Provider>
);

// config/ssr-server.config.mts: render first, then write the head into the template
const appHtml = renderToString(element);
const html = applyDocumentHead(template, head).replace(
  ROOT,
  `<div id="root">${appHtml}</div>`,
);
```

```ts
// src/index.ssr.ts: the page's HTML chunk before hydrating
preloadDocsRoute(ROUTES, location.pathname, BASENAME).then(() =>
  hydrateRoot(root, app),
);
```

Put the color scheme script in the template's `<head>` (see `COLOR_SCHEME__INLINE_SCRIPT`), so a
dark page never flashes light.

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

| Import                           | Holds                                                                                   |
| -------------------------------- | --------------------------------------------------------------------------------------- |
| `@mainset/docs-kit`              | site / section definitions, routes, React components and hooks (browser and server)     |
| `@mainset/docs-kit/node`         | `docsWebpackConfigFragment`, `compileMarkdown`, `exportStaticSite`, `previewStaticSite` |
| `@mainset/docs-kit/global-types` | types for `*.md` modules and `import.meta.webpackContext`                               |
| `ms-docs` (bin)                  | `export`, `preview`                                                                     |

The pure model (`src/core`: content registry, sidebar tree, locale paths) has no React and no
Node; the markdown compiler (`src/node`) is a plain function with a thin webpack loader around it,
so another bundler needs only another wrapper.

## Customizing the look

The chrome is built from `@mainset/react` and ui-core tokens, so a ui-core theme themes it too.
Its own sizes are tokens: `--msd-header-height`, `--msd-sidebar-width`, `--msd-toc-width`,
`--msd-content-max-width`, `--msd-page-max-width`. Every class is `msd-*` (BEM). Live previews
need the classes of every ui-core element: import `@mainset/ui-core/styles/index.css` in the app.
