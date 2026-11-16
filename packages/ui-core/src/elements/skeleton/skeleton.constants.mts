// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import './skeleton-normalize.scss';
import './skeleton.scss';

/**
 * A placeholder while content loads: a `text` line, a `rect` or a `circle`. With children, it
 * takes their size and hides them; `ms-skeleton-lines` holds several `text` lines, the last one
 * shorter. Decorative (`aria-hidden="true"`): mark the loading region
 * `aria-busy="true"` instead.
 */
const SKELETON__CLASS_NAME_CONFIG = {
  baseClass: 'ms-skeleton',
  classNameDefinitionByPropName: {
    // value-mapped
    sklVariant: {
      modifier: 'variant',
      options: ['text', 'rect', 'circle'],
      defaultValue: 'rect',
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { SKELETON__CLASS_NAME_CONFIG };
