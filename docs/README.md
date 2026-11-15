# mainset ui-stack docs

Guides for developers (and AI agents) who build products on `@mainset/ui-core` and `@mainset/react`.

| Package            | Role                                                                                                |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| `@mainset/ui-core` | Framework-agnostic: design tokens (CSS custom properties), CSS classes, recipes (TS → class string) |
| `@mainset/react`   | Thin React adapter: components map props to ui-core classes and add behaviour                       |

All visuals live in ui-core. React adds no colors and no theme logic of its own, so **anything you
theme in ui-core is themed in React too**.

## Theming

| Guide                                                           | Read it when you want to…                                                           |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| [Theming overview](./theming/README.md)                         | understand the model: tokens, tones, color schemes, specificity                     |
| [Theming with CSS (ui-core)](./theming/ui-core.md)              | re-brand, add a dark-mode tweak, re-color a section, in any framework or plain HTML |
| [Theming in React](./theming/react.md)                          | switch schemes, set tones via props, theme a subtree in React                       |
| [Live theming (runtime)](./theming/live-theming.md)             | let users pick colors in the browser and apply them instantly                       |
| [Token reference](./theming/tokens.md)                          | look up every `--ms-*` custom property                                              |
| [Changing the built-in tokens](./theming/maintaining-tokens.md) | add a palette color or tone, or change defaults inside this repo                    |

Package-level details (entries, codegen, responsive props, browser support) are in
[`packages/ui-core/README.md`](../packages/ui-core/README.md).
