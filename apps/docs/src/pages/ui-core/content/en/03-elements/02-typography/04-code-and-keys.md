# Code and keys

## Example

```html preview
<p class="ms-text ms-text--size-base">
  Run <code class="ms-code">pnpm build</code>, then search with
  <kbd class="ms-keyboard-key">⌘K</kbd> or
  <kbd class="ms-keyboard-key">Ctrl</kbd> +
  <kbd class="ms-keyboard-key">K</kbd>.
</p>
```

## Usage

```html
<p>
  Run <code class="ms-code">pnpm build</code>, or press
  <kbd class="ms-keyboard-key">⌘K</kbd>.
</p>
```

`ms-code` is a code span in running text: mono on a tinted chip, sized in `em` so it fits any
text size. Broken over lines, it keeps its padding on each. `ms-keyboard-key` is a key or a shortcut,
never broken over lines; use one element per key of a combination. Tokens: `--ms-code-*`,
`--ms-keyboard-key-*`.

A code block is left to the app, since syntax highlighting differs per app.
