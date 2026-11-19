# Menu

## Usage

```html
<div class="ms-popover ms-menu" role="menu" aria-labelledby="actions-button">
  <button class="ms-menu__item" role="menuitem" tabindex="-1">Rename</button>
  <a class="ms-menu__item" role="menuitem" tabindex="-1" href="/export"
    >Export</a
  >
  <div class="ms-menu__separator" role="separator"></div>
  <div role="group" aria-labelledby="danger">
    <div class="ms-menu__group-label" id="danger" aria-hidden="true">
      Danger zone
    </div>
    <button
      class="ms-menu__item ms-menu__item--toned ms-tone-error"
      role="menuitem"
      tabindex="-1"
    >
      Delete
    </button>
  </div>
</div>
```

The highlighted item is the focused one. Disabled items keep the focus (`aria-disabled="true"`).

A single choice (a language) is a group of `menuitemradio`s; the checked one shows its
`ms-menu__item-indicator` check mark (`--ms-menu-item-indicator-color`, the tone's text):

```html
<div role="group">
  <button
    class="ms-menu__item"
    role="menuitemradio"
    aria-checked="true"
    tabindex="-1"
  >
    English
    <svg class="ms-menu__item-indicator" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.75 8.25l2.75 2.75 5.75-6" />
    </svg>
  </button>
</div>
```
