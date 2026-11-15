const COLOR__ELEMENT_OPTIONS = [
  // css basic
  'transparent',
  // semantic
  'primary',
  'secondary',
  'tertiary',
  // contextual
  'error',
  'info',
  'success',
  'warning',
  // neutral
  'base',
  'muted',
  'inverse',
] as const;

const SIZE_PLAIN__ELEMENT_OPTIONS = ['xs', 'sm', 'base', 'lg', 'xl'] as const;
const SIZE_EXTENDED__ELEMENT_OPTIONS = [
  'xxs',
  'xs',
  'sm',
  'base',
  'lg',
  'xl',
  'xxl',
] as const;

// Mobile-first breakpoints, mirrors `$breakpoint-map` (styles/_variables.scss).
// `xs` starts at 0, so it's the default value of a responsive prop.
const BREAKPOINT__ELEMENT_OPTIONS = ['xs', 'sm', 'base', 'lg', 'xl'] as const;

export {
  BREAKPOINT__ELEMENT_OPTIONS,
  COLOR__ELEMENT_OPTIONS,
  SIZE_EXTENDED__ELEMENT_OPTIONS,
  SIZE_PLAIN__ELEMENT_OPTIONS,
};
