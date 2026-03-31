import type {
  ClassNameFromPropConfig,
  StyleObjFromPropConfig,
} from '../../utils/index.mjs';

const SPACING__CLASS_NAME_CONFIG = {
  baseClass: 'ms-spacing',
  isSingleClassComposed: true,
  classNameDefinitionByPropName: {
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

const SPACING__STYLE_CONFIG = {
  styleDefinitionByPropName: {
    // value-mapped
    spcType: {
      modifiers: [
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
      cssVariableName: '--ms-spacing-scale',
      valueByModifier: {
        element: 2,
        component: 4,
        block: 6,
        section: 10,
      },
    },
    spcSize: {
      cssVariableName: '--ms-spacing-size',
      cssVariableNameModifierFromProp: 'spcType',
      valueByModifier: {
        xs: 1,
        sm: 2,
        base: 3,
        lg: 4,
        xl: 5,
      },
    },
    // NOTE: interval prop used for calculating the CSS variable value based on the scale and size props
    spcOffset: {
      cssVariableName: '--ms-spacing-offset',
      valueMappedFromProp: 'spcScale',
      valueByModifier: {
        element: 0,
        component: 10,
        block: 30,
        section: 60,
      },
    },
  },
} as const satisfies StyleObjFromPropConfig;

export { SPACING__CLASS_NAME_CONFIG, SPACING__STYLE_CONFIG };
