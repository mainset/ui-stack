// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
// NOTE: a group's chevron is the disclosure's icon
import '../disclosure/disclosure.constants.mjs';
import './nav-list-normalize.scss';
import './nav-list.scss';

/**
 * A vertical list of links, in a `nav`: `ul.ms-nav-list` > `li.__item` > `a.__link`, the current
 * one marked by `aria-current` (`page`, `location`, …) in the current tone. A `__item` may hold
 * a nested `ms-nav-list`, or a `details.__group` (`summary.__group-label` with a
 * `ms-disclosure__icon`, then the nested list) that opens without script.
 * `navVariant`: `soft` tints the current row (a sidebar), `line` marks it on a guide line
 * (contents of a page).
 */
const NAV_LIST__CLASS_NAME_CONFIG = {
  baseClass: 'ms-nav-list',
  classNameDefinitionByPropName: {
    // value-mapped
    navVariant: {
      modifier: 'variant',
      options: ['soft', 'line'],
      defaultValue: 'soft',
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { NAV_LIST__CLASS_NAME_CONFIG };
