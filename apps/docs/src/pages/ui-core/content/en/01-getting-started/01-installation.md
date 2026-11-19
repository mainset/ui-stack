# Installation

ui-core ships as CSS classes plus small TypeScript helpers, so it works with any framework or none.

```sh
pnpm add @mainset/ui-core
```

## Usage

**With a JS bundler** (React adapter, Vite, rspack, webpack…) — nothing to configure:
every element module imports its own CSS (plus the shared foundation), so the bundle
contains only the CSS of the elements in use. Import the [typefaces](#typefaces) once, at the
app root.

**Without a bundler** (plain HTML, server templates, Vue/Svelte/…):

```html
<!-- the reset is optional; when used, load it first -->
<link rel="stylesheet" href="@mainset/ui-core/styles/reset.css" />
<!-- includes the typefaces -->
<link rel="stylesheet" href="@mainset/ui-core/styles/index.min.css" />

<button
  class="ms-surface ms-surface--variant-outlined ms-surface--hover-all ms-tone-error
         ms-control ms-control--size-sm ms-button"
>
  Delete
</button>
```

The same classes come from the recipe (which also adds the `ms-background ms-border`
utility base classes):

```ts
buttonRecipe({ srfVariant: 'outlined', srfTheme: 'error', ctlSize: 'sm' });
// → "ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-outlined
//    ms-control ms-control--size-sm ms-button ms-tone-error"
```

| Entry                                       | Contents                                                                                                                                        |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `@mainset/ui-core`                          | class-name configs, recipes, types, utils                                                                                                       |
| `@mainset/ui-core/styles/index.css`         | typefaces + foundation + every element                                                                                                          |
| `@mainset/ui-core/styles/index.min.css`     | the same, minified (for use without a bundler)                                                                                                  |
| `@mainset/ui-core/styles/normalize.min.css` | headless: every component's normalize layer, no mainset look ([layers](../01-getting-started/layers-and-direction.md#two-layers-per-component)) |
| `@mainset/ui-core/styles/foundation.css`    | all design tokens + base styles + tone classes                                                                                                  |
| `@mainset/ui-core/styles/reset.css`         | opt-in modern reset (`normalize.css` is an alias)                                                                                               |
| `@mainset/ui-core/styles/fonts.css`         | the mainset typefaces, `@font-face` only ([typefaces](#typefaces))                                                                              |
| `@mainset/ui-core/scss/mixins`              | `media-up()`, `responsive-variants`, helpers                                                                                                    |

## Typefaces

mainset text is set in [Onest](https://fonts.google.com/specimen/Onest) and technical labels
(overlines, code, data) in [JetBrains Mono](https://www.jetbrains.com/lp/mono/): variable,
Latin + Cyrillic, both SIL OFL 1.1 (licences ship beside the files). The font tokens name them by
default; the files load from one stylesheet, **imported once per page**:

```ts
// app root, or the micro-frontend shell (not in each remote)
import '@mainset/ui-core/styles/fonts.css';
```

It isn't part of the per-element CSS on purpose: every bundle importing it emits its own copy of
the files, so remotes of one shell would each download the same fonts. Fonts are split by script
(`unicode-range`): a page fetches only the files its text uses. Until a file lands, a local
font resized to its metrics stands in (`Onest Fallback`: Arial; `JetBrains Mono Fallback`: Courier
New), so text doesn't shift when the web font swaps in. Without the stylesheet, the system fonts
render. Another typeface is one token away:
`:root { --ms-font-family-text-sans: 'Inter', system-ui, sans-serif; }`.
