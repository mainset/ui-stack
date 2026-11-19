# Input, textarea, select

## Example

```html preview
<input
  class="ms-control ms-control--size-base ms-input"
  type="email"
  placeholder="you@example.com"
  aria-label="Email"
/>
<span class="ms-select">
  <select class="ms-control ms-control--size-base ms-input" aria-label="Plan">
    <option>Free</option>
    <option>Pro</option>
  </select>
</span>
<textarea
  class="ms-control ms-control--size-base ms-input"
  rows="3"
  aria-label="Message"
  placeholder="Message"
></textarea>
```

## Usage

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
- Customize: `--ms-input-*` and `--ms-control-*` [tokens](../../02-theming/tokens.md#input-inputs-textareas-selects-per-scheme).
