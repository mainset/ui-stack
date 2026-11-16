// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import './link-normalize.scss';
import './link.scss';

/** A text link in the current tone's `text` color (`--ms-tone-text`, primary by default) */
const LINK__CLASS_NAME_CONFIG = {
  baseClass: 'ms-link',
  classNameDefinitionByPropName: {
    // value-mapped
    lnkUnderline: {
      modifier: 'underline',
      // `always` for links inside running text (WCAG 1.4.1: not by color alone)
      options: ['always', 'hover', 'none'],
      defaultValue: 'always',
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { LINK__CLASS_NAME_CONFIG };
