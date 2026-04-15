import type { ClassNameFromPropConfig } from '../../utils/index.mjs';

const BACKGROUND__CLASS_NAME_CONFIG = {
  baseClass: 'ms-background',
  classNameDefinitionByPropName: {
    // value-mapped
    bgColor: {
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
      // defaultValue: 'transparent',
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { BACKGROUND__CLASS_NAME_CONFIG };
