# Popover and tooltip

## Usage

```html
<div class="ms-popover" role="dialog" aria-label="Filters" data-state="open">
  …
</div>
<div class="ms-tooltip" role="tooltip" id="copy-tip">Copy link</div>
```

Both are positioned by script (`position: fixed` + inline `top` / `left` from the real layout,
so they follow the section's direction). `ms-popover` is a surface panel, `ms-tooltip` a short
dark label (`hidden` while not shown), referenced by its trigger's `aria-describedby`.
