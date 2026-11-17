# Theming with CSS (`@mainset/ui-core`)

Everything here is plain CSS, so it works the same in React, Vue, Svelte, server templates or
static HTML. Read the [overview](./theming.md) first for the model.

## Setup

**With a bundler**, importing any ui-core recipe or config (or any `@mainset/react` component)
pulls in the CSS it needs, tokens included. **Without a bundler:**

```html
<link rel="stylesheet" href="…/@mainset/ui-core/styles/reset.css" />
<!-- optional, first -->
<link rel="stylesheet" href="…/@mainset/ui-core/styles/index.min.css" />
<link rel="stylesheet" href="/app-theme.css" />
<!-- your overrides -->
```

The load order of your overrides doesn't matter (every built-in rule has 0 specificity), but
putting them last is the clearest.

## 1. Pick a color scheme

```html
<html data-theme="system">
  <!-- light (default) | dark | system -->
  <body>
    <main>…</main>
    <footer data-theme="dark">…</footer>
    <!-- a dark island in any scheme -->
  </body>
</html>
```

`system` is light, and becomes dark under `prefers-color-scheme: dark`. Switching is just
changing the attribute: `document.documentElement.dataset.theme = 'dark'`.

## 2. Apply tones

```html
<div class="ms-tone-error">
  <!-- everything inside reads the error roles -->
  <div class="ms-background ms-border ms-surface ms-surface--variant-soft">
    Upload failed
  </div>
  <button
    class="ms-background ms-border ms-surface ms-surface--variant-solid ms-surface--hover-all
                 ms-control ms-control--size-base ms-button"
  >
    Retry
  </button>
</div>
```

You rarely write these classes by hand. The recipes produce them:

```ts
import { buttonRecipe, surfaceRecipe, toneRecipe } from '@mainset/ui-core';

buttonRecipe({ srfTheme: 'error', srfVariant: 'outlined', ctlSize: 'sm' });
surfaceRecipe({ srfTheme: 'success', srfVariant: 'soft' });
toneRecipe('warning'); // → "ms-tone-warning"
```

## 3. Re-brand: change a tone

