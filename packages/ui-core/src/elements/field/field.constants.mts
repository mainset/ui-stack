// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import './field-normalize.scss';
import './field.scss';

/** A form `<label>`; `--required` appends a decorative asterisk (use `required` on the input) */
const LABEL__CLASS_NAME_CONFIG = {
  baseClass: 'ms-label',
  classNameDefinitionByPropName: {
    // boolean
    lblIsRequired: {
      modifier: 'required',
      options: [true, false],
    },
  },
} as const satisfies ClassNameFromPropConfig;

/**
 * Label + control + hint + error, stacked:
 * `.ms-field` > `.ms-label`, the control, `.ms-field__hint`, `.ms-field__error`.
 */
const FIELD__CLASS_NAME_CONFIG = {
  baseClass: 'ms-field',
  classNameDefinitionByPropName: {},
} as const satisfies ClassNameFromPropConfig;

export { FIELD__CLASS_NAME_CONFIG, LABEL__CLASS_NAME_CONFIG };
