import type { ClassNameFromPropConfig } from '../../utils/index.mjs';

const BORDER__CLASS_NAME_CONFIG = {
  baseClass: 'ms-border',
  classNameDefinitionByPropName: {
    // value-mapped
    brdColor: {
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
    brdRadius: {
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
    brdStyle: {
      modifier: 'style',
      options: ['solid', 'dashed', 'dotted', 'double'],
      // defaultValue: 'solid',
    },
    brdWidth: {
      modifier: 'width',
      options: ['sm', 'base', 'lg'],
      // defaultValue: 'base',
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { BORDER__CLASS_NAME_CONFIG };
