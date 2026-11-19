# Alert and toast

## Example

```html preview
<div
  class="ms-alert ms-background ms-border ms-surface ms-surface--variant-soft ms-tone-warning"
  role="alert"
>
  <div class="ms-alert__content">
    <p class="ms-alert__title">Payment failed</p>
    <div class="ms-alert__description">Your card was declined.</div>
  </div>
</div>
<div
  class="ms-alert ms-background ms-border ms-surface ms-surface--variant-soft ms-tone-success"
  role="status"
>
  <div class="ms-alert__content">
    <p class="ms-alert__title">Saved</p>
    <div class="ms-alert__description">Your changes are live.</div>
  </div>
</div>
```

## Usage

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
