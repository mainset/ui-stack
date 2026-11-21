# Details

## Example

```html preview
<div>
  <details class="ms-disclosure" open>
    <summary class="ms-disclosure__trigger">
      Shipping <span class="ms-disclosure__icon" aria-hidden="true"></span>
    </summary>
    <div class="ms-disclosure__panel-content">Free over 50 €.</div>
  </details>
  <details class="ms-disclosure">
    <summary class="ms-disclosure__trigger">
      Returns <span class="ms-disclosure__icon" aria-hidden="true"></span>
    </summary>
    <div class="ms-disclosure__panel-content">30 days.</div>
  </details>
</div>
```

## Usage

```html
<details class="ms-disclosure">
  <summary class="ms-disclosure__trigger">
    Shipping <span class="ms-disclosure__icon" aria-hidden="true"></span>
  </summary>
  <div class="ms-disclosure__panel-content">Free over 50 €.</div>
</details>
```

The [accordion item](./02-accordion.md) on a native `<details>`. It opens and closes without
script (static pages, before hydration) and is a disclosure for assistive tech by itself. The
`<summary>` is the trigger, with the browser's marker hidden; the chevron turns while it's
`open`. It opens at once, with no height animation.
