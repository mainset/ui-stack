# Aspect ratio

A box of a fixed ratio whose single media child fills it, so the page doesn't shift while the
image loads. It uses the padding technique (`aspect-ratio` needs Safari 15 / Firefox 89).

## Usage

```html
<div
  class="ms-aspect-ratio ms-aspect-ratio--ratio-16-10 ms-aspect-ratio--fit-cover"
>
  <img src="shot.webp" alt="The search results" />
</div>
```

| Prop       | Values                                               |
| ---------- | ---------------------------------------------------- |
| `aspRatio` | `1-1` `4-3` `3-2` `16-10` `16-9` (default) `21-9`    |
| `aspFit`   | `cover` (default, cropped) · `contain` (letterboxed) |
