# Hover effects

Small motion on hover, for a pointer that can hover (any of them, so a touchscreen laptop with a
mouse gets it too, a phone doesn't), and never under `prefers-reduced-motion`. Colors stay with
the element (`srfHover`, `txtColorHover`).

## Example

```html preview
<a
  class="ms-background ms-border ms-surface ms-surface--variant-outlined ms-surface--hover-border ms-hover--group ms-hover--lift ms-spacing--p-component-sm"
  href="#example"
>
  Hover me
  <span class="ms-hover--nudge-end" style="display: inline-block">→</span>
</a>
```

## Usage

| Class                    | Effect                                                          |
| ------------------------ | --------------------------------------------------------------- |
| `ms-hover--lift`         | rises (`--ms-hover-lift-distance`, 0.25rem)                     |
| `ms-hover--zoom`         | grows (`--ms-hover-zoom-scale`, 1.05): media in a card          |
| `ms-hover--nudge-end`    | moves toward the inline end (follows RTL)                       |
| `ms-hover--nudge-up-end` | up and toward the end: a ↗ arrow                                |
| `ms-hover--group`        | hovering or keyboard-focusing it plays its descendants' effects |

```html
<a
  class="ms-surface ms-surface--variant-outlined ms-surface--hover-border ms-hover--group ms-hover--lift"
  href="/docninja"
>
  DocNinja <svg class="ms-hover--nudge-up-end" aria-hidden="true">…</svg>
</a>
```

From JS, `hoverRecipe({ hvrEffect, hvrIsGroup })` returns just these classes (no base class), for
any element or an icon's `className`.
