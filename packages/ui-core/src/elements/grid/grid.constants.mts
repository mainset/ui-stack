import type { ClassNameFromPropConfig } from '../../utils/index.mjs';

const GRID_CONTAINER__CLASS_NAME_CONFIG = {
  baseClass: 'ms-grid',
  classNameDefinitionByPropName: {
    // css-based
    grdDisplay: {
      modifier: 'display',
      options: ['grid', 'inline-grid'],
      defaultValue: 'grid',
    },
    grdAutoFlow: {
      modifier: 'grid-auto-flow',
      options: ['row', 'column', 'row-dense', 'column-dense'],
    },
  },
} as const satisfies ClassNameFromPropConfig;

const GRID_ITEM__CLASS_NAME_CONFIG = {
  baseClass: 'ms-grid__item',
  classNameDefinitionByPropName: {
    // TODO:
  },
} as const satisfies ClassNameFromPropConfig;

export { GRID_CONTAINER__CLASS_NAME_CONFIG, GRID_ITEM__CLASS_NAME_CONFIG };
