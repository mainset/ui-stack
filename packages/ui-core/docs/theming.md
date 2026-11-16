# Theming overview

mainset is themed entirely through **CSS custom properties** (`--ms-*`). There is no JS theme
object to pass around and no build step on the consumer side. A theme is a set of custom
property values, and you can declare it in a stylesheet, in an inline `style`, or from JS at runtime.

## The model in one picture

```
Tier 1  palette        --ms-palette-violet-600: rgb(144 19 254)        literal colors
          │
Tier 2  semantic       --ms-color-bg-canvas, --ms-color-text-muted     meaning, per color scheme
        tone roles     --ms-color-primary-solid, …-subtle, …-text      one set per tone, per scheme
          │
        current tone   --ms-tone-solid, --ms-tone-subtle, …            inherited; `.ms-tone-*` re-points it
          │
Tier 3  component      --ms-control-height-base, --ms-control-radius   sizing knobs of shared primitives
          │
        elements       .ms-surface { background: var(--ms-tone-solid) } …
```

- **Elements never read a palette color or a specific tone.** They read the inherited
  `--ms-tone-*` contract and the semantic `--ms-color-*` tokens. That is why one class or one
  attribute re-themes a whole subtree.
- **Light and dark only swap Tier 2 values.** Components don't change between schemes.

## Building blocks

### 1. Color schemes: `data-theme`

```html
<html data-theme="system">
  <!-- light | dark | system (follows the OS) -->
  …
  <aside data-theme="dark">…</aside>
  <!-- nesting is supported -->
</html>
```

With no `data-theme`, the page is light. Every element with `data-theme` paints its own
canvas background and text color, so a nested theme renders correctly.

### 2. Tones: `.ms-tone-{tone}`

Tones: `primary` (default) · `secondary` · `tertiary` · `error` · `info` · `success` · `warning` ·
`base` · `muted` · `inverse` · `transparent`.

Each tone has the same **role contract**:

| Role           | Used for                                          |
| -------------- | ------------------------------------------------- |
| `solid`        | filled backgrounds (solid buttons, badges)        |
| `solid-hover`  | hover of `solid`                                  |
| `on-solid`     | text and icons on `solid`                         |
| `subtle`       | tinted backgrounds (soft variant)                 |
| `subtle-hover` | hover of `subtle`                                 |
| `border`       | outlines (outlined variant)                       |
| `text`         | tinted text on the canvas (soft, outlined, ghost) |

`.ms-tone-error` on an element re-points `--ms-tone-*` to the error roles for that element
**and everything inside it**, so children follow without props.

### 3. Variants: how a tone is painted

`.ms-surface--variant-{solid | soft | outlined | ghost}` decides which roles a surface uses.
Tone (which color) and variant (how it's painted) are independent.

### 4. Utilities

Each utility paints one property with one role of a named tone, and overrides the variant:

| Prop       | Class                    | Reads                      |
| ---------- | ------------------------ | -------------------------- |
| `bgColor`  | `ms-background--color-*` | `--ms-color-{tone}-solid`  |
| `txtColor` | `ms-text--color-*`       | `--ms-color-{tone}-text`   |
| `brdColor` | `ms-border--color-*`     | `--ms-color-{tone}-border` |

Utilities read the named tone directly, not the inherited `--ms-tone-*` contract, so
`txtColor="error"` is red inside any `.ms-tone-*` subtree.

## Precedence (why overrides "just work")

Every token and component rule uses `:where()` (0 specificity). Utilities and tone classes are
plain classes (0,1,0). So:

- **Any app CSS override wins, in any load order.** No `!important`, no `@layer`.
- `:root { --ms-… }` in your CSS beats the built-in `:where(:root)` defaults.

## Derived colors are precomputed

Only `solid` and `on-solid` are authored. `solid-hover`, `subtle`, `subtle-hover` (and in dark
mode `border` / `text`) are **mixed at build time** in the oklab space and shipped as plain hex
colors, because `color-mix()` isn't available in the supported browsers (Safari 14.1, Chrome 88,
Firefox 78).

Consequence: if you override a tone's `solid` by hand, **also set its derived roles**, or hover
and soft states keep the old color. `createTheme()` from `@mainset/ui-core/theme` derives all of
them from one color with the same function the build uses, at runtime or in a build script. In
React that's `<MainSetProvider theme>`. See [Live theming](./live-theming.md).

## Rules of thumb (for developers and AI agents)

1. Re-brand with `createTheme({ tones: { primary: '#…' } })` (or `<MainSetProvider theme>`), or by
   overriding all `--ms-color-{tone}-*` roles in CSS. Never edit or copy ui-core's CSS, and never
   hand-compute derived roles.
2. Scope dark-mode-specific values to `[data-theme='dark']` (and `system` under
   `prefers-color-scheme: dark`). See the [scheme-aware override pattern](./css-overrides.md#scheme-aware-overrides).
3. To change the color of a subtree, use a tone (`.ms-tone-*` / `srfTheme`), not new CSS.
4. Override `--ms-color-{tone}-*` on `:root` / `[data-theme]` elements, or on an element that
   has `.ms-tone-{tone}` itself. Elsewhere it has no effect, because the tone was already resolved
   on an ancestor. See [where overrides apply](./css-overrides.md#where-an-override-applies).
5. Don't use `color-mix()`, `@layer`, `:has()` or other post-2021 CSS in theme overrides if you
   need the same browser support as the library.
6. Responsive props never change colors. Tone, color and radius are not responsive by design.
