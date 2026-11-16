// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import {
  COLOR__ELEMENT_OPTIONS,
  SIZE_EXTENDED__ELEMENT_OPTIONS,
} from '../elements.constants.mjs';
import './text-base.scss';

const TEXT_BASE__CLASS_NAME_CONFIG = {
  baseClass: 'ms-text',
  classNameDefinitionByPropName: {
    // value-mapped
    txtAlign: {
      modifier: 'align',
      options: [
        // css basic
        'initial',
        // alignments
        'center',
        'end',
        'justify',
      ],
    },
    txtColor: {
      modifier: 'color',
      // `subtle`: the faintest text that still reads (WCAG AA on the canvas and surfaces),
      // for captions and meta data; a scheme color, not a tone
      options: [...COLOR__ELEMENT_OPTIONS, 'subtle'],
      // NOTE: no default — text inherits its color (e.g. `on-solid` inside a solid surface)
    },
    txtColorHover: {
      modifier: 'color-hover',
      options: COLOR__ELEMENT_OPTIONS,
    },
    txtFamily: {
      modifier: 'family',
      options: [
        'sans',
        'serif',
        'mono',
        // 'heading',
      ],
      // NOTE: no default — the font family is inherited from the theme root
    },
    txtLeading: {
      modifier: 'leading',
      // overrides the line height of the size: `tight` for headlines, `relaxed` for long copy
      options: ['tight', 'relaxed'],
    },
    txtSize: {
      modifier: 'size',
      options: [
        // css basic
        'initial',
        'inherit',
        'unset',
        // relative
        'smaller',
        'larger',
        // absolute
        ...SIZE_EXTENDED__ELEMENT_OPTIONS,
        // fluid: grow with the viewport between a floor and a ceiling (headlines)
        'display-sm',
        'display-base',
        'display-lg',
      ],
    },
    txtTransform: {
      modifier: 'transform',
      options: [
        // css basic
        'initial',
        'inherit',
        'unset',
        // transforms
        'capitalize',
        'lowercase',
        'uppercase',
      ],
    },
    txtWeight: {
      modifier: 'weight',
      options: [
        // css basic
        'initial',
        'normal',
        // relative
        'lighter',
        'bolder',
        // absolute
        'medium',
        'semibold',
        'bold',
      ],
    },
    txtVariant: {
      modifier: 'variant',
      options: [
        // the small label above a heading: mono, uppercase, widely tracked
        'overline',
        // the intro paragraph under a heading: larger, relaxed lines
        'lead',
      ],
    },
    txtWrap: {
      modifier: 'wrap',
      options: [
        // even lines (headings); newer browsers only, the others wrap as usual
        'balance',
        // no lone last word (paragraphs); newer browsers only, the others wrap as usual
        'pretty',
        // a single line
        'nowrap',
      ],
    },
    // boolean
    txtIsTruncated: {
      modifier: 'truncate',
      options: [true, false],
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { TEXT_BASE__CLASS_NAME_CONFIG };
