import type { ClassNameFromPropConfig } from '../utils/index.mjs';

const FLOATING_BOX__WRAPPER__CLASS_NAME_CONFIG = {
  baseClass: 'ms-floating-box',
  classNameDefinitionByPropName: {
    // value-mapped
    flbDirection: {
      modifier: 'direction',
      options: ['top', 'bottom', 'before', 'after'],
      defaultValue: 'bottom',
    },
    flbAlignment: {
      modifier: 'align',
      options: ['start', 'center', 'end'],
      defaultValue: 'center',
    },
    flbPlacement: {
      modifier: 'placement',
      options: ['outside', 'inside'],
      defaultValue: 'outside',
    },
    flbPosition: {
      modifier: 'position',
      options: ['absolute', 'static', 'fixed'],
      defaultValue: 'absolute',
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { FLOATING_BOX__WRAPPER__CLASS_NAME_CONFIG };
