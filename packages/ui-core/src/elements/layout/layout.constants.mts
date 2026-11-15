// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import { SIZE_PLAIN__ELEMENT_OPTIONS } from '../elements.constants.mjs';
import './layout.scss';

const LAYOUT__CLASS_NAME_CONFIG = {
  baseClass: 'ms-layout',
  classNameDefinitionByPropName: {
    // value-mapped
    layJustify: {
      modifier: 'justify-content',
      options: ['space-between', 'center', 'flex-end'],
    },
    layAlign: {
      modifier: 'align-items',
      options: ['center', 'flex-end'],
    },
    layGapSize: {
      modifier: 'gap-size',
      options: SIZE_PLAIN__ELEMENT_OPTIONS,
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { LAYOUT__CLASS_NAME_CONFIG };
