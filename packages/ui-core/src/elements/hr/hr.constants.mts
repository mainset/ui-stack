import type { ClassNameFromPropConfig } from '../../utils/index.mjs';

const HR__CLASS_NAME_CONFIG = {
  baseClass: 'ms-break',
  classNameDefinitionByPropName: {
    // value-mapped
    hrColor: {
      modifier: 'color',
      options: [
        // css basic
        'transparent',
        // semantic
        'primary',
        'secondary',
        'tertiary',
        // contextual
        'error',
        'info',
        'success',
        'warning',
        // neutral
        'base',
        'muted',
        'inverse',
      ],
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
