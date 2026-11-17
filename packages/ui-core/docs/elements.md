# Elements and recipes

Every element is a set of `ms-*` classes. Write them by hand (plain HTML, server templates, any
framework) or get them from a recipe. React components render the same classes, see
[`@mainset/react` components](../../react/docs/components.md).

All element rules have 0 specificity (`:where()`), or `(0,0,1)` where a tag is part of the
selector (`h2:where(.ms-heading)`). So utility classes and your own CSS always win, in any load
order. Customize through the [tokens](./tokens.md), not by copying rules.

## Two layers per component

Each component's CSS comes in two files, applied together:

| Layer                      | Holds                                                                                     | Changes when…       |
| -------------------------- | ----------------------------------------------------------------------------------------- | ------------------- |
| `{element}-normalize.scss` | resets (`appearance`, margins), box model, layout mechanics, states' mechanics, direction | never, written once |
| `{element}.scss` (theme)   | the mainset look: colors, borders, radius, typography, shadows, opacity, motion           | the design changes  |

- A test keeps normalize layers free of colors, typography, radius, shadows and motion.
- Some elements have one layer only: mechanics only (`container`, `list`, `overlay`, `popper`,
  `floating-box`) or look only (`surface`). Utilities (spacing, flex, grid,
  text, background, border, section) are a single file: they only apply token values.
- Component tokens (`_{element}.tokens.scss`) load with the normalize layer: both layers read
  them, and you override them like any token.

Bundles for use without a bundler:

| File                       | Contents                                                        |
| -------------------------- | --------------------------------------------------------------- |
| `styles/index.min.css`     | tokens, base, utilities, every component: normalize + theme     |
| `styles/normalize.min.css` | tokens, base, utilities, every component's normalize layer only |

`normalize.css` is the headless option: mainset's structure, behaviour and direction handling
under a completely different visual language, written as your own theme layer. Components then
work but look like the browser's defaults until you style them.

## Direction (LTR / RTL)

Layout never assumes a direction: only logical properties (`margin-inline-start`,
`inset-inline-end`, `inline-size`, `text-align: start`) and flex / grid alignment
(`start` / `end`). No `[dir]` selectors, no physical sides. So the direction comes from the
nearest `dir` attribute: a whole page, or just one section:

```html
<html dir="ltr">
  …
  <section dir="rtl" lang="ar">…</section>
  <!-- inputs, selects, switches, labels… mirror inside it -->
</html>
```

A test fails on physical properties in any stylesheet. A symmetric glyph that needs physical
sides (the select chevron) is marked `rtl-safe:` on the line above. Your own CSS on top should
follow the same rule.

