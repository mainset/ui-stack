# Link

## Example

```html preview
<a class="ms-link ms-link--underline-always" href="#example"
  >Underlined (running text)</a
>
<a class="ms-link ms-link--underline-hover" href="#example"
  >Underlined on hover</a
>
<a class="ms-link ms-link--underline-always ms-tone-error" href="#example"
  >In a tone</a
>
<a
  class="ms-link ms-link--underline-always"
  href="#example"
  aria-disabled="true"
  >Disabled</a
>
```

## Usage

```html
<a class="ms-link ms-link--underline-always" href="/pricing">Pricing</a>
```

The current tone's text color (`--ms-tone-text`), `--ms-tone-solid-hover` on hover.
`lnkUnderline`: `always` (default; links inside running text need it, WCAG 1.4.1), `hover`,
`none`. `aria-disabled="true"` disables it. Re-color with a tone (`ms-tone-error`) or `txtColor`.

**Stretched link** (`lnkIsStretched` / `ms-link--stretched`): the whole nearest `ms-link-area`
(a card) becomes the link's click target, and its focus ring goes around that area. There is
one real link inside, so a screen reader reads it once, by its own text. Other links in the
area need `position: relative` and a `z-index` to stay clickable. Round the ring with
`--ms-link-stretched-radius` (default `--ms-border-radius-lg`).

```html
<article class="ms-surface ms-surface--variant-outlined ms-link-area">
  <h3>
    <a
      class="ms-link ms-link--underline-none ms-link--stretched"
      href="/docninja"
      >DocNinja</a
    >
  </h3>
  <p>Offline document search.</p>
</article>
```
