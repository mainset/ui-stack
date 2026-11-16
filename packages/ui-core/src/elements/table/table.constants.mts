// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import './table-normalize.scss';
import './table.scss';

/**
 * A data table: `ms-table-wrapper` (scrolls a wide table, and holds the sticky header) >
 * `table.ms-table` with `caption`, `thead`, `tbody`, `tfoot`. A selected row is
 * `tr[aria-selected="true"]`; a sortable column header holds a `__sort` button with a
 * `__sort-icon`, its direction read from the `th`'s `aria-sort`.
 */
const TABLE__CLASS_NAME_CONFIG = {
  baseClass: 'ms-table',
  classNameDefinitionByPropName: {
    // boolean
    tblIsStriped: {
      modifier: 'striped',
      options: [true, false],
    },
    tblIsHoverable: {
      modifier: 'hoverable',
      options: [true, false],
    },
    // a line around every cell, not only between rows
    tblIsBordered: {
      modifier: 'bordered',
      options: [true, false],
    },
    // the header row stays at the top of the scrolling `ms-table-wrapper`
    tblIsStickyHeader: {
      modifier: 'sticky-header',
      options: [true, false],
    },
    // value-mapped
    tblSize: {
      modifier: 'size',
      options: ['sm', 'base', 'lg'],
      defaultValue: 'base',
    },
  },
} as const satisfies ClassNameFromPropConfig;

/** `ms-table__cell--align-*` on a `th` / `td`: numbers line up at the end */
const TABLE_CELL__CLASS_NAME_CONFIG = {
  baseClass: 'ms-table__cell',
  classNameDefinitionByPropName: {
    // value-mapped
    tblAlign: {
      modifier: 'align',
      options: ['start', 'center', 'end'],
    },
  },
} as const satisfies ClassNameFromPropConfig;

/** Scrolls a table wider (or, with a max block size, taller) than its container */
const TABLE_WRAPPER__CLASS_NAME_CONFIG = {
  baseClass: 'ms-table-wrapper',
  classNameDefinitionByPropName: {},
} as const satisfies ClassNameFromPropConfig;

export {
  TABLE__CLASS_NAME_CONFIG,
  TABLE_CELL__CLASS_NAME_CONFIG,
  TABLE_WRAPPER__CLASS_NAME_CONFIG,
};
