# Tabs

## Example

```html preview
<div class="ms-tabs">
  <div class="ms-tabs__list" role="tablist" aria-label="Account">
    <button
      class="ms-tabs__tab"
      role="tab"
      aria-selected="true"
      aria-controls="preview-tab-1"
      id="preview-tab-t1"
    >
      Profile
    </button>
    <button
      class="ms-tabs__tab"
      role="tab"
      aria-selected="false"
      tabindex="-1"
      id="preview-tab-t2"
    >
      Billing
    </button>
    <button
      class="ms-tabs__tab"
      role="tab"
      aria-selected="false"
      tabindex="-1"
      id="preview-tab-t3"
    >
      Team
    </button>
  </div>
  <div
    class="ms-tabs__panel"
    role="tabpanel"
    id="preview-tab-1"
    aria-labelledby="preview-tab-t1"
    tabindex="0"
  >
    The profile panel. Switching tabs is script: the React <code>Tabs</code>, or
    your own.
  </div>
</div>
```

## Usage

```html
<div class="ms-tabs ms-tabs--orientation-horizontal">
  <div class="ms-tabs__list" role="tablist" aria-label="Account">
    <button
      class="ms-tabs__tab"
      role="tab"
      aria-selected="true"
      aria-controls="p1"
      id="t1"
    >
      Profile
    </button>
    <button
      class="ms-tabs__tab"
      role="tab"
      aria-selected="false"
      tabindex="-1"
      id="t2"
    >
      Billing
    </button>
  </div>
  <div
    class="ms-tabs__panel"
    role="tabpanel"
    id="p1"
    aria-labelledby="t1"
    tabindex="0"
  >
    …
  </div>
</div>
```

`--orientation-vertical` puts the list beside the panel, its line on the panel's side (in RTL
too). The selected tab is in the current tone.
