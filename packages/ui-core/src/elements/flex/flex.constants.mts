// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (layer order + tokens) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import './flex.scss';

const FLEX_CONTAINER__CLASS_NAME_CONFIG = {
  baseClass: 'ms-flex',
  classNameDefinitionByPropName: {
    // css-based
    flxDisplay: {
      modifier: 'display',
      options: ['flex', 'inline-flex'],
      defaultValue: 'flex',
      isResponsive: true,
    },
    flxDirection: {
      modifier: 'flex-direction',
      options: ['row', 'row-reverse', 'column', 'column-reverse'],
      isResponsive: true,
    },
    flxWrap: {
      modifier: 'flex-wrap',
      options: ['nowrap', 'wrap', 'wrap-reverse'],
      isResponsive: true,
    },
  },
} as const satisfies ClassNameFromPropConfig;

const FLEX_ITEM__CLASS_NAME_CONFIG = {
  baseClass: 'ms-flex__item',
  classNameDefinitionByPropName: {
    // value-mapped
    flxGrow: {
      modifier: 'flex-grow',
      options: ['initial', 1],
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { FLEX_CONTAINER__CLASS_NAME_CONFIG, FLEX_ITEM__CLASS_NAME_CONFIG };
