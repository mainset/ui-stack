# Live theming (runtime)

Users can pick a brand color in the browser, for example with `<input type="color">`, and the
whole UI re-themes instantly. No rebuild, no page reload, no extra CSS shipped.

## How it works

1. Tones are CSS custom properties, so new values apply on the next frame.
2. ui-core precomputes the derived roles (hover, subtle, dark-mode text/border) at build time,
   because the 2021 browser baseline has no `color-mix()`. At runtime **you compute them**,
   with the helper below. It uses the same oklab math as the build, so the output is identical
   (`toneTokens('primary', '#9013fe')` returns exactly the shipped CSS values).
3. The values go into one `<style>` element using the
   [scheme-aware pattern](./ui-core.md#scheme-aware-overrides), so light, dark, `system` and
   nested `data-theme` subtrees all update.

A `<style>` element rather than `documentElement.style.setProperty()`: an inline style on
`<html>` applies the same value in light and dark, and doesn't reach nested `[data-theme]`
elements, which re-declare their scheme values.

## The helper

Copy it into your app as `mainset-theme.mjs` (or `.ts`). It has no dependencies, runs in the
browser or Node, and is about 1.5 KB gzipped.

```js
// mainset-theme.mjs — derives every tone role from one color, exactly like ui-core's build
// (oklab mixing, rounded to sRGB). No dependencies, runs in browsers from 2020 and in Node.

const LIGHT_TEXT = '#f9fafb'; // --ms-palette-gray-50
const DARK_TEXT = '#111827'; // --ms-palette-gray-900

const toLinear = (c) =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const toGamma = (c) =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;

function hexToLinearRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return [n >> 16, (n >> 8) & 255, n & 255].map((v) => toLinear(v / 255));
}

function linearRgbToOklab([r, g, b]) {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function oklabToHex([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const rgb = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return `#${rgb
    .map((c) => Math.round(Math.min(1, Math.max(0, toGamma(c))) * 255))
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('')}`;
}

/** `amount` (0..1) of `color`, the rest of `target`, mixed in oklab */
function mix(color, amount, target) {
  const c = linearRgbToOklab(hexToLinearRgb(color));
  const t = linearRgbToOklab(hexToLinearRgb(target));
  return oklabToHex(c.map((v, i) => v * amount + t[i] * (1 - amount)));
}

/** WCAG 2 contrast ratio */
function contrast(x, y) {
  const lum = (hex) => {
    const [r, g, b] = hexToLinearRgb(hex);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const [hi, lo] = [lum(x), lum(y)].sort((p, q) => q - p);
  return (hi + 0.05) / (lo + 0.05);
}

/** Light text on `solid` unless dark text reads better (e.g. yellow) */
function pickOnSolid(solid) {
  return contrast(solid, LIGHT_TEXT) >= contrast(solid, DARK_TEXT)
    ? LIGHT_TEXT
    : DARK_TEXT;
}

/**
 * Every `--ms-color-{tone}-*` role for both schemes, from one `#rrggbb` color.
 * `canvasLight` / `canvasDark` are the page backgrounds the subtle roles are mixed against.
 */
export function toneTokens(
  tone,
  solid,
  {
    onSolid = pickOnSolid(solid),
    canvasLight = '#ffffff',
    canvasDark = '#030712',
  } = {},
) {
  const p = `--ms-color-${tone}`;
  return {
    light: {
      [`${p}-solid`]: solid,
      [`${p}-solid-hover`]: mix(solid, 0.85, '#000000'),
      [`${p}-on-solid`]: onSolid,
      [`${p}-subtle`]: mix(solid, 0.12, canvasLight),
      [`${p}-subtle-hover`]: mix(solid, 0.2, canvasLight),
      [`${p}-border`]: solid,
      [`${p}-text`]: solid,
    },
    dark: {
      [`${p}-solid`]: solid,
      [`${p}-solid-hover`]: mix(solid, 0.85, '#ffffff'),
      [`${p}-on-solid`]: onSolid,
      [`${p}-subtle`]: mix(solid, 0.18, canvasDark),
      [`${p}-subtle-hover`]: mix(solid, 0.28, canvasDark),
      [`${p}-border`]: mix(solid, 0.7, '#ffffff'),
      [`${p}-text`]: mix(solid, 0.55, '#ffffff'),
    },
  };
}

