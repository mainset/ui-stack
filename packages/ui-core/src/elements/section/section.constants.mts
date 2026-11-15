// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import { SIZE_PLAIN__ELEMENT_OPTIONS } from '../elements.constants.mjs';
import './section.scss';

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
        ...SIZE_PLAIN__ELEMENT_OPTIONS,
      ],
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { SECTION__CLASS_NAME_CONFIG };
