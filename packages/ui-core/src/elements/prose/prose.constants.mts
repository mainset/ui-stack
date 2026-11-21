// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
// NOTE: inline code and keys inside read the code / keyboard-key tokens
import '../code/code.constants.mjs';
import '../keyboard-key/keyboard-key.constants.mjs';
import './prose-normalize.scss';
import './prose.scss';

/**
 * Rich text whose markup has no classes (rendered markdown, a CMS): `<div class="ms-prose">`
 * spaces its blocks and styles headings, lists, quotes, inline code, keys and links. Elements
 * with a class of their own (an `ms-table`, a live component) keep their own look.
 */
const PROSE__CLASS_NAME_CONFIG = {
  baseClass: 'ms-prose',
  classNameDefinitionByPropName: {},
} as const satisfies ClassNameFromPropConfig;

export { PROSE__CLASS_NAME_CONFIG };
