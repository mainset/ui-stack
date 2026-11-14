import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import { COLOR__ELEMENT_OPTIONS } from '../elements.constants.mjs';

const HR__CLASS_NAME_CONFIG = {
  baseClass: 'ms-break',
  classNameDefinitionByPropName: {
    // value-mapped
    hrColor: {
      modifier: 'color',
      options: COLOR__ELEMENT_OPTIONS,
      defaultValue: 'base',
    },
    hrDirection: {
      modifier: 'direction',
      options: ['horizontal', 'vertical'],
      defaultValue: 'horizontal',
    },
    // boolean
    hrIsHidden: {
      modifier: 'hidden',
      options: [true, false],
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { HR__CLASS_NAME_CONFIG };
