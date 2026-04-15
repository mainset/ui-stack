import type { ClassNameFromPropConfig } from '../../utils/index.mjs';

const SURFACE__CLASS_NAME_CONFIG = {
  baseClass: 'ms-surface',
  classNameDefinitionByPropName: {
    // value-mapped
    srfHover: {
      modifier: 'hover',
      options: ['bg', 'border', 'all'],
    },
    srfVariant: {
      modifier: 'variant',
      options: ['solid', 'outlined', 'ghost'],
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { SURFACE__CLASS_NAME_CONFIG };
