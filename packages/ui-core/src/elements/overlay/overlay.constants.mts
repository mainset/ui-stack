// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import './overlay-normalize.scss';

/**
 * The fixed positioner of a dialog / drawer, above the backdrop. `start` / `end` are inline
 * edges (they follow `dir`), `top` / `bottom` block edges.
 */
const OVERLAY__CLASS_NAME_CONFIG = {
  baseClass: 'ms-overlay',
  classNameDefinitionByPropName: {
    // value-mapped
    ovrPlacement: {
      modifier: 'placement',
      options: ['center', 'start', 'end', 'top', 'bottom'],
      defaultValue: 'center',
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { OVERLAY__CLASS_NAME_CONFIG };
