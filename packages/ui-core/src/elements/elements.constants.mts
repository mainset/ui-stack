import {
  BREAKPOINT__OPTIONS,
  SPACING_SIZE__OPTIONS,
  TONE__OPTIONS,
} from '../tokens/index.mjs';

// Every tone defined in `tokens/color.tokens.mts`, plus the CSS `transparent` keyword
const COLOR__ELEMENT_OPTIONS = ['transparent', ...TONE__OPTIONS] as const;

const SIZE_PLAIN__ELEMENT_OPTIONS = SPACING_SIZE__OPTIONS;
const SIZE_EXTENDED__ELEMENT_OPTIONS = [
  'xxs',
  'xs',
  'sm',
  'base',
  'lg',
  'xl',
  'xxl',
] as const;

// Mobile-first breakpoints from `tokens/layout.tokens.mts`.
// `xs` starts at 0, so it's the default value of a responsive prop.
const BREAKPOINT__ELEMENT_OPTIONS = BREAKPOINT__OPTIONS;

export {
  BREAKPOINT__ELEMENT_OPTIONS,
  COLOR__ELEMENT_OPTIONS,
  SIZE_EXTENDED__ELEMENT_OPTIONS,
  SIZE_PLAIN__ELEMENT_OPTIONS,
};
