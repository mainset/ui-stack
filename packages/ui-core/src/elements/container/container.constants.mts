// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import { CONTAINER__SIZE__OPTIONS } from '../../tokens/index.mjs';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import './container-normalize.scss';

/** Centered, width-limited content with side gutters (`--ms-container-gutter`) */
const CONTAINER__CLASS_NAME_CONFIG = {
  baseClass: 'ms-container',
  classNameDefinitionByPropName: {
    // value-mapped
    ctnSize: {
      modifier: 'size',
      // the container tokens (`--ms-container-{size}`), or `full` (gutters only)
      options: [...CONTAINER__SIZE__OPTIONS, 'full'],
      defaultValue: 'xl',
    },
    // boolean
    ctnIsGutterless: {
      modifier: 'gutterless',
      options: [true, false],
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { CONTAINER__CLASS_NAME_CONFIG };
