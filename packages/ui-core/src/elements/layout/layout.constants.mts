import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import { SIZE_PLAIN__ELEMENT_OPTIONS } from '../elements.constants.mjs';

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
      options: SIZE_PLAIN__ELEMENT_OPTIONS,
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { LAYOUT__CLASS_NAME_CONFIG };
