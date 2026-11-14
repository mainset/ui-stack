import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import {
  COLOR__ELEMENT_OPTIONS,
  SIZE_EXTENDED__ELEMENT_OPTIONS,
} from '../elements.constants.mjs';

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
      defaultValue: 'base',
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
      defaultValue: 'sans',
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
