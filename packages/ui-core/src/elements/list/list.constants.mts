import type { ClassNameFromPropConfig } from '../../utils/index.mjs';

const LIST__CLASS_NAME_CONFIG = {
  baseClass: 'ms-list',
  classNameDefinitionByPropName: {
    // value-mapped
    lstDirection: {
      modifier: 'flex-direction',
      options: ['horizontal', 'vertical'],
      defaultValue: 'horizontal',
    },
    lstStyle: {
      modifier: 'list-style',
      options: [
        'unstyled',
        'ordered',
        // 'unordered'
      ],
      defaultValue: 'unstyled',
    },
    lstJustify: {
      modifier: 'justify-content',
      options: ['center', 'end'],
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { LIST__CLASS_NAME_CONFIG };
