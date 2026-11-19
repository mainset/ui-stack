# List item with an icon

A row with a leading icon (a check mark, a feature icon) that stays on the first line while the
text wraps beside it. The icon takes the tone's text color.

## Example

```html preview
<ul
  class="ms-list ms-flex ms-flex--display-flex ms-flex--flex-direction-column ms-layout ms-layout--gap-size-sm ms-tone-success"
>
  <li class="ms-list__item">
    <span class="ms-list__item-icon"
      ><svg
        viewBox="0 0 24 24"
        width="1em"
        height="1em"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="m5 12 5 5 9-10" /></svg></span
    ><span>Works offline</span>
  </li>
  <li class="ms-list__item">
    <span class="ms-list__item-icon"
      ><svg
        viewBox="0 0 24 24"
        width="1em"
        height="1em"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="m5 12 5 5 9-10" /></svg></span
    ><span>Finds a document by any word inside it, in any of your folders</span>
  </li>
  <li class="ms-list__item">
    <span class="ms-list__item-icon"
      ><svg
        viewBox="0 0 24 24"
        width="1em"
        height="1em"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="m5 12 5 5 9-10" /></svg></span
    ><span>No account needed</span>
  </li>
</ul>
```

## Usage

```html
<ul
  class="ms-list ms-flex ms-flex--display-flex ms-flex--flex-direction-column ms-layout ms-layout--gap-size-sm"
>
  <li class="ms-list__item">
    <span class="ms-list__item-icon"><svg aria-hidden="true">…</svg></span>
    <span>Works offline</span>
  </li>
</ul>
```

Customize: `--ms-list-item-gap`, `--ms-list-item-icon-size` (1em), `--ms-list-item-icon-line`
(the first line's height, `1.5em`: match it to the text's line height).
