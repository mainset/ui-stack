# Dialog and drawer

## Usage

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
