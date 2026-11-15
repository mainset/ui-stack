// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import './floating-box.scss';

const FLOATING_BOX__WRAPPER__CLASS_NAME_CONFIG = {
  baseClass: 'ms-floating-box',
  classNameDefinitionByPropName: {
    // value-mapped
    flbDirection: {
      modifier: 'direction',
      options: ['top', 'bottom', 'before', 'after'],
      defaultValue: 'bottom',
    },
    flbAlignment: {
      modifier: 'align',
      options: ['start', 'center', 'end'],
      defaultValue: 'center',
    },
    flbPlacement: {
      modifier: 'placement',
      options: ['outside', 'inside'],
      defaultValue: 'outside',
    },
    flbPosition: {
      modifier: 'position',
      options: ['absolute', 'static', 'fixed'],
      defaultValue: 'absolute',
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { FLOATING_BOX__WRAPPER__CLASS_NAME_CONFIG };
