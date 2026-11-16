# @mainset/ui-core

Framework-agnostic foundation of the mainset UI: design tokens, CSS primitives and
"recipes" (style props in → class string out). `@mainset/react` is a thin adapter on top;
any other framework (or plain HTML) can use the same classes.

## Usage

**With a JS bundler** (React adapter, Vite, rspack, webpack…) — nothing to configure:
every element module imports its own CSS (plus the shared foundation), so the bundle
contains only the CSS of the elements in use.

**Without a bundler** (plain HTML, server templates, Vue/Svelte/…):

```html
<!-- the reset is optional; when used, load it first -->
<link rel="stylesheet" href="@mainset/ui-core/styles/reset.css" />
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

| Entry                                    | Contents                                          |
| ---------------------------------------- | ------------------------------------------------- |
| `@mainset/ui-core`                       | class-name configs, recipes, types, utils         |
| `@mainset/ui-core/styles/index.css`      | foundation + every element                        |
| `@mainset/ui-core/styles/index.min.css`  | the same, minified (for use without a bundler)    |
| `@mainset/ui-core/styles/foundation.css` | all design tokens + base styles + tone classes    |
| `@mainset/ui-core/styles/reset.css`      | opt-in modern reset (`normalize.css` is an alias) |
| `@mainset/ui-core/scss/mixins`           | `media-up()`, `responsive-variants`, helpers      |

## Single source of truth (codegen)

Token values (`src/tokens/*.mts`) and element options (every `*__CLASS_NAME_CONFIG`) are
defined **once, in TS**. `pnpm codegen` (run automatically by `build` / `dev`) emits
`src/styles/_generated.scss`, which Sass consumes:

- tokens → Sass maps → CSS custom properties
- class-name configs → one class per TS option (`options.each-class()` in `styles/_options.scss`)

Any drift fails the build — e.g. a TS option without CSS:
`` `ms-list` / `lstJustify`: option `stretch` is declared in TS but has no CSS ``.
`pnpm codegen:check` fails when the committed generated file is stale (use it in CI).
Requires Node ≥ 22.18 (native TS type stripping, no extra tooling).

## Browser support

Chrome / Edge ≥ 88, Firefox ≥ 78, Safari ≥ 14.1 (2021) — the oldest browsers with flex `gap`.
The targets live in the root `.browserslistrc`; both packages build against them
(syntax lowering + CSS prefixes), and `pnpm build` fails when the output still uses a newer
feature (`scripts/check-browser-support.mjs`).

Within that baseline the CSS avoids newer features on purpose: no `@layer` (2022), no
`color-mix()` (2023, derived colors are precomputed), no media range syntax, no `:has()`,
no container queries. Newer features may only be used as progressive enhancements that fail
on their own (e.g. `:user-invalid`, `:focus-visible`, `text-wrap` sit in their own rules or
declarations).

## Specificity (instead of cascade layers)

The priority is encoded in the selectors, so it holds in any CSS load order:

| Tier                                                              | Selector       | Specificity | Beaten by                                      |
| ----------------------------------------------------------------- | -------------- | ----------- | ---------------------------------------------- |
| reset, tokens, base styles                                        | `:where(…)`    | 0           | everything; the **reset must be loaded first** |
| components (surface, control, flex, …)                            | `:where(…)`    | 0           | any utility, tone or app class                 |
| utilities (`bg*`, `brd*`, `txt*`, `spc*`), tones                  | `.class`       | 0,1,0       | app CSS loaded after them                      |
| states that must beat variants (e.g. `.ms-control[aria-invalid]`) | `.class[attr]` | 0,2,0       | more specific app CSS                          |

**Any app class overrides a component** — no `!important`, no specificity games.
Components sharing an element never fight over a property: they hand values over through
custom properties instead (e.g. `.ms-control` sets `--ms-surface-radius` for `.ms-surface`).

> Caveats: an app's element selector (e.g. a global `button { padding: 0 }`) also beats
> components (0,0,1 > 0). And the reset is 0-specificity too, so loaded _after_ the
> components it would override them — always import it first.

## Tokens

| Tier         | Prefix                     | Example                                         |
| ------------ | -------------------------- | ----------------------------------------------- |
| 1. Palette   | `--ms-palette-*`           | `--ms-palette-violet-600`                       |
| 2. Semantic  | `--ms-color-*`             | `--ms-color-text-muted`, `--ms-color-bg-canvas` |
| 2. Tone      | `--ms-color-{tone}-{role}` | `--ms-color-error-subtle`                       |
| 3. Component | `--ms-{component}-*`       | `--ms-control-height-base`                      |

Other families: `--ms-font-*`, `--ms-border-radius-*`, `--ms-border-width-*`,
`--ms-shadow-*`, `--ms-z-index-*`, `--ms-duration-*` / `--ms-easing-*` (0 under
`prefers-reduced-motion`), `--ms-focus-ring-*`, `--ms-opacity-*`, `--ms-breakpoint-*`,
`--ms-container-*`.

### Spacing

One primitive scale on a 4px grid — the key × 4px is the value (Tailwind convention):
`--ms-space-0_5` 2px · `1` 4px · `1_5` 6px · `2` 8px · `2_5` 10px · `3` 12px · `4` 16px · `5` 20px ·
`6` 24px · `7` 28px · `8` 32px · `10` 40px · `12` 48px · `14` 56px · `16` 64px · `18` 72px ·
`20` 80px · `24` 96px · `28` 112px · `32` 128px.

Semantic tokens only alias into it, never own raw values:

| Semantic                                  | xs  | sm  | base | lg  | xl  |
| ----------------------------------------- | --- | --- | ---- | --- | --- |
| `--ms-spacing-scale-element-*`            | 2   | 4   | 6    | 8   | 10  |
| `--ms-spacing-scale-component-*`          | 12  | 16  | 20   | 24  | 28  |
| `--ms-spacing-scale-block-*`              | 32  | 40  | 48   | 56  | 64  |
| `--ms-spacing-scale-section-*`            | 72  | 80  | 96   | 112 | 128 |
| `--ms-space-layout-{column\|row}-*` (gap) | 8   | 16  | 24   | 32  | 48  |

### Breakpoints vs containers

Breakpoints (`--ms-breakpoint-*`, media queries, responsive props) say **where** the layout
changes; containers (`--ms-container-*`, e.g. `secMaxWidth`) say **how wide** content may grow.
Separate concepts, separate vocabularies:

| Breakpoint (`min-width`)  | `base` 0   | `sm` 576px | `md` 768px   | `lg` 992px | `xl` 1200px |
| ------------------------- | ---------- | ---------- | ------------ | ---------- | ----------- |
| **Container** (max-width) | `xs` 320px | `sm` 576px | `base` 768px | `lg` 992px | `xl` 1200px |

### Tones × variants

Tones: `primary secondary tertiary error info success warning base muted inverse transparent`.
Each tone exposes the same contract: `solid | solid-hover | on-solid | subtle | subtle-hover | border | text`
(only `solid` / `on-solid` are declared in TS — the rest is derived by Sass at build time, in `oklab`, as plain colors).

Components never read a specific tone; they read the **inherited** `--ms-tone-*` contract.
`.ms-tone-{tone}` re-points it for an element and its whole subtree (default: `primary`):

```html
<div class="ms-surface ms-surface--variant-soft ms-tone-error">
  <!-- both buttons are "error" without any prop -->
  <button class="ms-surface ms-surface--variant-solid ms-control ms-button">
    Retry
  </button>
</div>
```

Surface variants: `solid | soft | outlined | ghost`.

### Theming

Full guides (CSS overrides, React, live theming, token reference): [`docs/theming`](../../docs/theming/README.md).

Brand colors known only at runtime (per tenant, user-picked): `createTheme()` derives every tone
role from one color, exactly like the build, and returns the CSS
(`@mainset/ui-core/theme`, no CSS imports, runs in Node and the browser):

```ts
import { applyTheme, createTheme } from '@mainset/ui-core/theme';

createTheme({ tones: { primary: '#0f766e' } }); // CSS text, e.g. for SSR
applyTheme({ tones: { primary: '#0f766e' } }); // browser: writes <style id="ms-theme">
```

```html
<html data-theme="light | dark | system">
  <!-- nesting is supported -->
</html>
```

### Overriding tokens

Overrides are plain custom properties in app CSS:

```css
/* 1. re-brand: change a palette value */
:root {
  --ms-palette-violet-600: #7c3aed;
}

