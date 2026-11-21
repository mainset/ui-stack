# Browser support

Chrome / Edge ≥ 88, Firefox ≥ 78, Safari ≥ 14.1 (2021) — the oldest browsers with flex `gap`.
The targets live in the root `.browserslistrc`; both packages build against them
(syntax lowering + CSS prefixes), and `pnpm build` fails when the output still uses a newer
feature (`scripts/check-browser-support.mjs`).

Within that baseline the CSS avoids newer features on purpose: no `@layer` (2022), no
`color-mix()` (2023, derived colors are precomputed), no media range syntax, no `:has()`,
no container queries. Newer features may only be used as progressive enhancements that fail
on their own (e.g. `:user-invalid`, `:focus-visible`, `text-wrap` sit in their own rules or
declarations).

## Specificity instead of cascade layers

The priority is encoded in the selectors, so it holds in any CSS load order:

| Tier                                                              | Selector       | Specificity | Beaten by                                      |
| ----------------------------------------------------------------- | -------------- | ----------- | ---------------------------------------------- |
| reset, tokens, base styles                                        | `:where(…)`    | 0           | everything; the **reset must be loaded first** |
| components (surface, control, flex, …)                            | `:where(…)`    | 0           | any utility, tone or app class                 |
| utilities (`bg*`, `brd*`, `txt*`, `spc*`), tones                  | `.class`       | 0,1,0       | app CSS loaded after them                      |
| states that must beat variants (e.g. `.ms-control[aria-invalid]`) | `.class[attr]` | 0,2,0       | more specific app CSS                          |

**Any app class overrides a component** — no `!important`, no specificity games.
Components sharing an element never fight over a property: they hand values over through
custom properties instead (e.g. `.ms-control` sets `--ms-surface-radius` for `.ms-surface`).

> Caveats: an app's element selector (e.g. a global `button { padding: 0 }`) also beats
> components (0,0,1 > 0). And the reset is 0-specificity too, so loaded _after_ the
> components it would override them — always import it first.
