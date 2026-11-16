// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
import './heading.scss';

/**
 * `ms-heading` on an `h1`–`h6`: the tag sets the default size of its level, `txtSize` overrides
 * it. Level (semantics) and size (looks) stay independent.
 */
const HEADING__CLASS_NAME_CONFIG = {
  baseClass: 'ms-heading',
  classNameDefinitionByPropName: {},
} as const satisfies ClassNameFromPropConfig;

/** The text size each heading level gets by default */
const HEADING_LEVEL__SIZES = {
  h1: 'xxl',
  h2: 'xl',
  h3: 'lg',
  h4: 'base',
  h5: 'sm',
  h6: 'xs',
} as const;

type HeadingLevel = keyof typeof HEADING_LEVEL__SIZES;

export { HEADING__CLASS_NAME_CONFIG, HEADING_LEVEL__SIZES };
export type { HeadingLevel };
