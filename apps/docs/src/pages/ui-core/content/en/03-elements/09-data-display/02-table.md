# Table

## Example

```html preview
<div class="ms-table-wrapper" tabindex="0" role="region" aria-label="Invoices">
  <table class="ms-table ms-table--hoverable ms-table--size-sm">
    <thead>
      <tr>
        <th class="ms-table__cell" scope="col" aria-sort="ascending">
          <button class="ms-table__sort" type="button">
            Invoice<span class="ms-table__sort-icon" aria-hidden="true"></span>
          </button>
        </th>
        <th class="ms-table__cell" scope="col">Customer</th>
        <th class="ms-table__cell ms-table__cell--align-end" scope="col">
          Amount
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th class="ms-table__cell" scope="row">INV-001</th>
        <td class="ms-table__cell">Ada Lovelace</td>
        <td class="ms-table__cell ms-table__cell--align-end">1,250.00</td>
      </tr>
      <tr aria-selected="true">
        <th class="ms-table__cell" scope="row">INV-002</th>
        <td class="ms-table__cell">Alan Turing</td>
        <td class="ms-table__cell ms-table__cell--align-end">310.50</td>
      </tr>
      <tr>
        <th class="ms-table__cell" scope="row">INV-003</th>
        <td class="ms-table__cell">Grace Hopper</td>
        <td class="ms-table__cell ms-table__cell--align-end">89.99</td>
      </tr>
    </tbody>
  </table>
</div>
```

## Usage

```html
<div class="ms-table-wrapper" tabindex="0" role="region" aria-label="Invoices">
  <table class="ms-table ms-table--hoverable ms-table--size-sm">
    <thead>
      <tr>
        <th class="ms-table__cell" scope="col" aria-sort="ascending">
          <button class="ms-table__sort" type="button">
            Invoice<span class="ms-table__sort-icon" aria-hidden="true"></span>
          </button>
        </th>
        <th class="ms-table__cell ms-table__cell--align-end" scope="col">
          Amount
        </th>
      </tr>
    </thead>
    <tbody>
      <tr aria-selected="true">
        <th class="ms-table__cell" scope="row">INV-001</th>
        <td class="ms-table__cell ms-table__cell--align-end">1,250.00</td>
      </tr>
    </tbody>
  </table>
</div>
```

The wrapper scrolls a table wider than its container (and, with a `max-block-size`, taller: then
`ms-table--sticky-header` keeps the header row in view). Modifiers: `--size-{sm|base|lg}`
(density), `--striped`, `--hoverable`, `--bordered` (a frame and lines between columns).
`ms-table__cell--align-{start|center|end}` aligns a column; numbers use tabular figures.
A selected row is `tr[aria-selected="true"]`, in the current tone.

Sorting: the header label is a `__sort` button; only the sorted column has `aria-sort`, which
turns its `__sort-icon` into a chevron up (`ascending`) or down (`descending`). Sorting the rows
is yours.
