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

export {
  COLOR__ELEMENT_OPTIONS,
  SIZE_EXTENDED__ELEMENT_OPTIONS,
  SIZE_PLAIN__ELEMENT_OPTIONS,
};
