# Responsive props

Layout props accept a mobile-first object keyed by breakpoint (industry vocabulary, as in
Chakra / Panda / Tailwind: `base` 0 = default · `sm` 36rem · `md` 48rem · `lg` 62rem · `xl` 75rem).
A breakpoint's value applies from that width up, until a larger breakpoint sets its own.

**Only props that change the layout are responsive** — direction, display, wrap, justify, align,
gap, padding / margin, columns, and text size (`txtSize`: how much copy fits the screen). Props
that only change the look — tone, color, radius, font weight, control size — never are: a button
doesn't change color on a phone.

How a prop scales depends on its number of options (`responsive` in its TS config):

| `responsive` | For                                                                                                                                                   | Per breakpoint                     | CSS cost              |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | --------------------- |
| `'class'`    | few options: `flxDisplay`, `flxDirection`, `flxWrap`, `grdDisplay`, `grdAutoFlow`, `layJustify`, `layAlign`; `txtSize` (a size sets three properties) | a class per option                 | options × breakpoints |
| `'css-var'`  | many options: `layGapSize`, spacing (`spcSize`, `spcSizes`)                                                                                           | one class + an inline CSS variable | 1 rule per breakpoint |

```ts
flxDirection={{ base: 'column', md: 'row' }}
// → class "ms-flex--flex-direction-column ms-flex--flex-direction-row@md"

txtSize={{ base: 'base', md: 'lg' }}
// → class "ms-text--size-base ms-text--size-lg@md"

layGapSize={{ base: 'xs', md: 'xl' }}
// → class "ms-layout--gap-size-xs ms-layout--gap-size@md"
//   style "--ms-layout-gap-size-at-md: var(--ms-space-layout-row-xl) var(--ms-space-layout-column-xl)"

spcType="pv" spcScale="section" spcSize={{ base: 'xs', md: 'lg' }}
// → class "ms-spacing--pv-section-xs ms-spacing--pv@md"
//   style "--ms-spacing-pv-at-md: var(--ms-spacing-scale-section-lg)"
```

A plain (non-object) value is always a class only — no inline style. The `base` value of an
object is that same class; the variables carry only the other breakpoints, so the CSS doesn't
grow with the number of sizes (spacing: 56 extra rules instead of ~1,180).

Without React, take both parts from the recipe and put the style on the element:

```ts
const { className, style } = composeStyleProps(
  [FLEX_CONTAINER__CLASS_NAME_CONFIG, LAYOUT__CLASS_NAME_CONFIG],
  {
    flxDirection: { base: 'column', md: 'row' },
    layGapSize: { base: 'xs', md: 'xl' },
  },
);
// spacing: spacingStyleProps({ ... }) → { className, style }
```

`composeClassNames()` / `spacingRecipe()` return the class string only, like every `*Recipe()`;
with an object value of a `css-var` prop the breakpoint class then has no value (a dev-only
console warning says so), so use `composeStyleProps()` / `spacingStyleProps()` there.
Only declared options become inline variables; unknown values are skipped.

> **CSP:** the variables are inline `style` attributes. React sets them through the DOM API
> (allowed by a strict `style-src`), but server-rendered HTML carries them as attributes, which
> a CSP without `'unsafe-inline'` for styles blocks. Plain values are classes and unaffected.
