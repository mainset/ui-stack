// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import './popover-normalize.scss';
import './popover.scss';

/**
 * A floating panel (popover content, menus): surface, border, shadow. Positioned by script
 * (`position: fixed` + inline `top` / `left`); `data-state="open" | "closed"` animates it.
 */
const POPOVER__CLASS_NAME_CONFIG = {
  baseClass: 'ms-popover',
  classNameDefinitionByPropName: {},
} as const satisfies ClassNameFromPropConfig;

export { POPOVER__CLASS_NAME_CONFIG };
