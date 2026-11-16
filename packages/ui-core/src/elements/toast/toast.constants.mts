// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
// NOTE: a toast is an alert
import '../alert/alert.constants.mjs';
import './toast-normalize.scss';
import './toast.scss';

/**
 * A toast: `ms-alert ms-toast` + a surface, inside an `ms-toast-region` list.
 * `data-state="open" | "closed"` runs the enter / exit animation.
 */
const TOAST__CLASS_NAME_CONFIG = {
  baseClass: 'ms-toast',
  classNameDefinitionByPropName: {},
} as const satisfies ClassNameFromPropConfig;

export { TOAST__CLASS_NAME_CONFIG };
