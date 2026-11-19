# Skeleton

## Example

```html preview
<div
  aria-busy="true"
  class="ms-flex ms-flex--display-flex ms-flex--flex-direction-row ms-layout ms-layout--align-items-center ms-layout--gap-size-sm"
>
  <span
    class="ms-skeleton ms-skeleton--variant-circle"
    aria-hidden="true"
  ></span>
  <span class="ms-skeleton-lines" aria-hidden="true" style="flex: 1">
    <span class="ms-skeleton ms-skeleton--variant-text"></span>
    <span class="ms-skeleton ms-skeleton--variant-text"></span>
  </span>
</div>
```

## Usage

```html
<div aria-busy="true">
  <span
    class="ms-skeleton ms-skeleton--variant-circle"
    aria-hidden="true"
  ></span>
  <span class="ms-skeleton-lines" aria-hidden="true">
    <span class="ms-skeleton ms-skeleton--variant-text"></span>
    <span class="ms-skeleton ms-skeleton--variant-text"></span>
  </span>
  <span class="ms-skeleton ms-skeleton--variant-rect" aria-hidden="true">
    <h2>Content to load</h2>
  </span>
</div>
```

`text` (a line), `rect` (size it yourself) or `circle`. With content inside, it takes the
content's size and hides it. In `ms-skeleton-lines`, the last line is shorter. It pulses, and
stops under reduced motion. Skeletons are decorative: mark the loading region `aria-busy`.
