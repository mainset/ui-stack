// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
// NOTE: pages are buttons; their CSS goes first, so the page sizing below wins
import '../button/button.constants.mjs';
import '../control/control.constants.mjs';
import { SIZE_PLAIN__ELEMENT_OPTIONS } from '../elements.constants.mjs';
import './pagination-normalize.scss';
import './pagination.scss';

/**
 * `nav.ms-pagination` > `ul.__list` > `li`s holding `ms-button.__page`s (the current one with
 * `aria-current="page"`), previous / next buttons (an `aria-hidden` `__arrow`: `‹` `›` are
 * mirrored by the browser in RTL text) and `__ellipsis` gaps. `pgnSize` gives the
 * ellipsis the size of the buttons (give them the same `ctlSize`).
 */
const PAGINATION__CLASS_NAME_CONFIG = {
  baseClass: 'ms-pagination',
  classNameDefinitionByPropName: {
    // value-mapped
    pgnSize: {
      modifier: 'size',
      options: SIZE_PLAIN__ELEMENT_OPTIONS,
      defaultValue: 'base',
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { PAGINATION__CLASS_NAME_CONFIG };
