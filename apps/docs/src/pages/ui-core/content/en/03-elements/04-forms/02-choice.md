# Checkbox, radio, switch

## Example

```html preview
<label class="ms-choice">
  <span class="ms-checkbox"
    ><input type="checkbox" class="ms-checkbox__input" checked /><svg
      class="ms-checkbox__icon"
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <path class="ms-checkbox__check" d="M3.75 8.25l2.75 2.75 5.75-6" />
      <path class="ms-checkbox__dash" d="M4.5 8h7" /></svg
  ></span>
  <span>I accept the terms</span>
</label>
<label class="ms-choice">
  <input type="radio" class="ms-radio" name="preview-plan" checked />
  <span>Pro</span>
</label>
<label class="ms-choice">
  <input type="radio" class="ms-radio" name="preview-plan" />
  <span>Team</span>
</label>
<label class="ms-choice ms-tone-success">
  <span class="ms-switch">
    <input type="checkbox" role="switch" class="ms-switch__input" checked />
    <span class="ms-switch__thumb" aria-hidden="true"></span>
  </span>
  <span>Notifications</span>
</label>
```

## Usage

```html
<label class="ms-choice">
  <span class="ms-checkbox">
    <input type="checkbox" class="ms-checkbox__input" name="terms" />
    <!-- CHECKBOX_ICON__SVG from @mainset/ui-core -->
  </span>
  <span>I accept the terms</span>
</label>

<label class="ms-choice">
  <input type="radio" class="ms-radio" name="plan" value="pro" />
  <span>Pro</span>
</label>

<label class="ms-choice">
  <span class="ms-switch">
    <input type="checkbox" role="switch" class="ms-switch__input" />
    <span class="ms-switch__thumb" aria-hidden="true"></span>
  </span>
  <span>Notifications</span>
</label>
```

- Checked in the current tone: put `ms-tone-success` on the label (or any ancestor) to re-color.
- The checkbox icon is an svg after the input (`CHECKBOX_ICON__SVG`), the switch thumb a span
  after it: nothing is drawn with pseudo-elements on inputs, which Firefox 78 can't render.
- The switch thumb moves along the inline axis (`margin-inline-start`), so "on" is at the inline
  end in LTR and RTL sections alike.
- Indeterminate: set the DOM property `input.indeterminate = true` (React: `chkIsIndeterminate`).
