---
title: Introduction
---

`@mainset/ui-core` is the framework-agnostic foundation of the mainset UI: design tokens (CSS
custom properties), CSS classes for every element, and _recipes_, small functions that turn style
props into class names. [`@mainset/react`](https://github.com/mainset/ui-stack/tree/main/packages/react)
is a thin adapter on top. Any other framework, or plain HTML, uses the same classes.

```html preview
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-solid ms-control ms-control--size-base ms-button"
>
  Save
</button>
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-outlined ms-control ms-control--size-base ms-button ms-tone-base"
>
  Cancel
</button>
<button
  class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-soft ms-control ms-control--size-base ms-button ms-tone-error"
>
  Delete
</button>
```

The example above is plain HTML: every element of these docs is shown with its own classes, so
what you see is what you ship, in React, Vue, server templates or a static page.

## What is inside

| Part         | What it is                                                                       |
| ------------ | -------------------------------------------------------------------------------- |
| Tokens       | `--ms-*` custom properties: palette, semantic colors, tones, spacing, typography |
| Foundation   | base styles at zero specificity, color schemes (`data-theme`), tone classes      |
| Elements     | one set of `ms-*` classes per element, in two layers: mechanics and look         |
| Recipes      | `buttonRecipe({ srfVariant: 'solid' })` → the class string, for any template     |
| Live theming | `createTheme()`: a whole theme from one brand color, at runtime or at build time |

## Principles

- **Customizable at every level.** Tokens on `:root`, on a subtree, or on one element; every
  component reads them through a fallback chain, so all three work at once.
- **Composition over repetition.** A button is a surface, a control and the button mechanics
  together, not a copy of their declarations.
- **Zero specificity.** Element rules are `:where()`, so any utility or app class wins, in any
  load order.
- **Any direction.** Logical properties only: a right-to-left section mirrors on its own.
- **Old browsers too.** Chrome 88, Firefox 78 and Safari 14.1 (2021), with a build guard.

> [!TIP]
> New here? Start with [Installation](./01-getting-started/01-installation.md), then read the
> [theming overview](./02-theming/01-overview.md): the model behind every element.
