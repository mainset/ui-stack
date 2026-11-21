// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import './hover.scss';

/**
 * Small motion on hover: `lift` (a card, a button rises), `zoom` (media grows inside its box),
 * `nudge-end` / `nudge-up-end` (an arrow icon moves toward where it points).
 *
 * An effect plays when its element is hovered, or when an ancestor marked `hvrIsGroup` is hovered
 * or keyboard-focused: a card is the group, the arrow inside it nudges. Only for pointers that can
 * hover, and never under `prefers-reduced-motion`.
 *
 * NOTE: no base class: `hoverRecipe()` returns only the classes of the props given, so an element
 * without hover props gets nothing.
 */
const HOVER__CLASS_NAME_CONFIG = {
  baseClass: 'ms-hover',
  classNameDefinitionByPropName: {
    // value-mapped
    hvrEffect: {
      modifier: '',
      options: ['lift', 'zoom', 'nudge-end', 'nudge-up-end'],
    },
    // boolean
    hvrIsGroup: {
      modifier: 'group',
      options: [true, false],
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { HOVER__CLASS_NAME_CONFIG };