/* 2. re-color one tone everywhere */
:root {
  --ms-color-warning-solid: #f59e0b;
  --ms-color-warning-solid-hover: #d97706;
  --ms-color-warning-subtle: #fef3c7;
  --ms-color-warning-subtle-hover: #fde68a;
}

/* 3. one tone of one component: target the element that carries the tone class */
.ms-button.ms-tone-warning {
  --ms-tone-solid: #f59e0b;
  --ms-tone-solid-hover: #d97706;
}
```

Derived roles (`solid-hover`, `subtle`, `subtle-hover`, and the tinted dark-scheme `border` / `text`)
are **precomputed at build time** as plain colors — no runtime `color-mix()`, so they work in every
supported browser. Overriding `solid` at runtime therefore doesn't re-derive them: override those
roles too (as above), or change the token in `src/tokens/color.tokens.mts` and rebuild.

Where an override takes effect, and where it doesn't (custom properties resolve on the
element that declares them):

| Override                                                                     | Effect                                                                       |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `--ms-palette-*` / `--ms-color-*` on `:root`                                 | ✅ everywhere (derived roles only when overridden themselves)                |
| `--ms-color-{tone}-*` on an element that has `.ms-tone-{tone}` itself        | ✅ that element                                                              |
| `--ms-color-{tone}-*` on an element that **inherits** its tone from a parent | ❌ ignored — the tone was resolved on the parent                             |
| `--ms-tone-*` on a component class, e.g. `.ms-button { … }`                  | ⚠️ applies to **every** tone of it — scope with `.ms-tone-*`                 |
| `:root` overrides inside a nested `[data-theme]`                             | ⚠️ kept only where both schemes share the value — also target `[data-theme]` |

Per-component tokens (e.g. `--ms-button-radius`) are deliberately not exposed yet, in favour
of strict consistency between components; they can be added later without breaking changes.

## Responsive props

Layout props accept a mobile-first object keyed by breakpoint (industry vocabulary, as in
Chakra / Panda / Tailwind: `base` 0 = default · `sm` 36rem · `md` 48rem · `lg` 62rem · `xl` 75rem).
A breakpoint's value applies from that width up, until a larger breakpoint sets its own.

**Only props that change the layout are responsive** — direction, display, wrap, justify, align,
gap, padding / margin (and, later, columns). Props that only change the look — tone, color,
radius, font weight, control size — never are: a button doesn't change color on a phone.

How a prop scales depends on its number of options (`responsive` in its TS config):

| `responsive` | For                                                                                                         | Per breakpoint                     | CSS cost              |
| ------------ | ----------------------------------------------------------------------------------------------------------- | ---------------------------------- | --------------------- |
| `'class'`    | few options: `flxDisplay`, `flxDirection`, `flxWrap`, `grdDisplay`, `grdAutoFlow`, `layJustify`, `layAlign` | a class per option                 | options × breakpoints |
| `'css-var'`  | many options: `layGapSize`, spacing (`spcSize`, `spcSizes`)                                                 | one class + an inline CSS variable | 1 rule per breakpoint |

```ts
flxDirection={{ base: 'column', md: 'row' }}
// → class "ms-flex--flex-direction-column ms-flex--flex-direction-row@md"

