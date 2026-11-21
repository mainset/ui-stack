// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import './animate.scss';

/**
 * Entrance / exit animations from CSS alone: the props pick where an element comes from
 * (`anmFade`, `anmSlide`, `anmZoom`, freely combined), `anmState` when it moves:
 * `enter` plays the entrance (from the first paint, no JS needed), `exit` the way back out,
 * `hidden` holds it at the start (e.g. until it scrolls into view).
 *
 * Only `opacity` and `transform` move, so nothing around it reflows. The delay is the
 * `--ms-animate-delay` CSS variable (staggered lists: index × step). Under
 * `prefers-reduced-motion` it appears at once.
 */
const ANIMATE__CLASS_NAME_CONFIG = {
  baseClass: 'ms-animate',
  classNameDefinitionByPropName: {
    // value-mapped
    anmState: {
      modifier: 'state',
      options: ['hidden', 'enter', 'exit'],
      defaultValue: 'enter',
    },
    anmSlide: {
      modifier: 'slide',
      // from below (`up`: it rises into place) or from above (`down`)
      options: ['up', 'down'],
    },
    anmZoom: {
      modifier: 'zoom',
      // `in`: grows into place, `out`: shrinks into place
      options: ['in', 'out'],
    },
    anmDuration: {
      modifier: 'duration',
      options: ['fast', 'base', 'slow', 'slower', 'slowest'],
    },
    // boolean
    anmFade: {
      modifier: 'fade',
      options: [true, false],
      // NOTE: `false` for a page's largest text, which slides in without fading: Chrome only
      // counts its Largest Contentful Paint once it's visible
      defaultValue: true,
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { ANIMATE__CLASS_NAME_CONFIG };
