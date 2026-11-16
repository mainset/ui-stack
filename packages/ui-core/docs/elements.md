# Elements and recipes

Every element is a set of `ms-*` classes. Write them by hand (plain HTML, server templates, any
framework) or get them from a recipe. React components render the same classes, see
[`@mainset/react` components](../../react/docs/components.md).

All element rules have 0 specificity (`:where()`), or `(0,0,1)` where a tag is part of the
selector (`h2:where(.ms-heading)`). So utility classes and your own CSS always win, in any load
order. Customize through the [tokens](./tokens.md), not by copying rules.

Props with a prefix (`spc*`, `flx*`, `lay*`, `grd*`, `ctn*`, `txt*`, `lnk*`, `ctl*`, `spn*`) map
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

## Typography

### Heading

```html
<h1 class="ms-heading">Page title</h1>
<h2 class="ms-heading ms-text ms-text--size-lg">A smaller h2</h2>
```

The tag sets the level and its default size; `txtSize` changes the looks only.

### Text

The `txt*` utilities on any text element: `txtSize` (`xxs`–`xxl`), `txtWeight`, `txtColor`
(any tone), `txtColorHover`, `txtAlign`, `txtFamily`, `txtTransform`, `txtIsTruncated`.

### Link

```html
<a class="ms-link ms-link--underline-always" href="/pricing">Pricing</a>
```

The current tone's text color (`--ms-tone-text`), `--ms-tone-solid-hover` on hover.
`lnkUnderline`: `always` (default; links inside running text need it, WCAG 1.4.1), `hover`,
`none`. `aria-disabled="true"` disables it. Re-color with a tone (`ms-tone-error`) or `txtColor`.

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

<label class="ms-choice"
  ><input type="radio" class="ms-radio" name="plan" value="pro" /><span
    >Pro</span
  ></label
>

<label class="ms-choice"
  ><input type="checkbox" role="switch" class="ms-switch" /><span
    >Notifications</span
  ></label
>
```

- Checked in the current tone: put `ms-tone-success` on the label (or any ancestor) to re-color.
- The checkbox icon is an svg after the input (`CHECKBOX_ICON__SVG`). Checkboxes and radios
  draw nothing with pseudo-elements, which Firefox 78 can't render on inputs.
- Indeterminate: set the DOM property `input.indeterminate = true`.

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
