// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import './tooltip-normalize.scss';
import './tooltip.scss';

/** A short description (`role="tooltip"`) of its trigger, `hidden` until hover / focus */
const TOOLTIP__CLASS_NAME_CONFIG = {
  baseClass: 'ms-tooltip',
  classNameDefinitionByPropName: {},
} as const satisfies ClassNameFromPropConfig;

export { TOOLTIP__CLASS_NAME_CONFIG };
