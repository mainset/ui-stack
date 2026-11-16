// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import './disclosure-normalize.scss';
import './disclosure.scss';

/**
 * An expandable section (an accordion item): `ms-disclosure` > `__heading` (h2–h6) >
 * `__trigger` button (`aria-expanded`, `aria-controls`) with a `__icon` span, then the
 * `__panel` (`hidden` while collapsed). Works with a native `<details>` too, with your own JS.
 */
const DISCLOSURE__CLASS_NAME_CONFIG = {
  baseClass: 'ms-disclosure',
  classNameDefinitionByPropName: {},
} as const satisfies ClassNameFromPropConfig;

export { DISCLOSURE__CLASS_NAME_CONFIG };
