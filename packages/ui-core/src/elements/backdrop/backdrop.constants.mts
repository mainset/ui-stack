// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import './backdrop-normalize.scss';
import './backdrop.scss';

const BACKDROP__CLASS_NAME_CONFIG = {
  baseClass: 'ms-backdrop',
  classNameDefinitionByPropName: {
    // boolean
    bckIsVisible: {
      modifier: 'visible',
      options: [true, false],
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { BACKDROP__CLASS_NAME_CONFIG };