layGapSize={{ base: 'xs', md: 'xl' }}
// → class "ms-layout--gap-size-xs ms-layout--gap-size@md"
//   style "--ms-layout-gap-size-at-md: var(--ms-space-layout-row-xl) var(--ms-space-layout-column-xl)"

spcType="pv" spcScale="section" spcSize={{ base: 'xs', md: 'lg' }}
// → class "ms-spacing--pv-section-xs ms-spacing--pv@md"
//   style "--ms-spacing-pv-at-md: var(--ms-spacing-scale-section-lg)"
```

A plain (non-object) value is always a class only — no inline style. The `base` value of an
object is that same class; the variables carry only the other breakpoints, so the CSS doesn't
grow with the number of sizes (spacing: 56 extra rules instead of ~1,180).

Without React, take both parts from the recipe and put the style on the element:

```ts
const { className, style } = composeStyleProps(
  [FLEX_CONTAINER__CLASS_NAME_CONFIG, LAYOUT__CLASS_NAME_CONFIG],
  {
    flxDirection: { base: 'column', md: 'row' },
    layGapSize: { base: 'xs', md: 'xl' },
  },
);
// spacing: spacingStyleProps({ ... }) → { className, style }
```

`composeClassNames()` / `spacingRecipe()` return the class string only, like every `*Recipe()`;
with an object value of a `css-var` prop the breakpoint class then has no value (a dev-only
console warning says so), so use `composeStyleProps()` / `spacingStyleProps()` there.
Only declared options become inline variables; unknown values are skipped.

> **CSP:** the variables are inline `style` attributes. React sets them through the DOM API
> (allowed by a strict `style-src`), but server-rendered HTML carries them as attributes, which
> a CSP without `'unsafe-inline'` for styles blocks. Plain values are classes and unaffected.

## Background: token strategy

The best and most scalable strategy for handling color tokens in a modern UI kit is using a multi-tiered design token system (often referred to as an "Aliasing" or "Semantic" system).

Standardizing on just literal names (`blue-500`) or just context names (`primary-500`) both present problems at scale. Instead, the industry standard (used by Material Design, Atlassian, GitHub, and Figma) is to use both in a strict hierarchy.

### The 3-Tier Strategy

Here is the 3-Tier strategy that will give you infinite flexibility and perfect multi-theme support:

#### Level 1: Primitive Tokens (The Palette)

These are your literal, literal base colors. They describe exactly what the color is, completely independent of how it is used. They should never change meaning.

- **Naming:** `color-[name]-[scale]`
- **Examples:** `--blue-100`, `--blue-500`, `--gray-900`, `--red-500`.
- **Rule:** Never use these directly in your component CSS. If you put `background: var(--blue-500)` in a `Button`, it's impossible to switch that button to "Purple" in a new theme without overriding the button's internal CSS.

#### Level 2: Semantic Tokens (The Intent / Context)

This is the magic layer. Semantic tokens describe how or where the color is used, but not what the actual color is. They act as a bridge, pointing to your Primitive Tokens.

- **Naming:** `color-[category]-[variant/state]`
- **Examples:** `--color-text-primary`, `--color-bg-surface`, `--color-border-subtle`, `--color-action-primary-hover`, `--color-feedback-danger`.
- **Rule:** This is what you use in your CSS Modules.

#### Level 3: Component Tokens (Optional, but great for UI Kits)

For ultimate flexibility in a commercial UI kit, you map Semantic Tokens to specific Component Tokens.

- **Naming:** `[component]-[element]-[state]`
- **Examples:** `--button-bg-primary-hover`

---

### How this actually works for Multiple Themes

The beauty of this system is that when you switch themes (Light vs. Dark, or Brand A vs. Brand B), you only change the Level 2 (Semantic) pointers. Your components never change.

```css
/* 1. Primitive Tokens (Never change) */
:root {
  --blue-500: #3b82f6;
  --blue-600: #2563eb;
  --gray-50: #f9fafb;
  --gray-900: #111827;
  --red-500: #ef4444;
}

