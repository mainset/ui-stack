# Button

A button is three classes working together: a **surface** (tone × variant: its colors), a
**control** (its height and padding, shared with inputs) and the **button** mechanics. The
recipe puts them together, so one call gives the whole class string.

## Variants

```html preview
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-solid ms-control ms-control--size-base ms-button"
>
  Solid
</button>
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-soft ms-control ms-control--size-base ms-button"
>
  Soft
</button>
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-outlined ms-control ms-control--size-base ms-button"
>
  Outlined
</button>
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-ghost ms-control ms-control--size-base ms-button"
>
  Ghost
</button>
```

`srfVariant`: `solid` (the main action), `soft`, `outlined`, `ghost` (toolbars, quiet actions).

## Tones

```html preview
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-solid ms-control ms-control--size-base ms-button ms-tone-primary"
>
  Primary
</button>
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-solid ms-control ms-control--size-base ms-button ms-tone-secondary"
>
  Secondary
</button>
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-solid ms-control ms-control--size-base ms-button ms-tone-tertiary"
>
  Tertiary
</button>
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-solid ms-control ms-control--size-base ms-button ms-tone-success"
>
  Success
</button>
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-solid ms-control ms-control--size-base ms-button ms-tone-error"
>
  Error
</button>
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-outlined ms-control ms-control--size-base ms-button ms-tone-base"
>
  Base
</button>
```

`srfTheme` puts a tone class on the button. A tone on any ancestor colors every button inside it
the same way, with no prop at all:

```html
<div class="ms-tone-error">
  <button class="… ms-button">Retry</button>
</div>
```

## Sizes

```html preview
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-solid ms-control ms-control--size-xs ms-button"
>
  Extra small
</button>
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-solid ms-control ms-control--size-sm ms-button"
>
  Small
</button>
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-solid ms-control ms-control--size-base ms-button"
>
  Base
</button>
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-solid ms-control ms-control--size-lg ms-button"
>
  Large
</button>
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-solid ms-control ms-control--size-xl ms-button"
>
  Extra large
</button>
```

`btnSize` (`ctlSize` in the recipe): `xs`, `sm`, `base` (default), `lg`, `xl`. An input of the same
size is exactly as tall, so they line up in a row.

## Icon button

`ms-button--icon` (`btnIsIcon`) makes a button a square of the control height, for an icon
alone. Give it an `aria-label`.

```html preview
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-ghost ms-control ms-control--size-base ms-button ms-button--icon ms-tone-base"
  aria-label="Close"
>
  <svg
    viewBox="0 0 16 16"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    aria-hidden="true"
  >
    <path d="M4 4l8 8M12 4l-8 8" />
  </svg>
</button>
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-outlined ms-control ms-control--size-base ms-button ms-button--icon ms-tone-base"
  aria-label="Close"
>
  <svg
    viewBox="0 0 16 16"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    aria-hidden="true"
  >
    <path d="M4 4l8 8M12 4l-8 8" />
  </svg>
</button>
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-solid ms-control ms-control--size-base ms-button ms-button--icon ms-tone-error"
  aria-label="Close"
>
  <svg
    viewBox="0 0 16 16"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    aria-hidden="true"
  >
    <path d="M4 4l8 8M12 4l-8 8" />
  </svg>
</button>
```

## Button icons

An icon before or after the label goes in an `ms-button__icon` span, sized to the text
(`1.15em`); the button's gap spaces it. With `ms-hover--group`, hovering the button plays the
icon's own hover effect.

```html preview
<a
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-solid ms-control ms-control--size-base ms-button ms-hover--group"
  href="#button-icons"
  >Get started<span class="ms-button__icon"
    ><svg
      class="ms-hover--nudge-end"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" /></svg></span
></a>
```

## Usage

```ts
import { buttonRecipe } from '@mainset/ui-core';

buttonRecipe({ srfVariant: 'solid', srfTheme: 'primary', ctlSize: 'lg' });
```

```tsx
// React
<Button srfVariant="solid" btnSize="lg">Save</Button>
<Button btnAs="a" href="/pricing" srfVariant="outlined">See pricing</Button>
```

A pressed button moves down a pixel and shrinks a touch; every variant shows its hover color
while pressed, so touch screens get feedback too. Customize: `--ms-button-*` and
`--ms-control-*` [tokens](../../02-theming/04-tokens.md#button).
