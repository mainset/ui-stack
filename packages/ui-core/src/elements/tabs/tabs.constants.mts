// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import './tabs-normalize.scss';
import './tabs.scss';

/**
 * `ms-tabs` wraps a `__list` (`role="tablist"`) of `__tab` buttons (`role="tab"`,
 * `aria-selected`) and their `__panel`s (`role="tabpanel"`). The selected tab is in the current
 * tone (`ms-tone-*` on any ancestor re-colors it).
 */
const TABS__CLASS_NAME_CONFIG = {
  baseClass: 'ms-tabs',
  classNameDefinitionByPropName: {
    // value-mapped
    tbsOrientation: {
      modifier: 'orientation',
      options: ['horizontal', 'vertical'],
      defaultValue: 'horizontal',
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { TABS__CLASS_NAME_CONFIG };