/* 2. Semantic Tokens - DEFAULT (Light Theme) */
:root,
[data-theme='light'] {
  --color-bg-base: var(--gray-50);
  --color-text-primary: var(--gray-900);

  --color-action-primary: var(--blue-500);
  --color-action-primary-hover: var(--blue-600);

  --color-feedback-error: var(--red-500);
}

/* 2. Semantic Tokens - DARK THEME */
[data-theme='dark'] {
  /* We flip the background and text... */
  --color-bg-base: var(--gray-900);
  --color-text-primary: var(--gray-50);

  /* Action colors might stay the same, or shift to a lighter blue */
  --color-action-primary: var(--blue-600);
}

/* 2. Semantic Tokens - "HALLOWEEN" THEME */
[data-theme='halloween'] {
  /* The layout remains identical, but the meaning of "primary" changes */
  --color-action-primary: var(--orange-500);
  --color-bg-base: var(--black);
}
```

Then, in your React CSS Module (`Button.module.scss`):

```css
.button {
  background-color: var(--color-action-primary);
  color: var(--color-text-primary);
  /* The button doesn't know if it's blue, orange, light, or dark.
     It just knows it needs the "Primary Action" color. */
}

.button:hover {
  background-color: var(--color-action-primary-hover);
}
```

### Why `primary-500` is a trap

Many frameworks use `primary-100` through `primary-900`. But what exactly is `primary-100` used for? Is it a background for a badge? Is it text?

If `primary-900` goes on `primary-100` in light mode, does that invert in dark mode (where `primary-100` text goes on a `primary-900` background)? You end up writing crazy CSS rules trying to invert scales.

By using exact semantic intents (`--color-text-primary-on-brand`, `--color-bg-surface`), Dark Mode just means pointing that variable to a different Primitive Hex code.

---

### Recommended Naming Taxonomy

A great format used by many enterprise teams is:
`[Category]-[Concept]-[Property]-[Variant]-[State]`

- **Category:** `color`, `space`, `font`
- **Concept:** `action`, `feedback`, `surface`, `text`, `border`
- **Property/Context:** `primary`, `secondary`, `success`, `danger`
- **State:** `default` (implied), `hover`, `active`, `disabled`

**Examples:**

- `color-text-danger`
- `color-bg-surface-hover`
- `color-border-subtle`

---

#### 1. Category (The "What")

The foundational type of the design token.

- `color`: Hex, RGB, or HSL values.
- `font`: Typography properties (often split into `font-size`, `font-weight`, `font-family`, `line-height`).
- `space`: Padding, margins, layout.
- `radius`: Border-radius.
- `elevation`: Box-shadows or z-index.
- `opacity`: Alpha transparency.
- `duration`: Animation or transition timings.

#### 2. Concept (The "Where")

The structural UI element the category is applied to.

- `bg` (or `surface`): Backgrounds of containers, cards, and pages.
- `text` (or `fg`): Typography and text content.
- `border` (or `stroke`): Outlines, dividers, and component borders.
- `icon`: SVGs and glyphs.
- `action`: Interactive elements like buttons, tabs, or links.
- `feedback`: Alerts, toasts, and validation states.

#### 3. Property / Context (The "Intent")

The semantic meaning or brand role of the element.

- **Brand Roles:** `primary`, `secondary`, `tertiary`, `brand`.
- **Neutral Roles:** `neutral`, `base`, `inverse` (e.g., white text on dark bg).
- **Feedback Roles:** `success` (green), `danger` / `error` (red), `warning` (yellow), `info` (blue).

#### 4. Variant (The "Scale or Prominence")

The magnitude, emphasis, or numeric scale of the token.

- **Emphasis:** `subtle`, `strong`, `muted`, `bold`, `heavy`.
- **T-Shirt Sizes (for fonts, spacing, radius):** `xxs`, `xs`, `sm`, `md`, `lg`, `xl`, `xxl`.
- **Numeric Scale (often for raw colors or weights):** `100`, `200`, `300` ... `900`.

#### 5. State (The "Interaction")

The user pseudo-class. If it is the default state, this slot is completely omitted.

- _(default)_
- `hover`: Mouse over.
- `active`: Mouse pressed down / tapping.
- `focus`: Keyboard navigation focus.
- `disabled`: Non-interactive state.
- `selected`: Active tab or checked checkbox.
