---
title: Elements
---

Every element is a set of `ms-*` classes. Write them by hand (plain HTML, server templates, any
framework) or get them from a recipe. React components render the same classes, see the
[`@mainset/react` components](https://github.com/mainset/ui-stack/blob/main/packages/react/docs/components.md).

All element rules have zero specificity (`:where()`), or `(0,0,1)` where a tag is part of the
selector (`h2:where(.ms-heading)`). So utility classes and your own CSS always win, in any load
order. Customize through the [tokens](../02-theming/04-tokens.md), not by copying rules.

## Props and classes

Props with a prefix (`spc*`, `flx*`, `lay*`, `grd*`, `ctn*`, `txt*`, `lnk*`, `ctl*`, `spn*`,
`btn*`, `ovr*`, `dlg*`, `tbs*`) map to modifier classes: `ctlSize: 'lg'` →
`ms-control--size-lg`. Props marked _responsive_ also take a per-breakpoint object, see
[Responsive props](../01-getting-started/03-responsive-props.md).

```ts
import { buttonRecipe } from '@mainset/ui-core';

buttonRecipe({ srfVariant: 'outlined', srfTheme: 'error', ctlSize: 'sm' });
// → "ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-outlined
//    ms-control ms-control--size-sm ms-button ms-tone-error"
```

## Layers

Each element's CSS is two files: a _normalize_ layer (mechanics, never themed) and a _theme_
layer (the mainset look). See [Layers and direction](../01-getting-started/04-layers-and-direction.md).
