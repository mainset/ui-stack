// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (layer order + tokens) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import { SPACING_SCALE__OPTIONS } from '../../tokens/index.mjs';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import { SIZE_PLAIN__ELEMENT_OPTIONS } from '../elements.constants.mjs';
import './spacing.scss';

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
      options: SPACING_SCALE__OPTIONS,
    },
    spcSize: {
      options: SIZE_PLAIN__ELEMENT_OPTIONS,
      defaultValue: 'base',
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { SPACING__CLASS_NAME_CONFIG };
