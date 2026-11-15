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
<!-- reset is optional -->
<link rel="stylesheet" href="@mainset/ui-core/styles/reset.css" />
<link rel="stylesheet" href="@mainset/ui-core/styles/index.css" />

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
//    ms-tone-error ms-control ms-control--size-sm ms-button"
```

| Entry                                    | Contents                                              |
| ---------------------------------------- | ----------------------------------------------------- |
| `@mainset/ui-core`                       | class-name configs, recipes, types, utils             |
| `@mainset/ui-core/styles/index.css`      | foundation + every element                            |
| `@mainset/ui-core/styles/foundation.css` | layer order + all design tokens + base layer          |
| `@mainset/ui-core/styles/reset.css`      | opt-in modern reset (`normalize.css` is an alias)     |
| `@mainset/ui-core/scss/mixins`           | `media-up()`, `responsive-variants`, helpers          |
| `@mainset/ui-core/scss/layers`           | the `@layer` order statement, for adapter stylesheets |

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

## Cascade layers

```css
@layer ms.reset, ms.tokens, ms.base, ms.components, ms.utilities;
```

Utilities (`bg*`, `brd*`, `txt*`, `spc*`, tones) always beat components; **any app CSS
written outside a layer beats everything** — overrides never need `!important`.

> Caveat: unlayered element selectors in an app (e.g. a global `button { padding: 0 }`)
> also win over mainset components. Put such resets in a layer (or before `ms.reset`).

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
(only `solid` / `on-solid` are declared — the rest is derived with `color-mix()`, so re-branding a tone is one value).

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

```html
<html data-theme="light | dark | system">
  <!-- nesting is supported -->
</html>
```

### Overriding tokens

App CSS written outside a layer always wins, so overrides are plain custom properties:

```css
/* 1. re-brand: change a palette value, everything built on it follows */
:root {
  --ms-palette-violet-600: #7c3aed;
}

/* 2. re-color one tone everywhere: hover / soft / border / text are derived from `solid` */
:root {
  --ms-color-warning-solid: #f59e0b;
}

/* 3. one tone of one component: target the element that carries the tone class */
.ms-button.ms-tone-warning {
  --ms-tone-solid: #f59e0b;
  --ms-tone-solid-hover: #d97706;
}
```

Where an override takes effect, and where it doesn't (custom properties resolve on the
element that declares them):

| Override                                                                     | Effect                                                         |
| ---------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `--ms-palette-*` / `--ms-color-*` on `:root`                                 | ✅ everywhere, derived tokens included                         |
| `--ms-color-{tone}-*` on an element that has `.ms-tone-{tone}` itself        | ✅ that element (only the overridden role, nothing re-derived) |
| `--ms-color-{tone}-*` on an element that **inherits** its tone from a parent | ❌ ignored — the tone was resolved on the parent               |
| `--ms-tone-*` on a component class, e.g. `.ms-button { … }`                  | ⚠️ applies to **every** tone of it — scope with `.ms-tone-*`   |
| `:root` overrides inside a nested `[data-theme]`                             | ❌ re-declared by that theme — also target `[data-theme]`      |

Per-component tokens (e.g. `--ms-button-radius`) are deliberately not exposed yet, in favour
of strict consistency between components; they can be added later without breaking changes.

## Responsive props

Layout props (`flx*`, `lay*`, `grd*`) accept a mobile-first object keyed by breakpoint
(industry vocabulary, as in Chakra / Panda / Tailwind: `base` 0 = default · `sm` 36rem ·
`md` 48rem · `lg` 62rem · `xl` 75rem):

```ts
flxDirection={{ base: 'column', md: 'row' }}
// → "ms-flex--flex-direction-column ms-flex--flex-direction-row@md"
```

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
