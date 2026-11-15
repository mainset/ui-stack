// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import { SIZE_PLAIN__ELEMENT_OPTIONS } from '../elements.constants.mjs';
import './layout.scss';

const LAYOUT__CLASS_NAME_CONFIG = {
  baseClass: 'ms-layout',
  classNameDefinitionByPropName: {
    // value-mapped
    layJustify: {
      modifier: 'justify-content',
      options: [
        'flex-start',
        'center',
        'flex-end',
        'space-between',
        'space-around',
        'space-evenly',
      ],
      isResponsive: true,
    },
    layAlign: {
      modifier: 'align-items',
      options: ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'],
      isResponsive: true,
    },
    layGapSize: {
      modifier: 'gap-size',
      options: SIZE_PLAIN__ELEMENT_OPTIONS,
      isResponsive: true,
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { LAYOUT__CLASS_NAME_CONFIG };
