---
sidebar:
  label: Codegen
---

# Single source of truth

Token values (`src/tokens/*.mts`) and element options (every `*__CLASS_NAME_CONFIG`) are
defined **once, in TS**. `pnpm codegen` (run automatically by `build` / `dev`) emits
`src/styles/_generated.scss`, which Sass consumes:

- tokens → Sass maps → CSS custom properties
- class-name configs → one class per TS option (`options.each-class()` in `styles/_options.scss`)

Any drift fails the build — e.g. a TS option without CSS:
`` `ms-list` / `lstJustify`: option `stretch` is declared in TS but has no CSS ``.
`pnpm codegen:check` fails when the committed generated file is stale (use it in CI).
Requires Node ≥ 22.18 (native TS type stripping, no extra tooling).
