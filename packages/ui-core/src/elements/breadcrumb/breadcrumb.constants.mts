// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import './breadcrumb-normalize.scss';
import './breadcrumb.scss';

/**
 * `nav.ms-breadcrumb` > `ol.__list` > `li.__item`s, each a `__link` (the current page: a
 * `span` with `aria-current="page"`) followed by an `aria-hidden` `__separator`, except the last.
 * NOTE: `/` reads the same both ways; `›` (U+203A) is mirrored by the browser in RTL text.
 */
const BREADCRUMB__CLASS_NAME_CONFIG = {
  baseClass: 'ms-breadcrumb',
  classNameDefinitionByPropName: {},
} as const satisfies ClassNameFromPropConfig;

export { BREADCRUMB__CLASS_NAME_CONFIG };
