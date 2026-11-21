# Pagination

## Example

```html preview
<nav class="ms-pagination ms-pagination--size-sm" aria-label="Pagination">
  <ul class="ms-pagination__list">
    <li>
      <button
        class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-ghost ms-control ms-control--size-sm ms-button ms-button--icon ms-tone-base"
        aria-label="Previous page"
      >
        <span class="ms-pagination__arrow" aria-hidden="true">‹</span>
      </button>
    </li>
    <li>
      <button
        class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-ghost ms-control ms-control--size-sm ms-button ms-pagination__page ms-tone-base"
        aria-label="Page 1"
      >
        1
      </button>
    </li>
    <li><span class="ms-pagination__ellipsis" aria-hidden="true">…</span></li>
    <li>
      <button
        class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-ghost ms-control ms-control--size-sm ms-button ms-pagination__page ms-tone-base"
        aria-label="Page 5"
      >
        5
      </button>
    </li>
    <li>
      <button
        class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-solid ms-control ms-control--size-sm ms-button ms-pagination__page"
        aria-current="page"
        aria-label="Page 6"
      >
        6
      </button>
    </li>
    <li>
      <button
        class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-ghost ms-control ms-control--size-sm ms-button ms-pagination__page ms-tone-base"
        aria-label="Page 7"
      >
        7
      </button>
    </li>
    <li><span class="ms-pagination__ellipsis" aria-hidden="true">…</span></li>
    <li>
      <button
        class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-ghost ms-control ms-control--size-sm ms-button ms-pagination__page ms-tone-base"
        aria-label="Page 20"
      >
        20
      </button>
    </li>
    <li>
      <button
        class="ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-ghost ms-control ms-control--size-sm ms-button ms-button--icon ms-tone-base"
        aria-label="Next page"
      >
        <span class="ms-pagination__arrow" aria-hidden="true">›</span>
      </button>
    </li>
  </ul>
</nav>
```

## Usage

```html
<nav class="ms-pagination ms-pagination--size-sm" aria-label="Pagination">
  <ul class="ms-pagination__list">
    <li>
      <button class="ms-button ms-button--icon …" aria-label="Previous page">
        <span class="ms-pagination__arrow" aria-hidden="true">‹</span>
      </button>
    </li>
    <li>
      <button class="ms-button ms-pagination__page …" aria-label="Page 1">
        1
      </button>
    </li>
    <li><span class="ms-pagination__ellipsis" aria-hidden="true">…</span></li>
    <li>
      <button
        class="ms-button ms-pagination__page …"
        aria-current="page"
        aria-label="Page 6"
      >
        6
      </button>
    </li>
    …
  </ul>
</nav>
```

Pages are buttons (`buttonRecipe()`, or links with `btnAs="a"`) at least as wide as they are
tall; give them the `ctlSize` of `ms-pagination--size-*`, which sizes the ellipses.
`paginationRange({ page, pageCount, siblingCount, boundaryCount })` returns which pages to show,
with `'ellipsis'` for the gaps, for any template. Its length doesn't change between pages, so the
buttons don't move under the pointer.
