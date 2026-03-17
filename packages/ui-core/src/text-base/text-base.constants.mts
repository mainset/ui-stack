import type { ClassNameFromPropConfig } from '../utils/index.mjs';

const TEXT_BASE__CLASS_NAME_CONFIG = {
  baseClass: 'ms-text',
  propDefinitionByName: {
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
      options: [
        // // css basic
        // 'transparent',
        // semantic
        'primary',
        'secondary',
        'tertiary',
        // contextual
        'error',
        'info',
        'success',
        'warning',
        // neutral
        'base',
        'muted',
        'inverse',
      ],
      defaultValue: 'base',
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
        'xx-small',
        'x-small',
        'small',
        'medium',
        'large',
        'x-large',
        'xx-large',
        'xxx-large',
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
