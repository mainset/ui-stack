import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import { COLOR__ELEMENT_OPTIONS } from '../elements.constants.mjs';

const BACKGROUND__CLASS_NAME_CONFIG = {
  baseClass: 'ms-background',
  classNameDefinitionByPropName: {
    // value-mapped
    bgColor: {
      modifier: 'color',
      options: COLOR__ELEMENT_OPTIONS,
      // defaultValue: 'transparent',
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { BACKGROUND__CLASS_NAME_CONFIG };
