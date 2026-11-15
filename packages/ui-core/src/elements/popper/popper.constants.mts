// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import './popper.scss';

const POPPER_WRAPPER__CLASS_NAME_CONFIG = {
  baseClass: 'ms-popper',
  classNameDefinitionByPropName: {
    // value-mapped
    popIsOpen: {
      modifier: 'open',
      options: [true, false],
      defaultValue: false,
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { POPPER_WRAPPER__CLASS_NAME_CONFIG };
