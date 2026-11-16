# Live theming (runtime)

Re-brand from one color per tone, computed in the browser or on the server: a user picks a color
with `<input type="color">` and the whole UI follows, or each tenant of a multi-tenant app gets
its own brand from the database. No rebuild, no page reload.

```ts
import { createTheme } from '@mainset/ui-core/theme';

createTheme({ tones: { primary: '#0f766e' } }); // → CSS text for light, dark and system
```

In React it's one prop: [`<MainSetProvider theme={…}>`](../../react/docs/theming.md#4-live-theming).

## How it works

1. Tones are CSS custom properties, so new values apply on the next frame.
2. You give one color per tone. The other roles (hover, subtle, dark-mode border and text) are
   derived by `deriveToneRoles()`, **the same function the build uses** to generate the shipped
   CSS. A runtime theme can't drift from the built-in one: given the built-in `#9013fe`,
   `createTheme()` returns exactly the shipped `--ms-color-primary-*` values.
3. The result is written in the [scheme-aware pattern](./css-overrides.md#scheme-aware-overrides), so
   light, dark, `system` and nested `data-theme` subtrees all update. Its selectors outrank the
   built-in 0-specificity tokens, so it wins in any load order.

`@mainset/ui-core/theme` imports no CSS and has no dependencies: it runs in Node (SSR, build
scripts) and in every supported browser. It adds about 2.8 KB gzipped to a bundle, color math
included, and nothing if you don't import it.

## `createTheme(options)`

```ts
createTheme({
  tones: {
    primary: '#0f766e', // one color for both schemes
    error: { light: '#be123c', dark: '#f43f5e' }, // one per scheme
    warning: { solid: '#f59e0b', onSolid: '#111827' }, // force the text color on solid
    base: { solid: '#1c1917', text: '#1c1917', border: '#1c1917' }, // explicit roles skip mixing
  },
  light: {
    '--ms-color-bg-canvas': '#fffdf8',
    '--ms-border-radius-sm': '0.5rem',
  },
  dark: { '--ms-color-bg-canvas': '#0c0a09' },
});
```

| Option          | Type                                                                | Notes                                                                |
| --------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `tones.{tone}`  | `color` · `{ solid, onSolid?, text?, border? }` · `{ light, dark }` | any built-in tone; `null` / `undefined` keeps the built-in one       |
| `light`, `dark` | `{ '--ms-…': value }`                                               | any other token for that scheme; applied after the tones, so it wins |

- **Colors** are `#rgb`, `#rrggbb`, `#rrggbbaa` or `rgb()` / `rgba()` (what `<input type="color">`
  and most color pickers return). Named colors, `hsl()` and `var()` aren't parsed for tones.
- **`onSolid`** defaults to light (`gray-50`) or dark (`gray-900`) text, whichever has more WCAG
  contrast on `solid`. That can differ from a hand-picked built-in: green-600 gets dark text,
  because light text on it is only 3.2:1.
- **Focus ring:** when `primary` is set, `--ms-color-focus-ring` follows it (the solid color in
  light, the lighter text tint in dark), unless you set the focus ring yourself.
- **Canvas:** a `--ms-color-bg-canvas` color in `light` / `dark` is also used as the background the
  `subtle` roles are mixed against, so soft surfaces stay right on a very different page color.
- **Validation:** an unparsable tone color, an unknown tone, a name that isn't `--ms-*`, or a value
  containing `; { } < >` throws a `TypeError`. The output can't break out of its `<style>`
  element, so it's safe to build from user input.
- An empty theme returns `''`.

Related exports:

| Export                                                 | Returns                                                                                 |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `createThemeTokens(options)`                           | `{ light, dark }` maps of custom properties, e.g. for tests or your own selectors       |
| `applyTheme(options \| null)`                          | browser: writes the CSS into one `<style id="ms-theme">` in `<head>`; `null` removes it |
| `deriveToneRoles(scheme, …)`                           | the 7 roles of one tone for one scheme, from parsed colors (low level)                  |
| `parseColor`, `mixOklab`, `contrastRatio`, `formatHex` | the color math, if you need it                                                          |

New tone **names** can't be added at runtime: tone classes are generated at build time, see
[Changing the built-in tokens](./maintaining-tokens.md#add-a-tone).

## React

`@mainset/react` wraps this API: `<MainSetProvider theme={…}>` server-renders the theme and
`useTheme()` changes it. See [Theming in React: live theming](../../react/docs/theming.md#4-live-theming).

## Plain JS

```html
<input type="color" id="brand" value="#9013fe" />

<script type="module">
  import { applyTheme } from '@mainset/ui-core/theme';

  document.getElementById('brand').addEventListener('input', (event) => {
    applyTheme({ tones: { primary: event.target.value } });
  });
</script>
```

`applyTheme()` creates `<style id="ms-theme">` once and then only updates its text. If the server
already rendered one with that id, it's reused. Options: `{ id, nonce, document }`.

## Server rendering and CSP

Outside React, render the CSS into `<head>` yourself:

```ts
const css = createTheme(themeFromDb);
const head = `<style id="ms-theme" nonce="${nonce}">${css}</style>`;
```

A strict CSP (`style-src` without `'unsafe-inline'`) blocks inline `<style>` elements unless they
carry the page's nonce. Pass `themeNonce` to `MainSetProvider`, or `nonce` to `applyTheme()`, and
test updates under your policy.

## Static themes at build time

The same API generates a stylesheet in a build script, instead of hand-writing every role as in
[Re-brand: change a tone](./css-overrides.md#3-re-brand-change-a-tone):

```js
// scripts/build-theme.mjs
import { createTheme } from '@mainset/ui-core/theme';
import { writeFileSync } from 'node:fs';

writeFileSync(
  'src/app-theme.css',
  createTheme({ tones: { primary: '#0f766e' } }),
);
```

## What you can change at runtime

| Token family                                         | Runtime-safe? | How                                                                                                   |
| ---------------------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------- |
| tones (`--ms-color-{tone}-*`)                        | ✅            | `tones` in `createTheme()`; all roles are derived                                                     |
| neutrals (`--ms-color-bg-*`, `--ms-color-text-*`, …) | ✅            | `light` / `dark` in `createTheme()`                                                                   |
| radius, fonts, control sizes, motion                 | ✅            | `light` / `dark` (set both), or `document.documentElement.style.setProperty()` (scheme-independent)   |
| breakpoints (`--ms-breakpoint-*`)                    | ❌            | media queries are compiled in; the variables are read-only info for JS                                |
| a brand-new tone name                                | ❌            | tone classes are generated at build time, see [Changing the built-in tokens](./maintaining-tokens.md) |
