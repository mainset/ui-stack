# Text

The `txt*` utilities on any text element:

## Example

```html preview
<div>
  <p class="ms-text ms-text--variant-overline ms-text--color-primary">
    Products
  </p>
  <h2 class="ms-heading ms-text ms-text--size-display-sm ms-text--wrap-balance">
    Find any document
  </h2>
  <p
    class="ms-text ms-text--variant-lead ms-text--color-muted ms-text--wrap-pretty"
  >
    Search every file on your computer by what is written inside it.
  </p>
</div>
```

## Usage

| Prop                                                                       | Values                                                                                                                 |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `txtSize` (responsive)                                                     | `xxs`–`xxl`; fluid `display-sm` (30→36px) · `display-base` (36→60px) · `display-lg` (48→72px)                          |
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
