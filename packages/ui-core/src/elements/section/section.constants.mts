import type { ClassNameFromPropConfig } from '../../utils/index.mjs';

const SECTION__CLASS_NAME_CONFIG = {
  baseClass: 'ms-section',
  classNameDefinitionByPropName: {
    // value-mapped
    secMaxWidth: {
      modifier: 'max-width',
      options: [
        // percentage
        '25',
        '33',
        '50',
        '75',
        // responsive breakpoints
        'xs',
        'sm',
        'md',
        'lg',
        'xl',
      ],
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { SECTION__CLASS_NAME_CONFIG };
