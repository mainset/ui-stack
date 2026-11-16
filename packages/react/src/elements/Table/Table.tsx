import type {
  TableCellStyleProps,
  TableSortDirection,
  TableStyleProps,
} from '@mainset/ui-core';
import {
  TABLE_CELL__CLASS_NAME_CONFIG,
  TABLE_WRAPPER__CLASS_NAME_CONFIG,
  TABLE__CLASS_NAME_CONFIG,
  cnx,
  extractClassNamesFromProps,
} from '@mainset/ui-core';
import React from 'react';

import { splitStyleProps } from '../utils/index.mjs';

const { baseClass: TABLE } = TABLE__CLASS_NAME_CONFIG;

type TableProps = React.ComponentPropsWithRef<'table'> &
  TableStyleProps & {
    /**
     * Props of the wrapper that scrolls a wide table, e.g. a `style={{ maxBlockSize }}` for
     * `tblIsStickyHeader`, or `tabIndex={0}` + `role="region"` + `aria-label` so keyboard users
     * can scroll it
     */
    tblWrapperProps?: React.ComponentPropsWithRef<'div'>;
  };

/**
 * A data table in a wrapper that scrolls it when it's wider than its container. Compose it from
 * native parts: `Table.Caption`, `Table.Head` / `Body` / `Foot`, `Table.Row`,
 * `Table.HeaderCell` / `Table.Cell`, and `Table.SortableHeaderCell` for a sortable column (the
 * sort state is yours).
 *
 * @example
 * <Table tblIsHoverable>
 *   <Table.Head>
 *     <Table.Row>
 *       <Table.SortableHeaderCell tblSortDirection="ascending" tblOnSort={sortByName}>
 *         Name
 *       </Table.SortableHeaderCell>
 *       <Table.HeaderCell tblAlign="end">Amount</Table.HeaderCell>
 *     </Table.Row>
 *   </Table.Head>
 *   <Table.Body>…</Table.Body>
 * </Table>
 */
function Table({ tblWrapperProps, className, children, ...props }: TableProps) {
  const [classNames, tableProps, style] = splitStyleProps(
    [TABLE__CLASS_NAME_CONFIG],
    props,
  );

  return (
    <div
      {...tblWrapperProps}
      className={cnx(
        tblWrapperProps?.className,
        TABLE_WRAPPER__CLASS_NAME_CONFIG.baseClass,
      )}
    >
      <table
        className={cnx(className, classNames)}
        style={style}
        {...tableProps}
      >
        {children}
      </table>
    </div>
  );
}

type TableCaptionProps = React.ComponentPropsWithRef<'caption'>;
type TableSectionProps = React.ComponentPropsWithRef<'tbody'>;

const TableCaption = (props: TableCaptionProps) => <caption {...props} />;
const TableHead = (props: TableSectionProps) => <thead {...props} />;
const TableBody = (props: TableSectionProps) => <tbody {...props} />;
const TableFoot = (props: TableSectionProps) => <tfoot {...props} />;

type TableRowProps = React.ComponentPropsWithRef<'tr'> & {
  /** Highlights it in the current tone (`aria-selected`) */
  tblIsSelected?: boolean;
};

function TableRow({ tblIsSelected, ...props }: TableRowProps) {
  return <tr aria-selected={tblIsSelected || undefined} {...props} />;
}

function cellClassNames(props: TableCellStyleProps & { className?: string }) {
  const { className, ...rest } = props;
  const [classNames, cellProps] = extractClassNamesFromProps(
    [TABLE_CELL__CLASS_NAME_CONFIG],
    rest,
  );

  return [cnx(className, classNames), cellProps] as const;
}

type TableHeaderCellProps = React.ComponentPropsWithRef<'th'> &
  TableCellStyleProps;

/** A header cell; `scope` is `col` unless given (`scope="row"` for a row header) */
function TableHeaderCell({ scope = 'col', ...props }: TableHeaderCellProps) {
  const [className, cellProps] = cellClassNames(props);

  return <th scope={scope} className={className} {...cellProps} />;
}

type TableCellProps = React.ComponentPropsWithRef<'td'> & TableCellStyleProps;

function TableCell(props: TableCellProps) {
  const [className, cellProps] = cellClassNames(props);

  return <td className={className} {...cellProps} />;
}

type TableSortableHeaderCellProps = Omit<TableHeaderCellProps, 'aria-sort'> & {
  /** The current sort of this column; `null` / unset when the table is sorted by another one */
  tblSortDirection?: TableSortDirection | null;
  /** The header button was pressed: sort by this column, or flip its direction */
  tblOnSort?: React.MouseEventHandler<HTMLButtonElement>;
};

/**
 * A column header that sorts the table: its label is a button (`tblOnSort`), and `aria-sort`
 * tells assistive tech the current direction. Only the sorted column has one.
 */
function TableSortableHeaderCell({
  tblSortDirection,
  tblOnSort,
  children,
  ...props
}: TableSortableHeaderCellProps) {
  return (
    <TableHeaderCell aria-sort={tblSortDirection || undefined} {...props}>
      <button type="button" className={`${TABLE}__sort`} onClick={tblOnSort}>
        {children}
        <span className={`${TABLE}__sort-icon`} aria-hidden="true" />
      </button>
    </TableHeaderCell>
  );
}

Table.Caption = TableCaption;
Table.Head = TableHead;
Table.Body = TableBody;
Table.Foot = TableFoot;
Table.Row = TableRow;
Table.HeaderCell = TableHeaderCell;
Table.Cell = TableCell;
Table.SortableHeaderCell = TableSortableHeaderCell;

export { Table };
export type {
  TableCaptionProps,
  TableCellProps,
  TableHeaderCellProps,
  TableProps,
  TableRowProps,
  TableSectionProps,
  TableSortableHeaderCellProps,
};
