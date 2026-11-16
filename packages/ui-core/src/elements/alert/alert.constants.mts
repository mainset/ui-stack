// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import './alert-normalize.scss';
import './alert.scss';

/**
 * A message in a tone: `ms-alert` + a surface (`surfaceRecipe({ srfTheme, srfVariant })`),
 * with `__icon`, `__content` (`__title`, `__description`), `__actions` and an optional close
 * `ms-button--icon` at the end
 */
const ALERT__CLASS_NAME_CONFIG = {
  baseClass: 'ms-alert',
  classNameDefinitionByPropName: {},
} as const satisfies ClassNameFromPropConfig;

export { ALERT__CLASS_NAME_CONFIG };