const block = (selector, vars) =>
  `${selector}{${Object.entries(vars)
    .map(([name, value]) => `${name}:${value}`)
    .join(';')}}`;

/**
 * CSS text for the scheme-aware override pattern.
 * @example themeCss({ primary: '#0f766e', error: '#be123c' }, { '--ms-color-focus-ring': '#0f766e' })
 */
export function themeCss(tones, extra = {}) {
  const light = { ...extra };
  const dark = { ...extra };

  Object.keys(tones).forEach((tone) => {
    const tokens = toneTokens(tone, tones[tone]);
    Object.assign(light, tokens.light);
    Object.assign(dark, tokens.dark);
  });

  return [
    block(":root,[data-theme='light'],[data-theme='system']", light),
    block("[data-theme='dark']", dark),
    `@media (prefers-color-scheme: dark){${block("[data-theme='system']", dark)}}`,
  ].join('\n');
}

/** Creates (once) or updates the `<style>` element that holds the runtime theme */
export function applyTheme(tones, extra, id = 'ms-runtime-theme') {
  let style = document.getElementById(id);
  if (!style) {
    style = document.createElement('style');
    style.id = id;
    document.head.appendChild(style);
  }
  style.textContent = themeCss(tones, extra);
}
```

`on-solid` is picked automatically by WCAG contrast (light `gray-50` or dark `gray-900` text).
That can differ from a hand-picked default: green-600 gets dark text, because light text on it
is only 3.2:1. Pass `{ onSolid }` to `toneTokens()` to force one.

## Plain JS

```html
<input type="color" id="brand" value="#9013fe" />

<script type="module">
  import { applyTheme } from './mainset-theme.mjs';

  document.getElementById('brand').addEventListener('input', (event) => {
    const color = event.target.value;
    applyTheme({ primary: color }, { '--ms-color-focus-ring': color });
  });
</script>
```

`input` fires while the user drags in the color picker, so the page follows the cursor.

## React

```tsx
import React from 'react';

import { applyTheme } from './mainset-theme.mjs';

type Tones = Partial<
  Record<
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning',
    string
  >
>;

function useRuntimeTheme(tones: Tones) {
  const key = JSON.stringify(tones);

  React.useLayoutEffect(() => {
    applyTheme(
      tones,
      tones.primary ? { '--ms-color-focus-ring': tones.primary } : {},
    );
  }, [key]);
}

function ThemeEditor() {
  const [primary, setPrimary] = React.useState('#9013fe');
  useRuntimeTheme({ primary });

  return (
    <input
      type="color"
      value={primary}
      onChange={(e) => setPrimary(e.target.value)}
    />
  );
}
```

React's `onChange` on a color input fires on every move, like the DOM `input` event.

### Persisting and SSR

- Store the user's colors (`localStorage`, the user profile) and call `applyTheme()` before the
  first render to avoid a flash of the default brand.
- On the server, render `themeCss(tones)` into a `<style>` tag in `<head>`; `applyTheme()` then
  only updates it on the client. Pass the same `id` (`ms-runtime-theme`) to reuse the element.
- A strict CSP (`style-src` without `'unsafe-inline'`) blocks inline `<style>` tags, including
  one created by `applyTheme()`. Server-render the tag with your CSP nonce
  (`<style id="ms-runtime-theme" nonce="…">`) so the helper reuses it, and test the updates
  under your policy.

## What you can change at runtime

| Token family                                         | Runtime-safe? | Note                                                                                                       |
| ---------------------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------- |
| tones (`--ms-color-{tone}-*`)                        | ✅            | via `toneTokens()` / `applyTheme()`, all roles at once                                                     |
| neutrals (`--ms-color-bg-*`, `--ms-color-text-*`, …) | ✅            | pass them in `extra`, but they then apply to both schemes; for per-scheme values build the blocks yourself |
| radius, fonts, control sizes, motion                 | ✅            | `document.documentElement.style.setProperty(name, value)` is fine (scheme-independent)                     |
| breakpoints (`--ms-breakpoint-*`)                    | ❌            | media queries are compiled in; the variables are read-only info for JS                                     |
| a brand-new tone name                                | ❌            | tone classes are generated at build time, see [Changing the built-in tokens](./maintaining-tokens.md)      |

When the canvas changes a lot (e.g. a sepia page), pass it so the subtle roles are mixed
against it: `toneTokens('primary', color, { canvasLight: '#fbf4e6' })`.
