// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import './icon-tile-normalize.scss';
import './icon-tile.scss';

/**
 * An icon on a small tile: the visual anchor of a feature, a step, a list row. Painted from the
 * current tone (`.ms-tone-*`): `outlined` is a neutral tile with a toned icon, `soft` a toned
 * tint, `solid` the tone itself. Decorative: the text next to it carries the meaning.
 */
const ICON_TILE__CLASS_NAME_CONFIG = {
  baseClass: 'ms-icon-tile',
  classNameDefinitionByPropName: {
    // value-mapped
    ictSize: {
      modifier: 'size',
      options: ['sm', 'base', 'lg'],
      defaultValue: 'base',
    },
    ictShape: {
      modifier: 'shape',
      options: ['square', 'circle'],
      defaultValue: 'square',
    },
    ictVariant: {
      modifier: 'variant',
      options: ['outlined', 'soft', 'solid'],
      defaultValue: 'outlined',
    },
  },
} as const satisfies ClassNameFromPropConfig;

export { ICON_TILE__CLASS_NAME_CONFIG };
