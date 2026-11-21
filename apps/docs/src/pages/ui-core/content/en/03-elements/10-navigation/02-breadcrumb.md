# Breadcrumb

## Example

```html preview
<nav class="ms-breadcrumb" aria-label="Breadcrumb">
  <ol class="ms-breadcrumb__list">
    <li class="ms-breadcrumb__item">
      <a class="ms-breadcrumb__link" href="#example">Home</a
      ><span class="ms-breadcrumb__separator" aria-hidden="true">/</span>
    </li>
    <li class="ms-breadcrumb__item">
      <a class="ms-breadcrumb__link" href="#example">Docs</a
      ><span class="ms-breadcrumb__separator" aria-hidden="true">/</span>
    </li>
    <li class="ms-breadcrumb__item">
      <span class="ms-breadcrumb__link" aria-current="page">Install</span>
    </li>
  </ol>
</nav>
```

## Usage

```html
<nav class="ms-breadcrumb" aria-label="Breadcrumb">
  <ol class="ms-breadcrumb__list">
    <li class="ms-breadcrumb__item">
      <a class="ms-breadcrumb__link" href="/">Home</a>
      <span class="ms-breadcrumb__separator" aria-hidden="true">/</span>
    </li>
    <li class="ms-breadcrumb__item">
      <span class="ms-breadcrumb__link" aria-current="page">Install</span>
    </li>
  </ol>
</nav>
```

The separators are in the markup (`aria-hidden`), so a screen reader doesn't read them.

NOTE on direction: `‹` `›` (U+2039 / U+203A) are mirrored by the browser in RTL text, so the
pagination arrows and a `›` breadcrumb separator point the right way in an RTL section without
any CSS. An icon separator would need mirroring.
