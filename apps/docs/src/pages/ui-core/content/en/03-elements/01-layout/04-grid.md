# Grid

Auto-fit columns by default; equal columns with `grdColumns`.

## Example

```html preview
<div
  class="ms-grid ms-grid--display-grid ms-grid--columns-3 ms-layout ms-layout--gap-size-sm"
>
  <div
    class="ms-grid__item ms-grid__item--col-span-2 ms-background ms-background--color-subtle ms-border ms-border--radius-base ms-spacing--p-component-xs"
  >
    col-span-2
  </div>
  <div
    class="ms-grid__item ms-background ms-background--color-subtle ms-border ms-border--radius-base ms-spacing--p-component-xs"
  >
    2
  </div>
  <div
    class="ms-grid__item ms-background ms-background--color-subtle ms-border ms-border--radius-base ms-spacing--p-component-xs"
  >
    3
  </div>
  <div
    class="ms-grid__item ms-background ms-background--color-subtle ms-border ms-border--radius-base ms-spacing--p-component-xs"
  >
    4
  </div>
  <div
    class="ms-grid__item ms-background ms-background--color-subtle ms-border ms-border--radius-base ms-spacing--p-component-xs"
  >
    5
  </div>
</div>
```

## Usage

```html
<div
  class="ms-grid ms-grid--display-grid ms-grid--columns-1 ms-grid--columns@md ms-layout ms-layout--gap-size-base"
  style="--ms-grid-columns-at-md: repeat(3, minmax(0, 1fr))"
>
  <div class="ms-grid__item ms-grid__item--col-span-2">…</div>
  <div class="ms-grid__item ms-grid__item--full-row">…</div>
</div>
```

| Prop                           | Values                                    |
| ------------------------------ | ----------------------------------------- |
| `grdColumns` (responsive)      | 1–12                                      |
| `grdAutoFlow` (responsive)     | `row` `column` `row-dense` `column-dense` |
| item `grdColSpan` (responsive) | 1–12                                      |
| item `grdIsFullRow`            | spans the whole row                       |
