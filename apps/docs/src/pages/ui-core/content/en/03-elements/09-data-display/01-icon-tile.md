# Icon tile

An icon on a small tile, beside a feature's title or a list row; painted from the current tone.
Decorative: the text beside it carries the meaning.

## Example

```html preview
<span
  class="ms-icon-tile ms-icon-tile--size-base ms-icon-tile--shape-square ms-icon-tile--variant-outlined"
  aria-hidden="true"
  ><svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path
      d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"
    /></svg
></span>
<span
  class="ms-icon-tile ms-icon-tile--size-base ms-icon-tile--shape-square ms-icon-tile--variant-soft ms-tone-success"
  aria-hidden="true"
  ><svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path
      d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"
    /></svg
></span>
<span
  class="ms-icon-tile ms-icon-tile--size-lg ms-icon-tile--shape-circle ms-icon-tile--variant-solid ms-tone-tertiary"
  aria-hidden="true"
  ><svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path
      d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"
    /></svg
></span>
```

## Usage

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
