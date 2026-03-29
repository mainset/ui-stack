import type { ClassNameFromPropConfig } from '../../utils/index.mjs';

const BACKDROP__CLASS_NAME_CONFIG = {
  baseClass: 'ms-backdrop',
  classNameDefinitionByPropName: {
    // boolean
    bckIsVisible: {
      modifier: 'visible',
      options: [true, false],
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { BACKDROP__CLASS_NAME_CONFIG };
