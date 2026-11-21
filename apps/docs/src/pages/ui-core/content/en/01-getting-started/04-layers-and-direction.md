# Layers and direction

Every element is a set of `ms-*` classes. Write them by hand (plain HTML, server templates, any
framework) or get them from a recipe. React components render the same classes, see
[`@mainset/react` components](https://github.com/mainset/ui-stack/blob/main/packages/react/docs/components.md).

All element rules have 0 specificity (`:where()`), or `(0,0,1)` where a tag is part of the
selector (`h2:where(.ms-heading)`). So utility classes and your own CSS always win, in any load
order. Customize through the [tokens](../02-theming/tokens.md), not by copying rules.

## Two layers per component

Each component's CSS comes in two files, applied together:

| Layer                      | Holds                                                                                     | Changes when…       |
| -------------------------- | ----------------------------------------------------------------------------------------- | ------------------- |
| `{element}-normalize.scss` | resets (`appearance`, margins), box model, layout mechanics, states' mechanics, direction | never, written once |
| `{element}.scss` (theme)   | the mainset look: colors, borders, radius, typography, shadows, opacity, motion           | the design changes  |

- A test keeps normalize layers free of colors, typography, radius, shadows and motion.
- Some elements have one layer only: mechanics only (`container`, `list`, `overlay`, `popper`,
  `floating-box`) or look only (`surface`). Utilities (spacing, flex, grid,
  text, background, border, section) are a single file: they only apply token values.
- Component tokens (`_{element}.tokens.scss`) load with the normalize layer: both layers read
  them, and you override them like any token.

Bundles for use without a bundler:

| File                       | Contents                                                        |
| -------------------------- | --------------------------------------------------------------- |
| `styles/index.min.css`     | tokens, base, utilities, every component: normalize + theme     |
| `styles/normalize.min.css` | tokens, base, utilities, every component's normalize layer only |

`normalize.css` is the headless option: mainset's structure, behaviour and direction handling
under a completely different visual language, written as your own theme layer. Components then
work but look like the browser's defaults until you style them.

## Direction (LTR / RTL)

Layout never assumes a direction: only logical properties (`margin-inline-start`,
`inset-inline-end`, `inline-size`, `text-align: start`) and flex / grid alignment
(`start` / `end`). No `[dir]` selectors, no physical sides. So the direction comes from the
nearest `dir` attribute: a whole page, or just one section:

```html
<html dir="ltr">
  …
  <section dir="rtl" lang="ar">…</section>
  <!-- inputs, selects, switches, labels… mirror inside it -->
</html>
```

A test fails on physical properties in any stylesheet. A symmetric glyph that needs physical
sides (the select chevron) is marked `rtl-safe:` on the line above. Your own CSS on top should
follow the same rule.

Props with a prefix (`spc*`, `flx*`, `lay*`, `grd*`, `ctn*`, `txt*`, `lnk*`, `ctl*`, `spn*`,
`btn*`, `ovr*`, `dlg*`, `tbs*`) map
to modifier classes: `ctlSize: 'lg'` → `ms-control--size-lg`. Props marked _responsive_ also take
a per-breakpoint object, see [Responsive props](../01-getting-started/responsive-props.md).
