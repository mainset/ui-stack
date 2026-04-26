import type { ClassNameFromPropConfig } from '../../utils/index.mjs';

const LAYOUT__CLASS_NAME_CONFIG = {
  baseClass: 'ms-layout',
  classNameDefinitionByPropName: {
    // value-mapped
    layJustify: {
      modifier: 'justify-content',
      options: ['space-between', 'center', 'flex-end'],
    },
    layAlign: {
      modifier: 'align-items',
      options: ['center', 'flex-end'],
    },
    layGapSize: {
      modifier: 'gap-size',
      options: ['xs', 'sm', 'base', 'lg', 'xl'],
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { LAYOUT__CLASS_NAME_CONFIG };