A tone has 7 roles (see the [overview](./theming.md#2-tones-ms-tone-tone)). Derived roles are
precomputed, so **override every role you want changed**, in each scheme:

```css
/* app-theme.css: primary becomes teal */
:root,
[data-theme='light'],
[data-theme='system'] {
  --ms-color-primary-solid: #0f766e;
  --ms-color-primary-solid-hover: #0a5e57;
  --ms-color-primary-on-solid: #fbfaf8;
  --ms-color-primary-subtle: #e4eeed;
  --ms-color-primary-subtle-hover: #d3e3e0;
  --ms-color-primary-border: #0f766e;
  --ms-color-primary-text: #0f766e;
}

[data-theme='dark'] {
  --ms-color-primary-solid: #0f766e;
  --ms-color-primary-solid-hover: #428a82;
  --ms-color-primary-on-solid: #fbfaf8;
  --ms-color-primary-subtle: #0f1815;
  --ms-color-primary-subtle-hover: #12221f;
  --ms-color-primary-border: #287e76;
  --ms-color-primary-text: #5e9992;
}

@media (prefers-color-scheme: dark) {
  [data-theme='system'] {
    /* same values as [data-theme='dark'] */
  }
}

/* the focus ring follows the brand separately */
:root {
  --ms-color-focus-ring: #0f766e;
}
```

These values are what the build itself derives from `#0f766e`. You don't have to compute or
type them: `createTheme({ tones: { primary: '#0f766e' } })` from `@mainset/ui-core/theme` returns
this whole stylesheet (focus ring included). Run it once in a
[build script](./live-theming.md#static-themes-at-build-time), or at
[runtime](./live-theming.md).

**Shortcut:** to change only the base hue and accept stale hover/soft shades for a quick
prototype, override the palette color: `:root { --ms-palette-violet-600: #0f766e; }`. That changes
`solid`, `border` and `text` of every tone built on violet-600 (and the light focus ring), but not
the precomputed roles.

## Scheme-aware overrides

Use this pattern for **any value that should differ between light and dark** (canvas, text,
borders, tones, `--ms-shadow-color`):

```css
:root,
[data-theme='light'],
[data-theme='system'] {
  /* light values */
}
[data-theme='dark'] {
  /* dark values */
}
@media (prefers-color-scheme: dark) {
  [data-theme='system'] {
    /* dark values */
  }
}
```

Keep the three blocks **in this order**, and set the **same keys in each**. All selectors have
equal specificity, so when `data-theme` sits on `<html>` (which is also `:root`), the later block
wins.

Why not just `:root { … }`? A `:root` override also applies in dark mode when `data-theme="dark"`
is on `<html>`. And every nested `[data-theme]` element re-declares its scheme values, so a
`:root`-only override is lost inside nested themes.

Scheme-independent tokens (fonts, radius, spacing, motion, control sizes) can simply go on `:root`:

```css
:root {
  --ms-font-family-text-sans: 'Inter', system-ui, sans-serif;
  --ms-border-radius-sm: 0.5rem;
  --ms-control-radius: var(--ms-border-radius-pill); /* pill buttons / inputs */
  --ms-control-height-base: 2.25rem;
}
```

## Neutral surfaces and text

```css
:root,
[data-theme='light'],
[data-theme='system'] {
  --ms-color-bg-canvas: #fffdf8; /* page */
  --ms-color-bg-surface: #ffffff; /* cards, popovers */
  --ms-color-text-base: #1c1917;
}
[data-theme='dark'] {
  --ms-color-bg-canvas: #0c0a09;
  --ms-color-bg-surface: #1c1917;
  --ms-color-text-base: #f5f5f4;
}
/* + the prefers-color-scheme block */
```

Note: the precomputed `subtle` roles were mixed against the default canvas (`white` / `gray-950`).
A slightly different canvas is fine. For a very different one, recompute the tones against it:
`createTheme()` mixes them with the `--ms-color-bg-canvas` you pass in `light` / `dark`.

## A custom theme name

`data-theme` only knows `light | dark | system`. A brand variant on top of a scheme is just a class
or attribute of your own:

```html
<section data-theme="dark" class="theme-halloween">…</section>
```

```css
.theme-halloween {
  --ms-color-primary-solid: #f97316;
  /* …all primary roles, dark values… */
}
```

That works because `.theme-halloween` sits on the same element as `[data-theme]`, which resolves
the tone contract. Without a `data-theme` on that element, also add `ms-tone-primary` to it
(see below).

## Where an override applies

Custom properties resolve on the element that **declares** them. `--ms-tone-*` is declared on
`:root`, on every `[data-theme]` element and on every `.ms-tone-*` element. Its value is fixed
there and children inherit the result.

| You override…                                                              | Effect                                                                                                                                                                                                    |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--ms-palette-*` / `--ms-color-*` on `:root` (scheme pattern above)        | ✅ everywhere; precomputed roles only change if you override them too                                                                                                                                     |
| `--ms-color-{tone}-*` on an element with `data-theme` or `.ms-tone-{tone}` | ✅ that element and its subtree                                                                                                                                                                           |
| `--ms-color-{tone}-*` on any other element                                 | ⚠️ components inside keep the inherited tone; only `bgColor` / `txtColor` / `brdColor` utilities and elements with their own `.ms-tone-{tone}` pick it up. Add `ms-tone-{tone}` to that element to fix it |
| `--ms-tone-*` on a component class, e.g. `.ms-button { … }`                | ⚠️ applies to **every** tone of that component. Scope it: `.ms-button.ms-tone-warning`                                                                                                                    |
| scheme-dependent tokens on `:root` only                                    | ⚠️ leak into dark mode and get lost in nested themes. Use the scheme pattern                                                                                                                              |

### Re-color one component

```css
/* only warning buttons */
.ms-button.ms-tone-warning {
  --ms-tone-solid: #f59e0b;
  --ms-tone-solid-hover: #d97706;
}

/* one specific button, radius */
.checkout-button {
  --ms-control-radius: 0;
}
```

Named per-component color tokens (e.g. `--ms-button-bg`) are deliberately not exposed: tones keep
components consistent. Use a tone, or the selectors above.

## Sass helpers

ui-core publishes its Sass mixins for app stylesheets that need the same breakpoints:

```scss
@use '@mainset/ui-core/scss/mixins' as ms;

.hero {
  padding: var(--ms-spacing-scale-block-sm);

  @include ms.media-up(md) {
    // ≥ 48rem, same as responsive props
    padding: var(--ms-spacing-scale-section-base);
  }
}
```

Token values themselves are not configurable through Sass variables. Override the custom
properties instead. Changing the shipped defaults is a source change, see
[Changing the built-in tokens](./maintaining-tokens.md).
