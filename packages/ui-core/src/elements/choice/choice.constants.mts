// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
// NOTE: choices share the input tokens (`--ms-input-background`, …)
import '../input/input.constants.mjs';
import './choice.scss';

// Checked colors follow the current tone (`--ms-tone-solid` / `--ms-tone-on-solid`)

/** Wrapper of `<input type="checkbox" class="ms-checkbox__input">` + its `.ms-checkbox__icon` svg */
const CHECKBOX__CLASS_NAME_CONFIG = {
  baseClass: 'ms-checkbox',
  classNameDefinitionByPropName: {},
} as const satisfies ClassNameFromPropConfig;

/** On `<input type="radio">` itself (the dot is a gradient, no extra markup) */
const RADIO__CLASS_NAME_CONFIG = {
  baseClass: 'ms-radio',
  classNameDefinitionByPropName: {},
} as const satisfies ClassNameFromPropConfig;

/** On `<input type="checkbox" role="switch">` itself (track + sliding thumb) */
const SWITCH__CLASS_NAME_CONFIG = {
  baseClass: 'ms-switch',
  classNameDefinitionByPropName: {},
} as const satisfies ClassNameFromPropConfig;

/** A `<label>` laying out a checkbox / radio / switch next to its text */
const CHOICE__CLASS_NAME_CONFIG = {
  baseClass: 'ms-choice',
  classNameDefinitionByPropName: {},
} as const satisfies ClassNameFromPropConfig;

/**
 * The checkbox icon, for markup written by hand (plain HTML, other frameworks): place it right
 * after the input, inside `.ms-checkbox`. Its stroke is `--ms-tone-on-solid`.
 */
const CHECKBOX_ICON__SVG =
  '<svg class="ms-checkbox__icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">' +
  '<path class="ms-checkbox__check" d="M3.75 8.25l2.75 2.75 5.75-6"/>' +
  '<path class="ms-checkbox__dash" d="M4.5 8h7"/>' +
  '</svg>';

export {
  CHECKBOX__CLASS_NAME_CONFIG,
  CHECKBOX_ICON__SVG,
  CHOICE__CLASS_NAME_CONFIG,
  RADIO__CLASS_NAME_CONFIG,
  SWITCH__CLASS_NAME_CONFIG,
};
