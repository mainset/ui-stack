// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import './button-normalize.scss';
import './button.scss';

const BUTTON__CLASS_NAME_CONFIG = {
  baseClass: 'ms-button',
  classNameDefinitionByPropName: {
    // boolean
    btnIsDisabled: {
      modifier: 'disabled',
      options: [true, false],
    },
    btnIsFullWidth: {
      modifier: 'full-width',
      options: [true, false],
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { BUTTON__CLASS_NAME_CONFIG };
