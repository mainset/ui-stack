# Stack, HStack, Cluster

Flex presets with a gap. Every Flex / Layout / Spacing prop overrides the preset.

## Example

```html preview
<div
  class="ms-flex ms-flex--display-flex ms-flex--flex-direction-column ms-layout ms-layout--gap-size-sm"
>
  <div
    class="ms-background ms-background--color-subtle ms-border ms-border--radius-base ms-spacing--p-component-xs"
  >
    Stack: one
  </div>
  <div
    class="ms-background ms-background--color-subtle ms-border ms-border--radius-base ms-spacing--p-component-xs"
  >
    two
  </div>
</div>
<div
  class="ms-flex ms-flex--display-flex ms-flex--flex-direction-row ms-layout ms-layout--align-items-center ms-layout--gap-size-sm"
>
  <div
    class="ms-background ms-background--color-subtle ms-border ms-border--radius-base ms-spacing--p-component-xs"
  >
    HStack: one
  </div>
  <div
    class="ms-background ms-background--color-subtle ms-border ms-border--radius-base ms-spacing--p-component-xs"
  >
    two
  </div>
  <div
    class="ms-background ms-background--color-subtle ms-border ms-border--radius-base ms-spacing--p-component-xs"
  >
    three
  </div>
</div>
```

## Usage

| Preset    | Defaults                            | For                         |
| --------- | ----------------------------------- | --------------------------- |
| `stack`   | column, gap `base`                  | vertical lists, form layout |
| `hstack`  | row, centered, gap `base`           | toolbars, icon + text       |
| `cluster` | row, wrapping, centered, gap `base` | tags, chips, action buttons |

```ts
stackStyleProps({
  flxDirection: { base: 'column', md: 'row' },
  layGapSize: 'lg',
});
stackStyleProps({ layGapSize: 'sm' }, 'cluster');
```

Props: `flxDirection`, `flxWrap`, `flxDisplay` (responsive), `layJustify`, `layAlign`
(responsive), `layGapSize` (responsive), spacing.

`flxDisplay` (and `grdDisplay` on a grid) also takes `none`: shown from a breakpoint up with
`{ base: 'none', lg: 'flex' }`, hidden from it with `{ base: 'flex', md: 'none' }`. One prop holds
both states, so they never compete in the cascade.
