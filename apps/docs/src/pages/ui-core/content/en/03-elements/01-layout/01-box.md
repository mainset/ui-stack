# Box

Spacing, background and border utilities, no styles of its own.

## Example

```html preview
<div
  class="ms-background ms-background--color-subtle ms-border ms-border--radius-base ms-spacing--p-block-xs"
>
  A box: block padding, a subtle background, rounded corners
</div>
```

## Usage

```ts
boxStyleProps({
  bgColor: 'muted',
  spcType: 'p',
  spcScale: 'block',
  spcSize: { base: 'sm', md: 'lg' },
});
// → { className: 'ms-background ms-background--color-muted ms-border ms-spacing--p-block-sm ms-spacing--p@md',
//     style: { '--ms-spacing-p-at-md': 'var(--ms-spacing-scale-block-lg)' } }
```

Spacing props (`spcType`, `spcScale`, `spcSize`, `spcSizes`) are the same everywhere: an
element gets either padding or margin. For space between children, use the parent's gap.
