import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import {
  TABLE_CELL__CLASS_NAME_CONFIG,
  TABLE__CLASS_NAME_CONFIG,
} from './table.constants.mjs';

type TableOption<
  K extends
    keyof (typeof TABLE__CLASS_NAME_CONFIG)['classNameDefinitionByPropName'],
> = ExtractClassNameFromPropOptions<typeof TABLE__CLASS_NAME_CONFIG, K> | null;

interface TableStyleProps {
  // boolean
  tblIsStriped?: TableOption<'tblIsStriped'>;
  tblIsHoverable?: TableOption<'tblIsHoverable'>;
  /** A line around every cell, not only between rows */
  tblIsBordered?: TableOption<'tblIsBordered'>;
  /** The header row stays at the top of the scrolling `ms-table-wrapper` */
  tblIsStickyHeader?: TableOption<'tblIsStickyHeader'>;
  // value-mapped
  tblSize?: TableOption<'tblSize'>;
}

interface TableCellStyleProps {
  // value-mapped
  tblAlign?: ExtractClassNameFromPropOptions<
    typeof TABLE_CELL__CLASS_NAME_CONFIG,
    'tblAlign'
  > | null;
}

/** `aria-sort` of a sortable column header */
type TableSortDirection = 'ascending' | 'descending';

export type { TableCellStyleProps, TableSortDirection, TableStyleProps };
