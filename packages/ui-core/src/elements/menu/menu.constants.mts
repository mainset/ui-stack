// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
// NOTE: a menu is a popover panel
import '../popover/popover.constants.mjs';
import './menu-normalize.scss';
import './menu.scss';

/**
 * A menu (`role="menu"`) on a popover: `ms-popover ms-menu` > `__item`s (`role="menuitem"`),
 * `__separator`s and groups with a `__group-label`. `__item--toned` + `ms-tone-*` colors an item
 * (e.g. a destructive one).
 */
const MENU__CLASS_NAME_CONFIG = {
  baseClass: 'ms-menu',
  classNameDefinitionByPropName: {},
} as const satisfies ClassNameFromPropConfig;

export { MENU__CLASS_NAME_CONFIG };
