# Customizing `@mainset/react`

Guides for developers (and AI agents) who adapt the look of React products built on mainset.

`@mainset/react` is a thin adapter: components map props to
[`@mainset/ui-core`](../../ui-core/docs/README.md) classes and add behaviour. All visuals (colors,
sizes, radius, dark mode) are ui-core CSS custom properties, so you customize React components
with ui-core's tokens, plus a few React APIs:

| Guide                            | Read it when you want to…                                                                                                                                                       |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Theming in React](./theming.md) | switch light / dark, set tones and variants via props, theme a subtree, set brand colors at runtime (`<MainSetProvider theme>`, `useTheme()`), build your own themed components |

The underlying model and the CSS-level options live in ui-core's docs:

| Guide                                                              | For                                                  |
| ------------------------------------------------------------------ | ---------------------------------------------------- |
| [Theming overview](../../ui-core/docs/theming.md)                  | tokens, tones, color schemes, why overrides win      |
| [Theming with CSS](../../ui-core/docs/css-overrides.md)            | stylesheet overrides (re-brand, dark mode, sections) |
| [Live theming (`createTheme`)](../../ui-core/docs/live-theming.md) | the options behind the provider's `theme` prop       |
| [Token reference](../../ui-core/docs/tokens.md)                    | every `--ms-*` custom property                       |
