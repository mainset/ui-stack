# Customizing `@mainset/ui-core`

Guides for developers (and AI agents) who adapt the look of products built on mainset.
ui-core holds every visual decision: design tokens (CSS custom properties), CSS classes and
recipes. They work the same in plain HTML, React, Vue or server templates, and
[`@mainset/react`](../../react/docs/README.md) adds no colors of its own, so **anything you
theme here is themed in React too**.

| Guide                                                   | Read it when you want to…                                                           |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| [Theming overview](./theming.md)                        | understand the model: tokens, tones, color schemes, specificity                     |
| [Theming with CSS](./css-overrides.md)                  | re-brand, add a dark-mode tweak, re-color a section, in any framework or plain HTML |
| [Live theming (`createTheme`)](./live-theming.md)       | derive a full theme from one brand color, at runtime, on the server or in a build   |
| [Token reference](./tokens.md)                          | look up every `--ms-*` custom property                                              |
| [Changing the built-in tokens](./maintaining-tokens.md) | maintainers: add a palette color or tone, or change the defaults in this package    |

Using React? Start with [Theming in React](../../react/docs/theming.md), which covers the props,
`<MainSetProvider theme>` and `useTheme()`.

Package-level details (entries, codegen, responsive props, browser support) are in the
[package README](../README.md).
