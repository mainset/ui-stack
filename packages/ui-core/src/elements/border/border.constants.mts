// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (layer order + tokens) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import {
  COLOR__ELEMENT_OPTIONS,
  SIZE_EXTENDED__ELEMENT_OPTIONS,
  SIZE_PLAIN__ELEMENT_OPTIONS,
} from '../elements.constants.mjs';
import './border.scss';

const BORDER__CLASS_NAME_CONFIG = {
  baseClass: 'ms-border',
  classNameDefinitionByPropName: {
    // value-mapped
    brdColor: {
      modifier: 'color',
      options: COLOR__ELEMENT_OPTIONS,
      // defaultValue: 'transparent',
    },
    brdRadius: {
      modifier: 'radius',
      options: [
        // static
        'pill',
        'circle',
        // dynamic
        ...SIZE_EXTENDED__ELEMENT_OPTIONS,
      ],
    },
    brdStyle: {
      modifier: 'style',
      options: ['solid', 'dashed', 'dotted', 'double'],
      // defaultValue: 'solid',
    },
    brdWidth: {
      modifier: 'width',
      options: SIZE_PLAIN__ELEMENT_OPTIONS,
      // defaultValue: 'base',
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { BORDER__CLASS_NAME_CONFIG };
