# Animate

Entrance and exit animations from CSS alone. The modifiers say where it comes from, and combine
freely; the state says when it moves. Only `opacity` and `transform` change, so nothing around
it reflows. Under `prefers-reduced-motion` it is shown at once (no delay, no hidden wait).

## Example

```html preview
<p
  class="ms-animate ms-animate--state-enter ms-animate--fade ms-animate--slide-up"
>
  Rises into place
</p>
<p
  class="ms-animate ms-animate--state-enter ms-animate--fade ms-animate--zoom-in"
  style="--ms-animate-delay: 160ms"
>
  Grows into place, a bit later
</p>
```

## Usage

```html
<!-- plays from the first paint: no JS needed -->
<h1 class="ms-animate ms-animate--state-enter ms-animate--slide-up">…</h1>
<li
  class="ms-animate ms-animate--state-enter ms-animate--fade ms-animate--slide-up"
  style="--ms-animate-delay: 160ms"
>
  …
</li>
```

| Prop / class                             | Values                                                    |
| ---------------------------------------- | --------------------------------------------------------- |
| `anmState` / `ms-animate--state-*`       | `enter` (default) · `exit` · `hidden` (held at the start) |
| `anmFade` / `ms-animate--fade`           | from transparent (default on)                             |
| `anmSlide` / `ms-animate--slide-*`       | `up` (rises into place) · `down`                          |
| `anmZoom` / `ms-animate--zoom-*`         | `in` (grows into place) · `out`                           |
| `anmDuration` / `ms-animate--duration-*` | `fast` `base` `slow` `slower` (default) `slowest`         |

Leave the fade out for a page's largest text: Chrome counts its Largest Contentful Paint only
once it's visible, so a headline fading in from 0 is reported late. An entrance holds nothing
once it ends, so a hover effect on the same element still works. Customize:
`--ms-animate-slide-distance`, `--ms-animate-zoom-{in,out}-scale`,
`--ms-animate-easing-{enter,exit}`, `--ms-animate-duration`.
