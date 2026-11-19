# Progress

## Example

```html preview
<div
  class="ms-progress ms-progress--size-sm ms-tone-success"
  role="progressbar"
  aria-label="Upload"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-valuenow="40"
  style="--ms-progress-value: 0.4"
>
  <span class="ms-progress__bar"></span>
</div>
<div
  class="ms-progress ms-progress--indeterminate"
  role="progressbar"
  aria-label="Loading"
>
  <span class="ms-progress__bar"></span>
</div>
```

## Usage

```html
<div
  class="ms-progress ms-progress--size-sm ms-tone-success"
  role="progressbar"
  aria-label="Upload"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-valuenow="40"
  style="--ms-progress-value: 0.4"
>
  <span class="ms-progress__bar"></span>
</div>
```

The bar fills from the inline start to `--ms-progress-value` (0–1), in the current tone.
`ms-progress--indeterminate` (no `aria-valuenow`) runs a bar across instead; slower under reduced
motion.
