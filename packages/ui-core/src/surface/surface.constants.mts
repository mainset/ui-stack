import type { ClassNameFromPropConfig } from '../utils/index.mjs';

const SURFACE__CLASS_NAME_CONFIG = {
  baseClass: 'ms-surface',
  classNameDefinitionByPropName: {
    // value-mapped
    srfBackgroundColor: {
      modifier: 'bg-color',
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
    srfBorderRadius: {
      modifier: 'radius',
      options: [
        // static
        'pill',
        'circle',
        // dynamic
        'xxs',
        'xs',
        'sm',
        'md',
        'lg',
        'xl',
        'xxl',
        'xxxl',
      ],
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { SURFACE__CLASS_NAME_CONFIG };
