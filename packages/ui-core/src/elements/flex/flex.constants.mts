import type { ClassNameFromPropConfig } from '../../utils/index.mjs';

const FLEX_CONTAINER__CLASS_NAME_CONFIG = {
  baseClass: 'ms-flex',
  classNameDefinitionByPropName: {
    // css-based
    flxDisplay: {
      modifier: 'display',
      options: ['flex', 'inline-flex'],
      defaultValue: 'flex',
    },
    flxDirection: {
      modifier: 'flex-direction',
      options: ['row-reverse', 'column', 'column-reverse'],
    },
  },
} as const satisfies ClassNameFromPropConfig;

const FLEX_ITEM__CLASS_NAME_CONFIG = {
  baseClass: 'ms-flex__item',
  classNameDefinitionByPropName: {
    // value-mapped
    flxGrow: {
      modifier: 'flex-grow',
      options: ['initial', 1],
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { FLEX_CONTAINER__CLASS_NAME_CONFIG, FLEX_ITEM__CLASS_NAME_CONFIG };
