// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (layer order + tokens) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import './list.scss';

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
