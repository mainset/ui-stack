# Accordion

## Example

```html preview
<div>
  <div class="ms-disclosure">
    <h3 class="ms-disclosure__heading">
      <button
        class="ms-disclosure__trigger"
        aria-expanded="true"
        aria-controls="preview-ship"
        id="preview-ship-t"
      >
        Shipping <span class="ms-disclosure__icon" aria-hidden="true"></span>
      </button>
    </h3>
    <div
      class="ms-disclosure__panel"
      role="region"
      id="preview-ship"
      aria-labelledby="preview-ship-t"
    >
      <div class="ms-disclosure__panel-content">Free over 50 €.</div>
    </div>
  </div>
  <div class="ms-disclosure">
    <h3 class="ms-disclosure__heading">
      <button
        class="ms-disclosure__trigger"
        aria-expanded="false"
        aria-controls="preview-returns"
        id="preview-returns-t"
      >
        Returns <span class="ms-disclosure__icon" aria-hidden="true"></span>
      </button>
    </h3>
    <div
      class="ms-disclosure__panel"
      role="region"
      id="preview-returns"
      aria-labelledby="preview-returns-t"
      data-state="closed"
    >
      <div class="ms-disclosure__panel-content">30 days.</div>
    </div>
  </div>
</div>
```

## Usage

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
