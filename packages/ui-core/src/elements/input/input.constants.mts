// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
// NOTE: an input is always a control too (size, invalid state), so its CSS comes along
import '../control/control.constants.mjs';
import './input.scss';

/** Text-like `<input>`, `<textarea>` and native `<select>`, on top of `.ms-control` (sizes) */
const INPUT__CLASS_NAME_CONFIG = {
  baseClass: 'ms-input',
  classNameDefinitionByPropName: {},
} as const satisfies ClassNameFromPropConfig;

/** Wrapper of a native `<select class="ms-input">`, drawing its chevron */
const SELECT__CLASS_NAME_CONFIG = {
  baseClass: 'ms-select',
  classNameDefinitionByPropName: {},
} as const satisfies ClassNameFromPropConfig;

export { INPUT__CLASS_NAME_CONFIG, SELECT__CLASS_NAME_CONFIG };
