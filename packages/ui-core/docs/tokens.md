# Token reference

Every design token is a CSS custom property on `:root`, prefixed `--ms-`. Values come from
`packages/ui-core/src/tokens/*.mts`, which is the source of truth: when this page and the code
disagree, the code is right.

**Scheme column:** "per scheme" tokens have different values in light and dark, so override them
with the [scheme-aware pattern](./css-overrides.md#scheme-aware-overrides). "global" tokens can be
overridden on `:root` alone.

## Colors

### Palette (Tier 1): global

Literal colors. Elements never read them directly; semantic tokens point at them. `violet-600`
(`#8b14fd`) is the mainset brand purple, the default `primary`.

| Token                                       | Value                                                             |
| ------------------------------------------- | ----------------------------------------------------------------- |
| `--ms-palette-white` / `-black`             | `rgb(255 255 255)` / `rgb(0 0 0)`                                 |
| `--ms-palette-violet-400` / `-600` / `-800` | `rgb(181 89 255)` / `rgb(139 20 253)` / `rgb(92 11 186)`          |
| `--ms-palette-red-600`                      | `rgb(215 34 38)`                                                  |
| `--ms-palette-blue-600`                     | `rgb(37 99 235)`                                                  |
| `--ms-palette-green-600`                    | `rgb(22 163 74)`                                                  |
| `--ms-palette-yellow-500`                   | `rgb(234 179 8)`                                                  |
| `--ms-palette-gray-{50…950}`                | gray scale: 50, 100, 200 … 900, 950, and 450 (dark `text-subtle`) |

### Neutral semantic tokens: per scheme

| Token                       | Light               | Dark               | Used for                     |
| --------------------------- | ------------------- | ------------------ | ---------------------------- |
| `--ms-color-bg-canvas`      | white               | gray-950           | page / theme-root background |
| `--ms-color-bg-surface`     | white               | gray-900           | cards, popovers              |
| `--ms-color-bg-subtle`      | gray-50             | gray-800           | quiet fills                  |
| `--ms-color-text-base`      | gray-800            | gray-100           | body text                    |
| `--ms-color-text-muted`     | gray-600            | gray-400           | secondary text               |
| `--ms-color-text-subtle`    | gray-500            | gray-450           | captions, meta (still AA)    |
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

| Token                                                              | Values                                                              |
| ------------------------------------------------------------------ | ------------------------------------------------------------------- |
| `--ms-font-family-text-{sans,serif,mono}`                          | system-ui stack / georgia stack / ui-monospace stack                |
| `--ms-font-weight-{regular,medium,semibold,bold}`                  | 400 / 500 / 600 / 700                                               |
| `--ms-font-size-text-{size}`                                       | xxs 10px · xs 12 · sm 14 · base 16 · lg 20 · xl 24 · xxl 36         |
| `--ms-line-height-text-{size}`                                     | paired with each font size                                          |
| `--ms-letter-spacing-text-{size}`                                  | paired with each font size                                          |
| `--ms-font-size-display-{sm,base,lg}`                              | fluid: 30→36px · 36→60px · 48→72px (`clamp()`)                      |
| `--ms-line-height-display-*` / `--ms-letter-spacing-display-*`     | paired with each display size                                       |
| `--ms-line-height-{tight,relaxed}`                                 | 1.2 / 1.625 (`txtLeading`)                                          |
| `--ms-overline-{font-family,font-size,font-weight,letter-spacing}` | mono · xs · medium · 0.16em (`txtVariant="overline"`)               |
| `--ms-scroll-offset`                                               | 0: room kept above in-page anchor targets (a fixed header's height) |

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

| Token                                           | Default                                                               |
| ----------------------------------------------- | --------------------------------------------------------------------- |
| `--ms-duration-{fast,base,slow,slower,slowest}` | 120 / 200 / 300 / 500 / 800 ms (0 under `prefers-reduced-motion`)     |
| `--ms-easing-{standard,enter,exit,emphasized}`  | cubic-bezier curves; `emphasized` is a long, soft landing (entrances) |
| `--ms-focus-ring-width` / `-offset`             | 2px / 2px                                                             |
| `--ms-opacity-{disabled,pressed,backdrop}`      | 0.7 / 0.8 / 0.6                                                       |

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

### Overlay, dialog, drawer

| Token                        | Default                                                | Scope      |
| ---------------------------- | ------------------------------------------------------ | ---------- |
| `--ms-overlay-gutter`        | `component-base` (around a centered dialog)            | global     |
| `--ms-dialog-size-{size}`    | xs 20rem · sm 25 · base 32 · lg 48 · xl 64 · full 100% | global     |
| `--ms-dialog-padding`        | `component-base`                                       | global     |
| `--ms-dialog-gap`            | `component-xs`                                         | global     |
| `--ms-dialog-radius`         | `var(--ms-border-radius-lg)`                           | global     |
| `--ms-dialog-shadow`         | `var(--ms-shadow-xl)`                                  | global     |
| `--ms-dialog-enter-distance` | `var(--ms-space-12)` (a drawer's slide)                | global     |
| `--ms-dialog-background`     | `var(--ms-color-bg-surface)`                           | per scheme |
| `--ms-dialog-color`          | `var(--ms-color-text-base)`                            | per scheme |

### Popover, menu, tooltip

| Token                                    | Default                                                           | Scope      |
| ---------------------------------------- | ----------------------------------------------------------------- | ---------- |
| `--ms-popover-max-width`                 | 20rem                                                             | global     |
| `--ms-popover-padding`                   | `component-xs`                                                    | global     |
| `--ms-popover-radius`                    | `var(--ms-border-radius-base)`                                    | global     |
| `--ms-popover-shadow`                    | `var(--ms-shadow-lg)`                                             | global     |
| `--ms-popover-gutter`                    | `element-xl` (to the viewport)                                    | global     |
| `--ms-popover-background`                | `var(--ms-color-bg-surface)`                                      | per scheme |
| `--ms-popover-border-color`              | `var(--ms-color-border-subtle)`                                   | per scheme |
| `--ms-popover-color`                     | `var(--ms-color-text-base)`                                       | per scheme |
| `--ms-menu-min-width` / `-max-height`    | 10rem / 20rem                                                     | global     |
| `--ms-menu-padding`                      | `element-sm`                                                      | global     |
| `--ms-menu-item-gap` / `-padding-*`      | `element-lg` / `element-base` `element-lg`                        | global     |
| `--ms-menu-item-radius`                  | `var(--ms-border-radius-xs)`                                      | global     |
| `--ms-menu-item-background-highlight`    | `var(--ms-color-bg-subtle)`                                       | per scheme |
| `--ms-menu-separator-color`              | `var(--ms-color-border-subtle)`                                   | per scheme |
| `--ms-menu-group-label-color`            | `var(--ms-color-text-muted)`                                      | per scheme |
| `--ms-tooltip-max-width`                 | 16rem                                                             | global     |
| `--ms-tooltip-padding-block` / `-inline` | `element-sm` / `element-lg`                                       | global     |
| `--ms-tooltip-radius`                    | `var(--ms-border-radius-xs)`                                      | global     |
| `--ms-tooltip-background` / `-color`     | the `base` tone's solid / on-solid (dark on light, light on dark) | per scheme |

### Tabs and disclosure

| Token                                       | Default                         | Scope      |
| ------------------------------------------- | ------------------------------- | ---------- |
| `--ms-tabs-gap`                             | `component-xs`                  | global     |
| `--ms-tabs-tab-padding-block` / `-inline`   | `element-lg` / `element-xl`     | global     |
| `--ms-tabs-indicator-width`                 | `var(--ms-border-width-lg)`     | global     |
| `--ms-tabs-list-border-width`               | `var(--ms-border-width-base)`   | global     |
| `--ms-tabs-list-border-color`               | `var(--ms-color-border-subtle)` | per scheme |
| `--ms-tabs-tab-color` / `-color-hover`      | text muted / text base          | per scheme |
| `--ms-disclosure-gap`                       | `component-xs`                  | global     |
| `--ms-disclosure-padding-block` / `-inline` | `component-xs` / 0              | global     |
| `--ms-disclosure-icon-size`                 | 0.5em                           | global     |
| `--ms-disclosure-border-width`              | `var(--ms-border-width-base)`   | global     |
| `--ms-disclosure-border-color`              | `var(--ms-color-border-subtle)` | per scheme |
| `--ms-disclosure-icon-color`                | `var(--ms-color-text-muted)`    | per scheme |

The selected tab uses the current tone (`--ms-tone-text`, `--ms-tone-solid`).

### Alert and toast

| Token                                  | Default                                  |
| -------------------------------------- | ---------------------------------------- |
| `--ms-alert-gap`                       | `component-xs`                           |
| `--ms-alert-padding-block` / `-inline` | `component-xs` / `component-sm`          |
| `--ms-alert-radius`                    | `var(--ms-border-radius-base)`           |
| `--ms-alert-icon-size`                 | 1.25em                                   |
| `--ms-toast-gutter`                    | `component-base` (to the viewport edges) |
| `--ms-toast-gap`                       | `element-xl`                             |
| `--ms-toast-width`                     | 24rem                                    |
| `--ms-toast-shadow`                    | `var(--ms-shadow-lg)`                    |
| `--ms-toast-enter-distance`            | `var(--ms-space-8)`                      |

Colors come from the surface + tone of the alert.

### Table

| Token                                                     | Default                                                                                              | Scope      |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------- |
| `--ms-table-cell-padding-block-{size}` / `-inline-{size}` | sm `element-sm` / `element-lg` · base `element-lg` / `element-xl` · lg `element-xl` / `component-xs` | global     |
| `--ms-table-border-width`                                 | `var(--ms-border-width-base)`                                                                        | global     |
| `--ms-table-radius`                                       | `var(--ms-border-radius-base)` (`--bordered`)                                                        | global     |
| `--ms-table-sort-icon-size`                               | 0.5em                                                                                                | global     |
| `--ms-table-border-color`                                 | `var(--ms-color-border-subtle)`                                                                      | per scheme |
| `--ms-table-header-background`                            | `var(--ms-color-bg-surface)` (opaque, for sticky)                                                    | per scheme |
| `--ms-table-header-color`                                 | `var(--ms-color-text-muted)`                                                                         | per scheme |
| `--ms-table-stripe-background`                            | `var(--ms-color-bg-subtle)`                                                                          | per scheme |
| `--ms-table-row-background-hover`                         | `var(--ms-color-bg-subtle)`                                                                          | per scheme |

A selected row reads `--ms-tone-subtle` directly, so `ms-tone-*` on the table or the row re-colors it.

### Avatar

| Token                          | Default                                    | Scope      |
| ------------------------------ | ------------------------------------------ | ---------- |
| `--ms-avatar-size-{size}`      | xs 24px · sm 32 · base 40 · lg 48 · xl 64  | global     |
| `--ms-avatar-radius-square`    | `var(--ms-border-radius-base)`             | global     |
| `--ms-avatar-font-scale`       | 0.4 (initials, × the avatar size)          | global     |
| `--ms-avatar-group-overlap`    | 0.25 (share hidden under the previous one) | global     |
| `--ms-avatar-group-ring-width` | `var(--ms-border-width-lg)`                | global     |
| `--ms-avatar-group-ring-color` | `var(--ms-color-bg-canvas)`                | per scheme |

### Skeleton and progress

| Token                                  | Default                             | Scope      |
| -------------------------------------- | ----------------------------------- | ---------- |
| `--ms-skeleton-text-height`            | 0.75em                              | global     |
| `--ms-skeleton-text-gap`               | 0.375em (above and below a line)    | global     |
| `--ms-skeleton-text-last-width`        | 60%                                 | global     |
| `--ms-skeleton-rect-min-height`        | 1rem                                | global     |
| `--ms-skeleton-circle-size`            | 2.5rem                              | global     |
| `--ms-skeleton-radius`                 | `var(--ms-border-radius-sm)`        | global     |
| `--ms-skeleton-duration`               | 1.5s (stopped under reduced motion) | global     |
| `--ms-skeleton-background`             | `var(--ms-color-border-subtle)`     | per scheme |
| `--ms-progress-height-{size}`          | sm 4px · base 8 · lg 12             | global     |
| `--ms-progress-indeterminate-width`    | 40%                                 | global     |
| `--ms-progress-indeterminate-duration` | 1.5s (×3 under reduced motion)      | global     |
| `--ms-progress-track-background`       | `var(--ms-color-border-subtle)`     | per scheme |

### Motion and media

| Token                                                  | Default                                | Scope               |
| ------------------------------------------------------ | -------------------------------------- | ------------------- |
| `--ms-animate-duration`                                | `var(--ms-duration-slower)`            | global              |
| `--ms-animate-easing-enter` / `-exit`                  | `emphasized` / `exit` easing           | global              |
| `--ms-animate-slide-distance`                          | 1.5rem                                 | global              |
| `--ms-animate-zoom-in-scale` / `-out-scale`            | 0.95 / 1.05                            | global              |
| `--ms-hover-duration` / `--ms-hover-easing`            | `var(--ms-duration-base)` / standard   | global              |
| `--ms-hover-lift-distance`                             | 0.25rem                                | global              |
| `--ms-hover-zoom-scale` / `-zoom-duration`             | 1.05 / `var(--ms-duration-slower)`     | global              |
| `--ms-hover-nudge-distance`                            | 0.125rem                               | global              |
| `--ms-surface-transition-property`                     | colors, shadow, opacity, `transform`   | global              |
| `--ms-icon-tile-size-{sm,base,lg}`                     | 2rem / 2.5rem / 2.75rem                | global              |
| `--ms-icon-tile-icon-scale`                            | 0.5 (the icon, as a share of the tile) | global              |
| `--ms-icon-tile-radius` / `-border-width`              | `--ms-border-radius-base` / base width | global              |
| `--ms-icon-tile-outlined-background` / `-border-color` | `bg-subtle` / `border-subtle`          | per scheme          |
| `--ms-list-item-gap` / `-icon-size` / `-icon-line`     | element-xl / 1em / 1.5em               | global              |
| `--ms-link-stretched-radius`                           | `var(--ms-border-radius-lg)`           | global              |
| `--ms-menu-item-indicator-size` / `-color`             | 1rem / `var(--ms-tone-text)`           | global / per scheme |
| `--ms-disclosure-duration`                             | `var(--ms-duration-slow)`              | global              |

### Pagination and breadcrumb

| Token                                 | Default                      | Scope      |
| ------------------------------------- | ---------------------------- | ---------- |
| `--ms-pagination-gap`                 | `element-sm`                 | global     |
| `--ms-pagination-page-padding-inline` | `element-base`               | global     |
| `--ms-pagination-ellipsis-color`      | `var(--ms-color-text-muted)` | per scheme |
| `--ms-breadcrumb-gap`                 | `element-lg`                 | global     |
| `--ms-breadcrumb-color`               | `var(--ms-color-text-muted)` | per scheme |
| `--ms-breadcrumb-color-hover`         | `var(--ms-color-text-base)`  | per scheme |
| `--ms-breadcrumb-color-current`       | `var(--ms-color-text-base)`  | per scheme |
| `--ms-breadcrumb-separator-color`     | `var(--ms-color-text-muted)` | per scheme |
