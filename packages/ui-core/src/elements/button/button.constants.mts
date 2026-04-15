import type { ClassNameFromPropConfig } from '../../utils/index.mjs';

const BUTTON__CLASS_NAME_CONFIG = {
  baseClass: 'ms-button',
  classNameDefinitionByPropName: {
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
