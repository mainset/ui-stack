// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import './aspect-ratio-normalize.scss';

/**
 * A box of a fixed width : height ratio (`aspRatio`, written `16-9` for 16:9) whose media child
 * (`img`, `video`, `iframe`, `picture`, or any element) fills it, cropped (`aspFit: cover`) or
 * letterboxed (`contain`). Reserves the space before the media loads, so nothing shifts.
 */
const ASPECT_RATIO__CLASS_NAME_CONFIG = {
  baseClass: 'ms-aspect-ratio',
  classNameDefinitionByPropName: {
    // value-mapped
    aspRatio: {
      modifier: 'ratio',
      options: ['1-1', '4-3', '3-2', '16-10', '16-9', '21-9'],
      defaultValue: '16-9',
    },
    aspFit: {
      modifier: 'fit',
      options: ['cover', 'contain'],
      defaultValue: 'cover',
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { ASPECT_RATIO__CLASS_NAME_CONFIG };
