import type { ClassNameFromPropConfig } from '../utils/index.mjs';

const SPACING__CLASS_NAME_CONFIG = {
  baseClass: 'ms-spacing',
  isSingleClassComposed: true,
  propDefinitionByName: {
    // value-mapped
    spcType: {
      options: [
        'm', // margin
        'p', // padding

        // margin
        'mt', // top
        'me', // end (right in LTR, left in RTL)
        'mb', // bottom
        'ms', // start (left in LTR, right in RTL)
        'mv', // vertical
        'mh', // horizontal

        // padding
        'pt', // top
        'pe', // end (right in LTR, left in RTL)
        'pb', // bottom
        'ps', // start (left in LTR, right in RTL)
        'pv', // vertical
        'ph', // horizontal
      ],
    },
    spcScale: {
      options: ['element', 'component', 'block', 'section'],
    },
    spcSize: {
      options: [
        // 'xxxs',
        // 'xxs',
        'xs',
        'sm',
        'base',
        'lg',
        'xl',
        // 'xxl',
        // 'xxxl',
      ],
      defaultValue: 'base',
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { SPACING__CLASS_NAME_CONFIG };
