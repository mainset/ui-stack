# Token reference

Every design token is a CSS custom property on `:root`, prefixed `--ms-`. Values come from
`packages/ui-core/src/tokens/*.mts`, which is the source of truth: when this page and the code
disagree, the code is right.

**Scheme column:** "per scheme" tokens have different values in light and dark, so override them
with the [scheme-aware pattern](./css-overrides.md#scheme-aware-overrides). "global" tokens can be
overridden on `:root` alone.

## Colors

### Palette (Tier 1): global

Literal colors. Elements never read them directly; semantic tokens point at them.

| Token                                       | Value                                                    |
| ------------------------------------------- | -------------------------------------------------------- |
| `--ms-palette-white` / `-black`             | `rgb(255 255 255)` / `rgb(0 0 0)`                        |
| `--ms-palette-violet-400` / `-600` / `-800` | `rgb(181 89 255)` / `rgb(144 19 254)` / `rgb(92 11 186)` |
| `--ms-palette-red-600`                      | `rgb(215 34 38)`                                         |
| `--ms-palette-blue-600`                     | `rgb(37 99 235)`                                         |
| `--ms-palette-green-600`                    | `rgb(22 163 74)`                                         |
| `--ms-palette-yellow-500`                   | `rgb(234 179 8)`                                         |
| `--ms-palette-gray-{50…950}`                | Tailwind-like gray scale: 50, 100, 200 … 900, 950        |

### Neutral semantic tokens: per scheme

| Token                       | Light               | Dark               | Used for                     |
| --------------------------- | ------------------- | ------------------ | ---------------------------- |
| `--ms-color-bg-canvas`      | white               | gray-950           | page / theme-root background |
| `--ms-color-bg-surface`     | white               | gray-900           | cards, popovers              |
| `--ms-color-bg-subtle`      | gray-50             | gray-800           | quiet fills                  |
| `--ms-color-text-base`      | gray-800            | gray-100           | body text                    |
| `--ms-color-text-muted`     | gray-600            | gray-400           | secondary text               |
| `--ms-color-text-disabled`  | gray-400            | gray-600           |                              |
| `--ms-color-text-inverse`   | gray-50             | gray-900           | text on inverted fills       |
| `--ms-color-border-subtle`  | gray-200            | gray-800           | dividers                     |
| `--ms-color-border-default` | gray-300            | gray-700           | inputs, cards                |
| `--ms-color-border-strong`  | gray-500            | gray-500           |                              |
| `--ms-color-focus-ring`     | violet-600          | violet-400         | `:focus-visible` outline     |
| `--ms-shadow-color`         | `rgb(3 7 18 / 10%)` | `rgb(0 0 0 / 50%)` | used by `--ms-shadow-*`      |

### Tone roles: per scheme

`--ms-color-{tone}-{role}` for every tone × role:

- **Tones:** `primary` `secondary` `tertiary` `error` `info` `success` `warning` `base` `muted` `inverse`
- **Roles:** `solid` `solid-hover` `on-solid` `subtle` `subtle-hover` `border` `text`
- `--ms-color-transparent-solid-hover`: hover tint of the `transparent` tone

| Tone      | `solid` (light / dark) | `on-solid` (light / dark) |
| --------- | ---------------------- | ------------------------- |
| primary   | violet-600             | gray-50                   |
| secondary | violet-800             | gray-50                   |
| tertiary  | violet-400             | gray-50 / gray-950        |
| error     | red-600                | gray-50                   |
| info      | blue-600               | gray-50                   |
| success   | green-600              | gray-50                   |
| warning   | yellow-500             | gray-900                  |
| base      | gray-800 / gray-100    | gray-50 / gray-900        |
| muted     | gray-600 / gray-400    | gray-50 / gray-950        |
| inverse   | gray-50 / gray-900     | gray-800 / gray-50        |

`solid` and `on-solid` (and `border` / `text` for the neutral tones) point at palette variables.
The other roles are precomputed hex colors, see [Live theming](./live-theming.md#how-it-works).

### Current tone (`--ms-tone-*`): don't set globally

`--ms-tone-solid`, `-solid-hover`, `-on-solid`, `-subtle`, `-subtle-hover`, `-border`, `-text`.
They point at the active tone (default `primary`). `.ms-tone-{tone}` re-points them. Components
read them, and so can your CSS. Override them only together with a tone class
(`.my-thing.ms-tone-warning { --ms-tone-solid: … }`).

## Typography: global

| Token                                             | Values                                                      |
| ------------------------------------------------- | ----------------------------------------------------------- |
| `--ms-font-family-text-{sans,serif,mono}`         | system-ui stack / georgia stack / ui-monospace stack        |
| `--ms-font-weight-{regular,medium,semibold,bold}` | 400 / 500 / 600 / 700                                       |
| `--ms-font-size-text-{size}`                      | xxs 10px · xs 12 · sm 14 · base 16 · lg 20 · xl 24 · xxl 36 |
| `--ms-line-height-text-{size}`                    | paired with each font size                                  |
| `--ms-letter-spacing-text-{size}`                 | paired with each font size                                  |

## Spacing: global

| Token                                    | Values                                                                                                        |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `--ms-space-{key}`                       | key × 4px: `0` `0_5` `1` `1_5` `2` `2_5` `3` `4` `5` `6` `7` `8` `10` `12` `14` `16` `18` `20` `24` `28` `32` |
| `--ms-spacing-scale-element-{xs…xl}`     | 2 · 4 · 6 · 8 · 10 px                                                                                         |
| `--ms-spacing-scale-component-{xs…xl}`   | 12 · 16 · 20 · 24 · 28 px                                                                                     |
| `--ms-spacing-scale-block-{xs…xl}`       | 32 · 40 · 48 · 56 · 64 px                                                                                     |
| `--ms-spacing-scale-section-{xs…xl}`     | 72 · 80 · 96 · 112 · 128 px                                                                                   |
| `--ms-space-layout-{row,column}-{xs…xl}` | gaps: 8 · 16 · 24 · 32 · 48 px                                                                                |

Semantic spacing aliases point at `--ms-space-*`, so overriding one primitive moves every alias
that uses it.

## Shape and elevation: global

| Token                            | Values                                                                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `--ms-border-radius-{size}`      | xxs 2px · xs 4 · sm 8 · base 12 · lg 16 · xl 20 · xxl 24 · `pill` · `circle` (50%)                                        |
| `--ms-border-width-{size}`       | xs ~0.25px · sm ~0.5px · base 1px · lg 2px · xl 4px                                                                       |
| `--ms-shadow-{xs,sm,base,lg,xl}` | built from `--ms-shadow-color` (per scheme)                                                                               |
| `--ms-z-index-{name}`            | base 0 · dropdown 1000 · sticky 1100 · banner 1200 · overlay 1300 · modal 1400 · popover 1500 · toast 1600 · tooltip 1700 |

## Motion, focus, opacity: global

| Token                                      | Default                                               |
| ------------------------------------------ | ----------------------------------------------------- |
| `--ms-duration-{fast,base,slow}`           | 120 / 200 / 300 ms (0 under `prefers-reduced-motion`) |
| `--ms-easing-{standard,enter,exit}`        | cubic-bezier curves                                   |
| `--ms-focus-ring-width` / `-offset`        | 2px / 2px                                             |
| `--ms-opacity-{disabled,pressed,backdrop}` | 0.7 / 0.8 / 0.6                                       |

## Layout: global

| Token                      | Values                                                                                                                       |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `--ms-container-{size}`    | xs 320px · sm 576 · base 768 · lg 992 · xl 1200 (max widths)                                                                 |
| `--ms-breakpoint-{name}`   | sm 36rem · md 48rem · lg 62rem · xl 75rem. **Read-only**: media queries are compiled in, so overriding these changes nothing |
| `--ms-grid-columns-number` | 12                                                                                                                           |
| `--ms-container-gutter`    | side padding of `.ms-container`: 16px, 24px from `md`                                                                        |

## Component tokens (Tier 3): global

### Control (buttons, inputs, textareas, selects)

| Token                                                                            | Default                                               |
| -------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `--ms-control-radius`                                                            | `var(--ms-border-radius-sm)`                          |
| `--ms-control-gap`                                                               | `var(--ms-spacing-scale-element-base)` (icon ↔ label) |
| `--ms-control-height-{size}`                                                     | xs 24px · sm 28 · base 32 · lg 40 · xl 48             |
| `--ms-control-padding-inline-{size}`                                             | from the spacing scales                               |
| `--ms-control-font-size-{size}`, `-line-height-{size}`, `-letter-spacing-{size}` | from the typography tokens                            |

### Surface

| Token                 | Default                         | Note                                                           |
| --------------------- | ------------------------------- | -------------------------------------------------------------- |
| `--ms-surface-radius` | unset → `--ms-border-radius-sm` | set by `.ms-control`; set it on a surface to change its radius |

### Input (inputs, textareas, selects): per scheme

Declared on every theme root, because they point at scheme colors: override them with the
[scheme-aware pattern](./css-overrides.md#scheme-aware-overrides).

| Token                            | Default                          |
| -------------------------------- | -------------------------------- |
| `--ms-input-border-color`        | `var(--ms-color-border-default)` |
| `--ms-input-border-color-hover`  | `var(--ms-color-border-strong)`  |
| `--ms-input-background`          | `var(--ms-color-bg-surface)`     |
| `--ms-input-background-readonly` | `var(--ms-color-bg-subtle)`      |
| `--ms-input-placeholder-color`   | `var(--ms-color-text-muted)`     |

Focus uses `--ms-color-focus-ring`, the invalid state `--ms-color-error-border`.

### Checkbox, radio, switch

Checked colors follow the current tone (`--ms-tone-solid`, `--ms-tone-on-solid`), so
`.ms-tone-success` on a wrapper re-colors them.

| Token                      | Default                         | Scope      |
| -------------------------- | ------------------------------- | ---------- |
| `--ms-choice-size`         | 1rem (checkbox / radio box)     | global     |
| `--ms-switch-width`        | 2.25rem                         | global     |
| `--ms-switch-height`       | 1.25rem                         | global     |
| `--ms-switch-thumb-offset` | 0.1875rem (track ↔ thumb gap)   | global     |
| `--ms-switch-thumb-size`   | height − 2 × offset             | global     |
| `--ms-choice-border-color` | `var(--ms-color-border-strong)` | per scheme |
| `--ms-switch-track-color`  | `var(--ms-color-border-strong)` | per scheme |
| `--ms-switch-thumb-color`  | `var(--ms-color-bg-surface)`    | per scheme |

### Spinner

| Token                      | Default                                           |
| -------------------------- | ------------------------------------------------- |
| `--ms-spinner-size-{size}` | xs 12px · sm 16 · base 20 · lg 24 · xl 32         |
| `--ms-spinner-duration`    | 0.75s (×3 under `prefers-reduced-motion: reduce`) |

### Heading

`h1`–`h6` with `.ms-heading` take the text size of their level (h1 `xxl`, h2 `xl`, h3 `lg`,
h4 `base`, h5 `sm`, h6 `xs`) and `--ms-font-weight-semibold`. Any `txtSize` class overrides it.
