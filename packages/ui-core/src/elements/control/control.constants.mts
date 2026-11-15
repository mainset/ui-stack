// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import { SIZE_PLAIN__ELEMENT_OPTIONS } from '../elements.constants.mjs';
import './control.scss';

const CONTROL__CLASS_NAME_CONFIG = {
  baseClass: 'ms-control',
  classNameDefinitionByPropName: {
    // value-mapped
    ctlSize: {
      modifier: 'size',
      options: SIZE_PLAIN__ELEMENT_OPTIONS,
      defaultValue: 'base',
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { CONTROL__CLASS_NAME_CONFIG };
