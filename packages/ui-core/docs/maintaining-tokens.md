# Changing the built-in tokens

This page is for **maintainers of this repo**, who change what `@mainset/ui-core` ships by
default. Product teams should override tokens instead, see
[Theming with CSS](./css-overrides.md); no fork needed.

## Where each value lives

| What                                              | Source (edit this)                                           | Generated?        |
| ------------------------------------------------- | ------------------------------------------------------------ | ----------------- |
| palette, tones, neutral scheme colors             | `packages/ui-core/src/tokens/color.tokens.mts`               | yes, via codegen  |
| spacing primitives, scales, layout gaps           | `packages/ui-core/src/tokens/spacing.tokens.mts`             | yes               |
| radius, border widths                             | `packages/ui-core/src/tokens/border.tokens.mts`              | yes               |
| breakpoints, containers, z-index                  | `packages/ui-core/src/tokens/layout.tokens.mts`              | yes               |
| how derived tone roles are mixed (hover, subtle…) | `TONE_DERIVATION__TOKENS` in `color.tokens.mts`              | yes               |
| the derivation itself (oklab mixing)              | `packages/ui-core/src/theme/derive.mts`, `color.mts`         | shipped as JS too |
| fonts, motion, focus ring, opacity                | `packages/ui-core/src/styles/foundation.scss`                | no (Sass)         |
| control sizes and radius                          | `packages/ui-core/src/elements/control/_control.tokens.scss` | no (Sass)         |

TS tokens are the single source of truth: `pnpm codegen` (run by `build` and `dev`) writes
`src/styles/_generated.scss`, and Sass turns it into custom properties and classes. Never edit
`_generated.scss` by hand.

## Workflow

```sh
cd packages/ui-core
pnpm codegen            # regenerate _generated.scss after a TS token change
pnpm build              # build + minify + browser-support guard
pnpm codegen:check      # fails if the committed generated file is stale (CI)
```

Commit the regenerated `_generated.scss` together with the token change.

## Recipes

### Change a brand color

Edit the palette value. Every tone pointing at it, including its derived roles, is recomputed:

```ts
// color.tokens.mts
const PALETTE__TOKENS = {
  'violet-600': 'rgb(124 58 237)',
  …
};
```

### Point a tone at another color

```ts
const TONE__TOKENS = {
  primary: {
    light: { solid: 'teal-700', 'on-solid': 'gray-50' },
    dark: { solid: 'teal-500', 'on-solid': 'gray-950' },
  },
  …
};
```

Add the palette color first (`'teal-700': 'rgb(15 118 110)'`). Only `solid` and `on-solid` are
required; `text` and `border` are optional and default to `solid` (light) or a tint toward
white (dark). Check `on-solid` contrast: at least 4.5:1 for small text.

### Add a tone

1. Add the name to `TONE__OPTIONS` and a light + dark definition to `TONE__TOKENS` (the
   `satisfies` check fails until both schemes exist).
2. `pnpm codegen && pnpm build`.

That alone generates `.ms-tone-{tone}`, the `--ms-color-{tone}-*` roles in both schemes, the
`bgColor` / `txtColor` / `brdColor` classes, and the TS types (`ElementColor`, so `srfTheme`,
`bgColor` etc. autocomplete it in React). Every tone adds CSS to the foundation, which every
bundle ships, so report the size change in the PR.

### Add a neutral semantic token

Add a key to both schemes in `SCHEME__TOKENS` (e.g. `'bg-overlay': 'gray-900'`). It becomes
`--ms-color-bg-overlay`, light in full and dark only where it differs.

### Change the derivation

`TONE_DERIVATION__TOKENS` in `color.tokens.mts` sets how far `solid` is mixed toward
black/white/canvas for each role, per scheme. The mixing runs in `deriveToneRoles()`
(`src/theme/derive.mts`), which both codegen (the shipped CSS) and `createTheme()` (runtime
themes) call, so the two can't drift. Codegen writes the computed values into
`$scheme-token-map` in `_generated.scss`; Sass only prints them.

A derivation change is a visual change for every product: compare `dist/esm/styles/foundation.css`
before and after, and report it in the PR.

## Constraints

- **Browser baseline (2021):** Chrome 88, Firefox 78, Safari 14.1. No `@layer`, `color-mix()`,
  `:has()`, container queries or media range syntax in shipped CSS; the build guard fails
  otherwise. That's why derived colors are precomputed.
- **0 specificity:** token and component rules stay inside `:where()`, so app overrides always win.
- **Keep customization hooks:** don't remove or rename a public `--ms-*` token without calling it
  out as a breaking change and offering a migration path.
- **Per-component color tokens** (e.g. `--ms-button-bg`) are deliberately absent. If one is
  needed, add it with a fallback so `:root`, subtree and element overrides all work:
  `var(--ms-button-radius, var(--ms-control-radius))`.
