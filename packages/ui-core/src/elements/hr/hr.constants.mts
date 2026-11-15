// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import { COLOR__ELEMENT_OPTIONS } from '../elements.constants.mjs';
import './hr.scss';

const HR__CLASS_NAME_CONFIG = {
  baseClass: 'ms-break',
  classNameDefinitionByPropName: {
    // value-mapped
    hrColor: {
      modifier: 'color',
      options: COLOR__ELEMENT_OPTIONS,
      defaultValue: 'base',
    },
    hrDirection: {
      modifier: 'direction',
      options: ['horizontal', 'vertical'],
      defaultValue: 'horizontal',
    },
    // boolean
    hrIsHidden: {
      modifier: 'hidden',
      options: [true, false],
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { HR__CLASS_NAME_CONFIG };
