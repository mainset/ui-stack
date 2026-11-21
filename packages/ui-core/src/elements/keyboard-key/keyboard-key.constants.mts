// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import './keyboard-key-normalize.scss';
import './keyboard-key.scss';

/**
 * A key or a shortcut: `<kbd class="ms-keyboard-key">⌘K</kbd>`. One key per element; a combination is
 * several, e.g. `<kbd class="ms-keyboard-key">Ctrl</kbd> + <kbd class="ms-keyboard-key">K</kbd>`.
 */
const KEYBOARD_KEY__CLASS_NAME_CONFIG = {
  baseClass: 'ms-keyboard-key',
  classNameDefinitionByPropName: {},
} as const satisfies ClassNameFromPropConfig;

export { KEYBOARD_KEY__CLASS_NAME_CONFIG };
