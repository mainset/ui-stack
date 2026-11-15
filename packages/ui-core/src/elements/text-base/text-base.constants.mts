// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (layer order + tokens) goes first; bundlers dedupe it across elements.
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
      options: COLOR__ELEMENT_OPTIONS,
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
        'bold',
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
