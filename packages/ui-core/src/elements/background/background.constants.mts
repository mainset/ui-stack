// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import { COLOR__ELEMENT_OPTIONS } from '../elements.constants.mjs';
import './background.scss';

const BACKGROUND__CLASS_NAME_CONFIG = {
  baseClass: 'ms-background',
  classNameDefinitionByPropName: {
    // value-mapped
    bgColor: {
      modifier: 'color',
      // `canvas` / `surface` / `subtle`: the color scheme's own backgrounds (page, card, raised
      // band), not tones: they follow light / dark and never take a tone's tint
      options: [...COLOR__ELEMENT_OPTIONS, 'canvas', 'surface', 'subtle'],
      // defaultValue: 'transparent',
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { BACKGROUND__CLASS_NAME_CONFIG };
