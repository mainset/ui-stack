# Label and field

## Example

```html preview
<div class="ms-field">
  <label class="ms-label ms-label--required" for="preview-email">Email</label>
  <input
    class="ms-control ms-control--size-base ms-input"
    id="preview-email"
    type="email"
    required
    aria-describedby="preview-email-hint preview-email-error"
    aria-invalid="true"
    value="ada@"
  />
  <p class="ms-field__hint" id="preview-email-hint">We never share it</p>
  <p class="ms-field__error" id="preview-email-error">Enter a valid email</p>
</div>
```

## Usage

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