Props with a prefix (`spc*`, `flx*`, `lay*`, `grd*`, `ctn*`, `txt*`, `lnk*`, `ctl*`, `spn*`,
`btn*`, `ovr*`, `dlg*`, `tbs*`) map
to modifier classes: `ctlSize: 'lg'` → `ms-control--size-lg`. Props marked _responsive_ also take
a per-breakpoint object, see [Responsive props](../README.md#responsive-props).

## Layout

### Box

Spacing, background and border utilities, no styles of its own.

```ts
boxStyleProps({
  bgColor: 'muted',
  spcType: 'p',
  spcScale: 'block',
  spcSize: { base: 'sm', md: 'lg' },
});
// → { className: 'ms-background ms-background--color-muted ms-border ms-spacing--p-block-sm ms-spacing--p@md',
//     style: { '--ms-spacing-p-at-md': 'var(--ms-spacing-scale-block-lg)' } }
```

Spacing props (`spcType`, `spcScale`, `spcSize`, `spcSizes`) are the same everywhere: an
element gets either padding or margin. For space between children, use the parent's gap.

### Stack, HStack, Cluster

Flex presets with a gap. Every Flex / Layout / Spacing prop overrides the preset.

| Preset    | Defaults                            | For                         |
| --------- | ----------------------------------- | --------------------------- |
| `stack`   | column, gap `base`                  | vertical lists, form layout |
| `hstack`  | row, centered, gap `base`           | toolbars, icon + text       |
| `cluster` | row, wrapping, centered, gap `base` | tags, chips, action buttons |

```ts
stackStyleProps({
  flxDirection: { base: 'column', md: 'row' },
  layGapSize: 'lg',
});
stackStyleProps({ layGapSize: 'sm' }, 'cluster');
```

Props: `flxDirection`, `flxWrap`, `flxDisplay` (responsive), `layJustify`, `layAlign`
(responsive), `layGapSize` (responsive), spacing.

`flxDisplay` (and `grdDisplay` on a grid) also takes `none`: shown from a breakpoint up with
`{ base: 'none', lg: 'flex' }`, hidden from it with `{ base: 'flex', md: 'none' }`. One prop holds
both states, so they never compete in the cascade.

### Container

Centered content up to a container width, with side gutters.

```html
<div class="ms-container ms-container--size-lg">…</div>
```

| Prop / class                                   | Values                                        |
| ---------------------------------------------- | --------------------------------------------- |
| `ctnSize` / `ms-container--size-{size}`        | `xs` `sm` `base` `lg` `xl` (default) · `full` |
| `ctnIsGutterless` / `ms-container--gutterless` | no side padding                               |

Customize: `--ms-container-{size}` (widths), `--ms-container-gutter`.

### Grid

Auto-fit columns by default; equal columns with `grdColumns`.

```html
<div
  class="ms-grid ms-grid--display-grid ms-grid--columns-1 ms-grid--columns@md ms-layout ms-layout--gap-size-base"
  style="--ms-grid-columns-at-md: repeat(3, minmax(0, 1fr))"
>
  <div class="ms-grid__item ms-grid__item--col-span-2">…</div>
  <div class="ms-grid__item ms-grid__item--full-row">…</div>
</div>
```

| Prop                           | Values                                    |
| ------------------------------ | ----------------------------------------- |
| `grdColumns` (responsive)      | 1–12                                      |
| `grdAutoFlow` (responsive)     | `row` `column` `row-dense` `column-dense` |
| item `grdColSpan` (responsive) | 1–12                                      |
| item `grdIsFullRow`            | spans the whole row                       |

### List item with an icon

A row with a leading icon (a check mark, a feature icon) that stays on the first line while the
text wraps beside it. The icon takes the tone's text color.

```html
<ul
  class="ms-flex ms-flex--display-flex ms-flex--flex-direction-column ms-layout ms-layout--gap-size-sm"
>
  <li class="ms-list__item">
    <span class="ms-list__item-icon"><svg aria-hidden="true">…</svg></span>
    <span>Works offline</span>
  </li>
</ul>
```

Customize: `--ms-list-item-gap`, `--ms-list-item-icon-size` (1em), `--ms-list-item-icon-line`
(the first line's height, `1.5em`: match it to the text's line height).

### Aspect ratio

A box of a fixed ratio whose single media child fills it, so the page doesn't shift while the
image loads. It uses the padding technique (`aspect-ratio` needs Safari 15 / Firefox 89).

```html
<div
  class="ms-aspect-ratio ms-aspect-ratio--ratio-16-10 ms-aspect-ratio--fit-cover"
>
  <img src="shot.webp" alt="The search results" />
</div>
```

| Prop       | Values                                               |
| ---------- | ---------------------------------------------------- |
| `aspRatio` | `1-1` `4-3` `3-2` `16-10` `16-9` (default) `21-9`    |
| `aspFit`   | `cover` (default, cropped) · `contain` (letterboxed) |

## Typography

### Heading

```html
<h1 class="ms-heading">Page title</h1>
<h2 class="ms-heading ms-text ms-text--size-lg">A smaller h2</h2>
```

The tag sets the level and its default size; `txtSize` changes the looks only.

### Text

The `txt*` utilities on any text element:

| Prop                                                                       | Values                                                                                                                 |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `txtSize`                                                                  | `xxs`–`xxl`; fluid `display-sm` (30→36px) · `display-base` (36→60px) · `display-lg` (48→72px)                          |
| `txtWeight`                                                                | `normal` `medium` `semibold` `bold` · `lighter` `bolder`                                                               |
| `txtLeading`                                                               | `tight` · `relaxed`: overrides the line height the size brings                                                         |
| `txtWrap`                                                                  | `balance` (headings) · `pretty` (paragraphs) · `nowrap`                                                                |
| `txtVariant`                                                               | `overline` (the label above a heading: mono, uppercase, tracked) · `lead` (intro text) · `data` (mono, tabular digits) |
| `txtColor`                                                                 | any tone, or `subtle`: the faintest text that still passes WCAG AA                                                     |
| `txtColorHover`, `txtAlign`, `txtFamily`, `txtTransform`, `txtIsTruncated` | as their names say                                                                                                     |

Display sizes grow with the viewport between a floor and a ceiling (`clamp()` with a `rem` part,
so they still zoom), so a headline needs no size per breakpoint. `balance` / `pretty` are
ignored by older browsers, which wrap as usual. A variant is a preset: `txtSize`, `txtWeight`…
on the same element still win.

```html
<p class="ms-text ms-text--variant-overline ms-text--color-primary">Products</p>
<h2 class="ms-heading ms-text ms-text--size-display-sm ms-text--wrap-balance">
  Find any document
</h2>
<p
  class="ms-text ms-text--variant-lead ms-text--color-muted ms-text--wrap-pretty"
>
  …
</p>
```

### Link

```html
<a class="ms-link ms-link--underline-always" href="/pricing">Pricing</a>
```

The current tone's text color (`--ms-tone-text`), `--ms-tone-solid-hover` on hover.
`lnkUnderline`: `always` (default; links inside running text need it, WCAG 1.4.1), `hover`,
`none`. `aria-disabled="true"` disables it. Re-color with a tone (`ms-tone-error`) or `txtColor`.

**Stretched link** (`lnkIsStretched` / `ms-link--stretched`): the whole nearest `ms-link-area`
(a card) becomes the link's click target, and its focus ring goes around that area. There is
one real link inside, so a screen reader reads it once, by its own text. Other links in the
area need `position: relative` and a `z-index` to stay clickable. Round the ring with
`--ms-link-stretched-radius` (default `--ms-border-radius-lg`).

```html
<article class="ms-surface ms-surface--variant-outlined ms-link-area">
  <h3>
    <a
      class="ms-link ms-link--underline-none ms-link--stretched"
      href="/docninja"
      >DocNinja</a
    >
  </h3>
  <p>Offline document search.</p>
</article>
```

## Actions

### Icon button

`ms-button--icon` (`btnIsIcon`) makes a button a square of the control height, for an icon
alone. Give it an `aria-label`.

```html
<button
  class="ms-background ms-border ms-surface ms-surface--variant-ghost ms-control ms-control--size-base ms-button ms-button--icon"
  aria-label="Close"
>
  <!-- CLOSE_ICON__SVG from @mainset/ui-core -->
</button>
```

### Button icons

An icon before or after the label goes in an `ms-button__icon` span, sized to the text
(`1.15em`); the button's gap spaces it.

```html
<a class="… ms-button ms-hover--group" href="/download">
  Download
  <span class="ms-button__icon"
    ><svg class="ms-hover--nudge-end" aria-hidden="true">…</svg></span
  >
</a>
```

## Forms

Native elements, uncontrolled: they submit, reset and validate like plain HTML.

### Input, textarea, select

```ts
inputRecipe({ ctlSize: 'lg' }); // → "ms-control ms-control--size-lg ms-input"
```

```html
<input
  class="ms-control ms-control--size-base ms-input"
  type="email"
  name="email"
/>
<textarea class="ms-control ms-control--size-base ms-input" rows="3"></textarea>
<span class="ms-select">
  <select class="ms-control ms-control--size-base ms-input">
    …
  </select>
</span>
```

- Sizes come from `.ms-control` (`ctlSize`), so inputs line up with buttons of the same size.
- Invalid: `aria-invalid="true"`, or the browser's own validation once the user has interacted
  (`:user-invalid`, where supported).
- The select wrapper draws the chevron, so keep it.
- Customize: `--ms-input-*` and `--ms-control-*` [tokens](./tokens.md#input-inputs-textareas-selects-per-scheme).

### Checkbox, radio, switch

```html
<label class="ms-choice">
  <span class="ms-checkbox">
    <input type="checkbox" class="ms-checkbox__input" name="terms" />
    <!-- CHECKBOX_ICON__SVG from @mainset/ui-core -->
  </span>
  <span>I accept the terms</span>
</label>

<label class="ms-choice">
  <input type="radio" class="ms-radio" name="plan" value="pro" />
  <span>Pro</span>
</label>

<label class="ms-choice">
  <span class="ms-switch">
    <input type="checkbox" role="switch" class="ms-switch__input" />
    <span class="ms-switch__thumb" aria-hidden="true"></span>
  </span>
  <span>Notifications</span>
</label>
```

- Checked in the current tone: put `ms-tone-success` on the label (or any ancestor) to re-color.
- The checkbox icon is an svg after the input (`CHECKBOX_ICON__SVG`), the switch thumb a span
  after it: nothing is drawn with pseudo-elements on inputs, which Firefox 78 can't render.
- The switch thumb moves along the inline axis (`margin-inline-start`), so "on" is at the inline
  end in LTR and RTL sections alike.
- Indeterminate: set the DOM property `input.indeterminate = true` (React: `chkIsIndeterminate`).

### Label and field

```html
<div class="ms-field">
  <label class="ms-label ms-label--required" for="email">Email</label>
  <input
    class="ms-control ms-control--size-base ms-input"
    id="email"
    required
    aria-describedby="email-hint email-error"
    aria-invalid="true"
  />
  <p class="ms-field__hint" id="email-hint">We never share it</p>
  <p class="ms-field__error" id="email-error">Enter a valid email</p>
</div>
```

Wire `for` / `id`, `aria-describedby` and `aria-invalid` yourself in plain HTML; the React
`Field` does it for you.

## Feedback and accessibility

### Spinner

```html
<span class="ms-spinner ms-spinner--size-sm" role="status">
  <span class="ms-visually-hidden">Loading</span>
</span>
```

A ring in `currentcolor` (so it follows the text, e.g. `on-solid` inside a solid button). Sizes
`xs`–`xl`; slower, not stopped, under reduced motion.

### Visually hidden

`ms-visually-hidden` hides from the screen and keeps it for assistive tech;
`ms-visually-hidden-focusable` shows it while focused (skip links).

## Overlays

Dialogs, drawers, popovers, tooltips and menus. ui-core has their classes and states; the
behaviour (focus, keyboard, positioning) is script: the [React containers](../../react/docs/components.md#overlays-containers),
or your own.

States are attributes, so any script can drive them: `data-state="open" | "closed"` runs the
enter / exit animations, `aria-expanded` / `aria-selected` / `aria-disabled` / `hidden` the rest.
Animations use the motion tokens, so they stop under reduced motion. Keep a closing element
rendered until its `animationend`.

### Dialog and drawer

```html
<div class="ms-backdrop ms-backdrop--visible"></div>
<div class="ms-overlay ms-overlay--placement-center">
  <div
    class="ms-dialog ms-dialog--size-sm"
    role="dialog"
    aria-modal="true"
    aria-labelledby="delete-title"
    data-state="open"
  >
    <div class="ms-dialog__header">
      <h2 class="ms-dialog__title" id="delete-title">Delete the project?</h2>
      <button class="… ms-button ms-button--icon" aria-label="Close">…</button>
    </div>
    <div class="ms-dialog__body">It can't be undone.</div>
    <div class="ms-dialog__footer">…actions</div>
  </div>
</div>
```

- `ms-overlay` is the fixed positioner above the backdrop: `--placement-center` (with a
  gutter), `start` / `end` (inline edges: they follow `dir`), `top` / `bottom`.
- `ms-dialog--size-{xs|sm|base|lg|xl|full}`; the body scrolls, header and footer stay.
- A drawer is `ms-dialog--drawer` in an edge placement: full height at `start` / `end`, full
  width at `top` / `bottom`; the size is its depth. It slides in from its own edge, in RTL too.

### Popover and tooltip

```html
<div class="ms-popover" role="dialog" aria-label="Filters" data-state="open">
  …
</div>
<div class="ms-tooltip" role="tooltip" id="copy-tip">Copy link</div>
```

Both are positioned by script (`position: fixed` + inline `top` / `left` from the real layout,
so they follow the section's direction). `ms-popover` is a surface panel, `ms-tooltip` a short
dark label (`hidden` while not shown), referenced by its trigger's `aria-describedby`.

### Menu

```html
<div class="ms-popover ms-menu" role="menu" aria-labelledby="actions-button">
  <button class="ms-menu__item" role="menuitem" tabindex="-1">Rename</button>
  <a class="ms-menu__item" role="menuitem" tabindex="-1" href="/export"
    >Export</a
  >
  <div class="ms-menu__separator" role="separator"></div>
  <div role="group" aria-labelledby="danger">
    <div class="ms-menu__group-label" id="danger" aria-hidden="true">
      Danger zone
    </div>
    <button
      class="ms-menu__item ms-menu__item--toned ms-tone-error"
      role="menuitem"
      tabindex="-1"
    >
      Delete
    </button>
  </div>
</div>
```

The highlighted item is the focused one. Disabled items keep the focus (`aria-disabled="true"`).

A single choice (a language) is a group of `menuitemradio`s; the checked one shows its
`ms-menu__item-indicator` check mark (`--ms-menu-item-indicator-color`, the tone's text):

```html
<div role="group">
  <button
    class="ms-menu__item"
    role="menuitemradio"
    aria-checked="true"
    tabindex="-1"
  >
    English
    <svg class="ms-menu__item-indicator" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.75 8.25l2.75 2.75 5.75-6" />
    </svg>
  </button>
</div>
```

## Disclosure

### Tabs

```html
<div class="ms-tabs ms-tabs--orientation-horizontal">
  <div class="ms-tabs__list" role="tablist" aria-label="Account">
    <button
      class="ms-tabs__tab"
      role="tab"
      aria-selected="true"
      aria-controls="p1"
      id="t1"
    >
      Profile
    </button>
    <button
      class="ms-tabs__tab"
      role="tab"
      aria-selected="false"
      tabindex="-1"
      id="t2"
    >
      Billing
    </button>
  </div>
  <div
    class="ms-tabs__panel"
    role="tabpanel"
    id="p1"
    aria-labelledby="t1"
    tabindex="0"
  >
    …
  </div>
</div>
```

`--orientation-vertical` puts the list beside the panel, its line on the panel's side (in RTL
too). The selected tab is in the current tone.

### Accordion item

```html
<div class="ms-disclosure">
  <h3 class="ms-disclosure__heading">
    <button
      class="ms-disclosure__trigger"
      aria-expanded="true"
      aria-controls="ship"
      id="ship-t"
    >
      Shipping <span class="ms-disclosure__icon" aria-hidden="true"></span>
    </button>
  </h3>
  <div
    class="ms-disclosure__panel"
    role="region"
    id="ship"
    aria-labelledby="ship-t"
  >
    <div class="ms-disclosure__panel-content">…</div>
  </div>
</div>
```

The chevron turns with `aria-expanded`. `data-state="closed"` collapses the panel to no height
and `visibility: hidden` (out of the tab order and the accessibility tree); the theme layer
animates it to its content's height (`--ms-disclosure-duration`), browsers without grid-row
transitions open it at once. A panel with the `hidden` attribute is simply not displayed. The
padding is on the content, so a collapsed panel has no leftover height.

## Alerts and toasts

```html
<div
  class="ms-alert ms-background ms-border ms-surface ms-surface--variant-soft ms-tone-warning"
  role="alert"
>
  <span class="ms-alert__icon" aria-hidden="true">…</span>
  <div class="ms-alert__content">
    <p class="ms-alert__title">Payment failed</p>
    <div class="ms-alert__description">Your card was declined.</div>
  </div>
  <div class="ms-alert__actions">…</div>
</div>
```

Colors come from the surface + tone (`surfaceRecipe({ srfTheme, srfVariant })`). Use
`role="alert"` for urgent messages, `role="status"` for the rest.

Toasts are alerts with `ms-toast` (a shadow, enter / exit animations) in an
`<ol class="ms-toast-region">`, fixed in the block-end / inline-end corner. Announce them through
a live region that is already in the page: one added together with its content may not be read.

## Motion

### Animate

Entrance and exit animations from CSS alone. The modifiers say where it comes from, and combine
freely; the state says when it moves. Only `opacity` and `transform` change, so nothing around
it reflows. Under `prefers-reduced-motion` it is shown at once (no delay, no hidden wait).

```html
<!-- plays from the first paint: no JS needed -->
<h1 class="ms-animate ms-animate--state-enter ms-animate--slide-up">…</h1>
<li
  class="ms-animate ms-animate--state-enter ms-animate--fade ms-animate--slide-up"
  style="--ms-animate-delay: 160ms"
>
  …
</li>
```

| Prop / class                             | Values                                                    |
| ---------------------------------------- | --------------------------------------------------------- |
| `anmState` / `ms-animate--state-*`       | `enter` (default) · `exit` · `hidden` (held at the start) |
| `anmFade` / `ms-animate--fade`           | from transparent (default on)                             |
| `anmSlide` / `ms-animate--slide-*`       | `up` (rises into place) · `down`                          |
| `anmZoom` / `ms-animate--zoom-*`         | `in` (grows into place) · `out`                           |
| `anmDuration` / `ms-animate--duration-*` | `fast` `base` `slow` `slower` (default) `slowest`         |

Leave the fade out for a page's largest text: Chrome counts its Largest Contentful Paint only
once it's visible, so a headline fading in from 0 is reported late. An entrance holds nothing
once it ends, so a hover effect on the same element still works. Customize:
`--ms-animate-slide-distance`, `--ms-animate-zoom-{in,out}-scale`,
`--ms-animate-easing-{enter,exit}`, `--ms-animate-duration`.

### Hover effects

Small motion on hover, for a pointer that can hover (any of them, so a touchscreen laptop with a
mouse gets it too, a phone doesn't), and never under `prefers-reduced-motion`. Colors stay with
the element (`srfHover`, `txtColorHover`).

| Class                    | Effect                                                          |
| ------------------------ | --------------------------------------------------------------- |
| `ms-hover--lift`         | rises (`--ms-hover-lift-distance`, 0.25rem)                     |
| `ms-hover--zoom`         | grows (`--ms-hover-zoom-scale`, 1.05): media in a card          |
| `ms-hover--nudge-end`    | moves toward the inline end (follows RTL)                       |
| `ms-hover--nudge-up-end` | up and toward the end: a ↗ arrow                                |
| `ms-hover--group`        | hovering or keyboard-focusing it plays its descendants' effects |

```html
<a
  class="ms-surface ms-surface--variant-outlined ms-surface--hover-border ms-hover--group ms-hover--lift"
  href="/docninja"
>
  DocNinja <svg class="ms-hover--nudge-up-end" aria-hidden="true">…</svg>
</a>
```

From JS, `hoverRecipe({ hvrEffect, hvrIsGroup })` returns just these classes (no base class), for
any element or an icon's `className`.

## Data display

### Icon tile

An icon on a small tile, beside a feature's title or a list row; painted from the current tone.
Decorative: the text beside it carries the meaning.

```html
<span
  class="ms-icon-tile ms-icon-tile--size-base ms-icon-tile--shape-square ms-icon-tile--variant-outlined"
  aria-hidden="true"
>
  <svg>…</svg>
</span>
```

| Prop         | Values                                                            |
| ------------ | ----------------------------------------------------------------- |
| `ictVariant` | `outlined` (default: neutral tile, toned icon) · `soft` · `solid` |
| `ictShape`   | `square` (default) · `circle`                                     |
| `ictSize`    | `sm` (2rem) · `base` (2.5rem) · `lg` (2.75rem)                    |

### Table

```html
<div class="ms-table-wrapper" tabindex="0" role="region" aria-label="Invoices">
  <table class="ms-table ms-table--hoverable ms-table--size-sm">
    <thead>
      <tr>
        <th class="ms-table__cell" scope="col" aria-sort="ascending">
          <button class="ms-table__sort" type="button">
            Invoice<span class="ms-table__sort-icon" aria-hidden="true"></span>
          </button>
        </th>
        <th class="ms-table__cell ms-table__cell--align-end" scope="col">
          Amount
        </th>
      </tr>
    </thead>
    <tbody>
      <tr aria-selected="true">
        <th class="ms-table__cell" scope="row">INV-001</th>
        <td class="ms-table__cell ms-table__cell--align-end">1,250.00</td>
      </tr>
    </tbody>
  </table>
</div>
```

The wrapper scrolls a table wider than its container (and, with a `max-block-size`, taller: then
`ms-table--sticky-header` keeps the header row in view). Modifiers: `--size-{sm|base|lg}`
(density), `--striped`, `--hoverable`, `--bordered` (a frame and lines between columns).
`ms-table__cell--align-{start|center|end}` aligns a column; numbers use tabular figures.
A selected row is `tr[aria-selected="true"]`, in the current tone.

Sorting: the header label is a `__sort` button; only the sorted column has `aria-sort`, which
turns its `__sort-icon` into a chevron up (`ascending`) or down (`descending`). Sorting the rows
is yours.

### Avatar

```html
<span
  class="ms-avatar ms-avatar--size-sm ms-tone-info"
  role="img"
  aria-label="Ada Lovelace"
>
  AL
  <img src="/ada.png" alt="" />
</span>

<div class="ms-avatar-group" role="group" aria-label="Members">
  <span class="ms-avatar">…</span>
  <span class="ms-avatar">…</span>
</div>
```

A box of `--size-{xs…xl}`, `--shape-circle` (default) or `--shape-square`. The `img` lies over
the fallback (initials, an `svg`), so the fallback shows until the picture loads; remove the
`img` if it fails. Fallback colors are the current tone's `subtle` / `text`. In a group, each
avatar slides under the previous one (`--ms-avatar-group-overlap`) with a ring in the page color.

### Skeleton

```html
<div aria-busy="true">
  <span
    class="ms-skeleton ms-skeleton--variant-circle"
    aria-hidden="true"
  ></span>
  <span class="ms-skeleton-lines" aria-hidden="true">
    <span class="ms-skeleton ms-skeleton--variant-text"></span>
    <span class="ms-skeleton ms-skeleton--variant-text"></span>
  </span>
  <span class="ms-skeleton ms-skeleton--variant-rect" aria-hidden="true">
    <h2>Content to load</h2>
  </span>
</div>
```

`text` (a line), `rect` (size it yourself) or `circle`. With content inside, it takes the
content's size and hides it. In `ms-skeleton-lines`, the last line is shorter. It pulses, and
stops under reduced motion. Skeletons are decorative: mark the loading region `aria-busy`.

### Progress

```html
<div
  class="ms-progress ms-progress--size-sm ms-tone-success"
  role="progressbar"
  aria-label="Upload"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-valuenow="40"
  style="--ms-progress-value: 0.4"
>
  <span class="ms-progress__bar"></span>
</div>
```

The bar fills from the inline start to `--ms-progress-value` (0–1), in the current tone.
`ms-progress--indeterminate` (no `aria-valuenow`) runs a bar across instead; slower under reduced
motion.

## Navigation

### Pagination

```html
<nav class="ms-pagination ms-pagination--size-sm" aria-label="Pagination">
  <ul class="ms-pagination__list">
    <li>
      <button class="ms-button ms-button--icon …" aria-label="Previous page">
        <span class="ms-pagination__arrow" aria-hidden="true">‹</span>
      </button>
    </li>
    <li>
      <button class="ms-button ms-pagination__page …" aria-label="Page 1">
        1
      </button>
    </li>
    <li><span class="ms-pagination__ellipsis" aria-hidden="true">…</span></li>
    <li>
      <button
        class="ms-button ms-pagination__page …"
        aria-current="page"
        aria-label="Page 6"
      >
        6
      </button>
    </li>
    …
  </ul>
</nav>
```

Pages are buttons (`buttonRecipe()`, or links with `btnAs="a"`) at least as wide as they are
tall; give them the `ctlSize` of `ms-pagination--size-*`, which sizes the ellipses.
`paginationRange({ page, pageCount, siblingCount, boundaryCount })` returns which pages to show,
with `'ellipsis'` for the gaps, for any template. Its length doesn't change between pages, so the
buttons don't move under the pointer.

### Breadcrumb

```html
<nav class="ms-breadcrumb" aria-label="Breadcrumb">
  <ol class="ms-breadcrumb__list">
    <li class="ms-breadcrumb__item">
      <a class="ms-breadcrumb__link" href="/">Home</a>
      <span class="ms-breadcrumb__separator" aria-hidden="true">/</span>
    </li>
    <li class="ms-breadcrumb__item">
      <span class="ms-breadcrumb__link" aria-current="page">Install</span>
    </li>
  </ol>
</nav>
```

The separators are in the markup (`aria-hidden`), so a screen reader doesn't read them.

NOTE on direction: `‹` `›` (U+2039 / U+203A) are mirrored by the browser in RTL text, so the
pagination arrows and a `›` breadcrumb separator point the right way in an RTL section without
any CSS. An icon separator would need mirroring.
