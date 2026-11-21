# Avatar

## Example

```html preview
<span
  class="ms-avatar ms-avatar--size-sm ms-tone-info"
  role="img"
  aria-label="Ada Lovelace"
  >AL</span
>
<span
  class="ms-avatar ms-avatar--size-base ms-tone-success"
  role="img"
  aria-label="Alan Turing"
  >AT</span
>
<span
  class="ms-avatar ms-avatar--size-base ms-avatar--shape-square ms-tone-tertiary"
  role="img"
  aria-label="Grace Hopper"
  >GH</span
>
<div class="ms-avatar-group" role="group" aria-label="Members">
  <span class="ms-avatar ms-tone-info" role="img" aria-label="Ada Lovelace"
    >AL</span
  >
  <span class="ms-avatar ms-tone-success" role="img" aria-label="Alan Turing"
    >AT</span
  >
  <span class="ms-avatar ms-tone-warning" role="img" aria-label="Grace Hopper"
    >GH</span
  >
</div>
```

## Usage

```html
<span
  class="ms-avatar ms-avatar--size-sm ms-tone-info"
  role="img"
  aria-label="Ada Lovelace"
>
  AL
  <img src="/ada.png" alt="" />
</span>

<div class="ms-avatar-group" role="group" aria-label="Members">
  <span class="ms-avatar">…</span>
  <span class="ms-avatar">…</span>
</div>
```

A box of `--size-{xs…xl}`, `--shape-circle` (default) or `--shape-square`. The `img` lies over
the fallback (initials, an `svg`), so the fallback shows until the picture loads; remove the
`img` if it fails. Fallback colors are the current tone's `subtle` / `text`. In a group, each
avatar slides under the previous one (`--ms-avatar-group-overlap`) with a ring in the page color.
