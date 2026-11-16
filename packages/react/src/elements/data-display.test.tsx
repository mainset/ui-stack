// @vitest-environment jsdom
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { click, render } from '../../test/dom.js';
import { Progress } from './Progress/index.mjs';
import { Skeleton } from './Skeleton/index.mjs';
import { Table } from './Table/index.mjs';

const html = (element: React.ReactElement) => renderToStaticMarkup(element);

let unmount: () => void = () => undefined;

afterEach(() => unmount());

describe('Table', () => {
  it('is a table in a scrolling wrapper, with the style modifiers', () => {
    const markup = html(
      <Table
        tblSize="sm"
        tblIsStriped
        tblIsStickyHeader
        aria-label="Invoices"
        tblWrapperProps={{ tabIndex: 0, style: { maxBlockSize: 320 } }}
      >
        <Table.Body>
          <Table.Row tblIsSelected>
            <Table.HeaderCell scope="row">INV-1</Table.HeaderCell>
            <Table.Cell tblAlign="end">42</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );

    expect(markup).toBe(
      '<div tabindex="0" style="max-block-size:320px" class="ms-table-wrapper">' +
        '<table class="ms-table ms-table--striped ms-table--sticky-header ms-table--size-sm" aria-label="Invoices">' +
        '<tbody><tr aria-selected="true">' +
        '<th scope="row" class="ms-table__cell">INV-1</th>' +
        '<td class="ms-table__cell ms-table__cell--align-end">42</td>' +
        '</tr></tbody></table></div>',
    );
  });

  it('header cells are column headers by default', () => {
    expect(html(<Table.HeaderCell>Name</Table.HeaderCell>)).toBe(
      '<th scope="col" class="ms-table__cell">Name</th>',
    );
  });

  it('a sortable header is a button; only the sorted column has aria-sort', () => {
    const onSort = vi.fn();
    ({ unmount } = render(
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.SortableHeaderCell
              tblSortDirection="descending"
              tblOnSort={onSort}
            >
              Name
            </Table.SortableHeaderCell>
            <Table.SortableHeaderCell tblSortDirection={null}>
              Date
            </Table.SortableHeaderCell>
          </Table.Row>
        </Table.Head>
      </Table>,
    ));

    const [name, date] = document.querySelectorAll('th');
    expect(name.getAttribute('aria-sort')).toBe('descending');
    expect(date.hasAttribute('aria-sort')).toBe(false);

    const button = name.querySelector('button')!;
    expect(button.className).toBe('ms-table__sort');
    expect(button.getAttribute('type')).toBe('button');
    expect(button.textContent).toBe('Name');
    expect(
      button.querySelector('.ms-table__sort-icon')!.getAttribute('aria-hidden'),
    ).toBe('true');

    click(button);
    expect(onSort).toHaveBeenCalledTimes(1);
  });
});

describe('Skeleton', () => {
  it('is decorative, a rect by default', () => {
    expect(html(<Skeleton style={{ inlineSize: 120 }} />)).toBe(
      '<span aria-hidden="true" class="ms-skeleton ms-skeleton--variant-rect" style="inline-size:120px"></span>',
    );
  });

  it('renders text lines', () => {
    const markup = html(<Skeleton sklVariant="text" sklLines={3} />);

    expect(
      markup.startsWith('<span aria-hidden="true" class="ms-skeleton-lines">'),
    ).toBe(true);
    expect(markup.match(/ms-skeleton--variant-text/g)).toHaveLength(3);
  });

  it('takes the shape of its children, and shows them once loaded', () => {
    expect(html(<Skeleton sklIsLoading>Ada Lovelace</Skeleton>)).toContain(
      '>Ada Lovelace</span>',
    );
    expect(html(<Skeleton sklIsLoading={false}>Ada Lovelace</Skeleton>)).toBe(
      'Ada Lovelace',
    );
  });
});

describe('Progress', () => {
  it('is a progressbar filled to its value', () => {
    expect(
      html(
        <Progress
          aria-label="Upload"
          prgValue={30}
          prgMax={120}
          prgTone="success"
        />,
      ),
    ).toBe(
      '<div role="progressbar" aria-valuemin="0" aria-valuemax="120" aria-valuenow="30" ' +
        'class="ms-progress ms-progress--size-base ms-tone-success" ' +
        'style="--ms-progress-value:0.25" aria-label="Upload">' +
        '<span class="ms-progress__bar"></span></div>',
    );
  });

  it('clamps the value, and is indeterminate without one', () => {
    expect(html(<Progress prgValue={140} />)).toContain('aria-valuenow="100"');

    const markup = html(<Progress aria-label="Loading" />);
    expect(markup).not.toContain('aria-valuenow');
    expect(markup).toContain('ms-progress--indeterminate');
  });
});
