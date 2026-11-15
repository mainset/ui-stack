// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (layer order + tokens) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import './surface.scss';

const SURFACE__CLASS_NAME_CONFIG = {
  baseClass: 'ms-surface',
  classNameDefinitionByPropName: {
    // value-mapped
    srfHover: {
      modifier: 'hover',
      options: ['bg', 'border', 'all'],
    },
    srfVariant: {
      modifier: 'variant',
      options: ['solid', 'outlined', 'ghost'],
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { SURFACE__CLASS_NAME_CONFIG };
