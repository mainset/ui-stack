// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import './code-normalize.scss';
import './code.scss';

/**
 * A code span in running text: `<code class="ms-code">`. Sized in `em`, so it fits any text
 * size. A code block is an app's own (syntax highlighting differs per app).
 */
const CODE__CLASS_NAME_CONFIG = {
  baseClass: 'ms-code',
  classNameDefinitionByPropName: {},
} as const satisfies ClassNameFromPropConfig;

export { CODE__CLASS_NAME_CONFIG };
