import type { ClassNameFromPropConfig } from '../../utils/index.mjs';

const POPPER_WRAPPER__CLASS_NAME_CONFIG = {
  baseClass: 'ms-popper',
  classNameDefinitionByPropName: {
    // value-mapped
    popIsOpened: {
      modifier: 'opened',
      options: [true, false],
      defaultValue: false,
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { POPPER_WRAPPER__CLASS_NAME_CONFIG };
