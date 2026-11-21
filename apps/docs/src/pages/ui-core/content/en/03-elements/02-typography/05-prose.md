# Prose

## Example

```html preview
<div class="ms-prose">
  <h3>Install</h3>
  <p>
    Add the package, then <a href="#example">import the styles</a>. Press
    <kbd>⌘K</kbd> to search.
  </p>
  <ul>
    <li>Plain HTML: <code>styles/index.css</code></li>
    <li>A bundler: nothing to configure</li>
  </ul>
  <blockquote>Every element imports its own CSS.</blockquote>
</div>
```

## Usage

```html
<article class="ms-prose">
  <h2>Install</h2>
  <p>Add the package, then <a href="/docs/usage">import the styles</a>.</p>
</article>
```

`ms-prose` styles rich text whose markup has no classes, like rendered markdown or CMS content:

- an even flow of blocks (`--ms-prose-flow-space`)
- headings set apart from the section above
- lists, quotes, rules and images
- inline `code`, `kbd` and links in the `ms-code`, `ms-keyboard-key` and `ms-link` look

Only class-less lists and links are styled, so a component inside (an `ms-table`, a live
example) keeps its own look. This page's text is an `ms-prose`.
