// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import './progress-normalize.scss';
import './progress.scss';

/**
 * A progress bar (`role="progressbar"` + `aria-valuenow` / `-min` / `-max`): `ms-progress` >
 * `__bar`, filled to `--ms-progress-value` (0–1, set inline) in the current tone.
 * `--indeterminate` (no `aria-valuenow`) runs a bar across instead.
 */
const PROGRESS__CLASS_NAME_CONFIG = {
  baseClass: 'ms-progress',
  classNameDefinitionByPropName: {
    // boolean
    prgIsIndeterminate: {
      modifier: 'indeterminate',
      options: [true, false],
    },
    // value-mapped
    prgSize: {
      modifier: 'size',
      options: ['sm', 'base', 'lg'],
      defaultValue: 'base',
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { PROGRESS__CLASS_NAME_CONFIG };
