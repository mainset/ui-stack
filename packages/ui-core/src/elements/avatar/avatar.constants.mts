// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import { SIZE_PLAIN__ELEMENT_OPTIONS } from '../elements.constants.mjs';
import './avatar-normalize.scss';
import './avatar.scss';

/**
 * A picture of a person or a thing: `ms-avatar` > a fallback (initials, an `svg` icon) in the
 * current tone (`ms-tone-*` re-colors it), covered by an `img` once it has loaded. `ms-avatar-group` overlaps
 * its avatars.
 */
const AVATAR__CLASS_NAME_CONFIG = {
  baseClass: 'ms-avatar',
  classNameDefinitionByPropName: {
    // value-mapped
    avtSize: {
      modifier: 'size',
      options: SIZE_PLAIN__ELEMENT_OPTIONS,
      defaultValue: 'base',
    },
    avtShape: {
      modifier: 'shape',
      options: ['circle', 'square'],
      defaultValue: 'circle',
    },
  },
} as const satisfies ClassNameFromPropConfig;

const AVATAR_GROUP__CLASS_NAME_CONFIG = {
  baseClass: 'ms-avatar-group',
  classNameDefinitionByPropName: {},
} as const satisfies ClassNameFromPropConfig;

export { AVATAR__CLASS_NAME_CONFIG, AVATAR_GROUP__CLASS_NAME_CONFIG };
