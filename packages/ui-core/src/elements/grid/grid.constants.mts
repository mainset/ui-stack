// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import './grid.scss';

// 1–12, the CSS grid track counts of a 12-column layout
const GRID_COLUMN__OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

const GRID_CONTAINER__CLASS_NAME_CONFIG = {
  baseClass: 'ms-grid',
  classNameDefinitionByPropName: {
    // css-based
    grdDisplay: {
      modifier: 'display',
      options: ['grid', 'inline-grid'],
      defaultValue: 'grid',
      responsive: 'class',
    },
    grdAutoFlow: {
      modifier: 'grid-auto-flow',
      options: ['row', 'column', 'row-dense', 'column-dense'],
      responsive: 'class',
    },
    // value-mapped: equal columns; without it the grid auto-fits (`--ms-grid-columns-number`)
    grdColumns: {
      modifier: 'columns',
      options: GRID_COLUMN__OPTIONS,
      responsive: 'css-var',
      cssValue: 'repeat({option}, minmax(0, 1fr))',
    },
  },
} as const satisfies ClassNameFromPropConfig;

const GRID_ITEM__CLASS_NAME_CONFIG = {
  baseClass: 'ms-grid__item',
  classNameDefinitionByPropName: {
    // value-mapped: how many columns the item spans
    grdColSpan: {
      modifier: 'col-span',
      options: GRID_COLUMN__OPTIONS,
      responsive: 'css-var',
      cssValue: 'span {option} / span {option}',
    },
    // boolean: the whole row, whatever the column count
    grdIsFullRow: {
      modifier: 'full-row',
      options: [true, false],
    },
  },
} as const satisfies ClassNameFromPropConfig;

export {
  GRID_COLUMN__OPTIONS,
  GRID_CONTAINER__CLASS_NAME_CONFIG,
  GRID_ITEM__CLASS_NAME_CONFIG,
};
