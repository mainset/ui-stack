# Nav list

## Example

```html preview
<nav aria-label="Example" style="max-inline-size: 16rem">
  <ul class="ms-nav-list ms-nav-list--variant-soft">
    <li class="ms-nav-list__item">
      <a class="ms-nav-list__link" href="#example">Introduction</a>
    </li>
    <li class="ms-nav-list__item">
      <details class="ms-nav-list__group" open>
        <summary class="ms-nav-list__group-label">
          <span>Elements</span>
          <span class="ms-disclosure__icon" aria-hidden="true"></span>
        </summary>
        <ul class="ms-nav-list ms-nav-list--variant-soft">
          <li class="ms-nav-list__item">
            <a class="ms-nav-list__link" href="#example" aria-current="page"
              >Button</a
            >
            <ul class="ms-nav-list ms-nav-list--variant-line">
              <li class="ms-nav-list__item">
                <a
                  class="ms-nav-list__link"
                  href="#example"
                  aria-current="location"
                  >Variants</a
                >
              </li>
              <li class="ms-nav-list__item">
                <a class="ms-nav-list__link" href="#example">Sizes</a>
              </li>
            </ul>
          </li>
          <li class="ms-nav-list__item">
            <a class="ms-nav-list__link" href="#example">Link</a>
          </li>
        </ul>
      </details>
    </li>
  </ul>
</nav>
```

## Usage

```html
<nav aria-label="Docs">
  <ul class="ms-nav-list ms-nav-list--variant-soft">
    <li class="ms-nav-list__item">
      <a class="ms-nav-list__link" href="/docs" aria-current="page"
        >Introduction</a
      >
    </li>
    <li class="ms-nav-list__item">
      <details class="ms-nav-list__group" open>
        <summary class="ms-nav-list__group-label">
          <span>Elements</span>
          <span class="ms-disclosure__icon" aria-hidden="true"></span>
        </summary>
        <ul class="ms-nav-list ms-nav-list--variant-soft">
          <li class="ms-nav-list__item">
            <a class="ms-nav-list__link" href="/docs/button">Button</a>
          </li>
        </ul>
      </details>
    </li>
  </ul>
</nav>
```

A vertical list of links, like a sidebar or the contents of a page. Links are whole rows,
start-aligned, and long labels wrap. The current link is the one with `aria-current` (`page`,
`location`, …), in the current tone.

`navVariant`:

- `soft` (default) tints the current row.
- `line` marks it on a guide line along the list, for "On this page".

A nested list is indented on a guide line. It sits in an `__item`, or in a `details.__group`
that opens without script. A `line` list nested in a `line` list stays on its parent's line,
with its links indented. Tokens: `--ms-nav-list-*`.

This site's sidebar and "On this page" are nav lists.
