// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (layer order + tokens) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import { COLOR__ELEMENT_OPTIONS } from '../elements.constants.mjs';
import './background.scss';

const BACKGROUND__CLASS_NAME_CONFIG = {
  baseClass: 'ms-background',
  classNameDefinitionByPropName: {
    // value-mapped
    bgColor: {
      modifier: 'color',
      options: COLOR__ELEMENT_OPTIONS,
      // defaultValue: 'transparent',
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { BACKGROUND__CLASS_NAME_CONFIG };
