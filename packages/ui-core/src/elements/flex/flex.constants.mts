import type { ClassNameFromPropConfig } from '../../utils/index.mjs';

const FLEX_CONTAINER__CLASS_NAME_CONFIG = {
  baseClass: 'ms-flex',
  classNameDefinitionByPropName: {
    // value-mapped
    flxDisplay: {
      modifier: 'display',
      options: ['flex', 'inline-flex'],
      defaultValue: 'flex',
    },
    flxDirection: {
      modifier: 'flex-direction',
      options: ['row-reverse', 'column', 'column-reverse'],
    },
    flxJustify: {
      modifier: 'justify-content',
      options: ['space-between', 'center', 'flex-end'],
    },
    flxAlign: {
      modifier: 'align-items',
      options: ['center', 'flex-end'],
    },
  },
} as const satisfies ClassNameFromPropConfig;

const FLEX_ITEM__CLASS_NAME_CONFIG = {
  baseClass: 'ms-flex__item',
  classNameDefinitionByPropName: {
    // TODO:
  },
} as const satisfies ClassNameFromPropConfig;

export { FLEX_CONTAINER__CLASS_NAME_CONFIG, FLEX_ITEM__CLASS_NAME_CONFIG };
