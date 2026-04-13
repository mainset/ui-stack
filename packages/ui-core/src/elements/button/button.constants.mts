import type { ClassNameFromPropConfig } from '../../utils/index.mjs';

const BUTTON__CLASS_NAME_CONFIG = {
  baseClass: 'ms-button',
  classNameDefinitionByPropName: {
    // value-mapped
    btnTheme: {
      modifier: 'theme',
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
    },
    btnThemeVariant: {
      modifier: 'variant',
      options: ['solid', 'outlined', 'ghost'],
      defaultValue: 'solid',
    },
    // boolean
    btnIsDisabled: {
      modifier: 'disabled',
      options: [true, false],
    },
    btnIsFullWidth: {
      modifier: 'full-width',
      options: [true, false],
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { BUTTON__CLASS_NAME_CONFIG };
