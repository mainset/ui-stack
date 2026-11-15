/**
 * Layout tokens.
 *
 * Breakpoints say *where* the layout changes; containers say *how wide* content may grow.
 * Separate concepts with separate vocabularies: breakpoints `base sm md lg xl`, containers `xs sm base lg xl`.
 */

// Mobile-first `min-width` breakpoints, industry vocabulary (Chakra / Panda / Tailwind):
// `base` starts at 0, so it's the default of a responsive prop (no media query).
const BREAKPOINT__TOKENS = {
  base: '0rem',
  sm: '36rem', // 576px
  md: '48rem', // 768px
  lg: '62rem', // 992px
  xl: '75rem', // 1200px
} as const;
type Breakpoint = keyof typeof BREAKPOINT__TOKENS;
const BREAKPOINT__OPTIONS = Object.keys(BREAKPOINT__TOKENS) as Breakpoint[];

// The breakpoint whose classes carry no `@{breakpoint}` suffix (min-width 0)
const BREAKPOINT__DEFAULT = BREAKPOINT__OPTIONS.find(
  (breakpoint) => parseFloat(BREAKPOINT__TOKENS[breakpoint]) === 0,
) as Breakpoint;

// Max content widths — size names (not breakpoint names): a container is a size, not a position
const CONTAINER__SIZE__OPTIONS = ['xs', 'sm', 'base', 'lg', 'xl'] as const;
type ContainerSize = (typeof CONTAINER__SIZE__OPTIONS)[number];

const CONTAINER__TOKENS = {
  xs: '20rem', // 320px
  sm: '36rem', // 576px
  base: '48rem', // 768px
  lg: '62rem', // 992px
  xl: '75rem', // 1200px
} as const satisfies Record<ContainerSize, string>;

// Stacking order of floating layers
const Z_INDEX__TOKENS = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  toast: 1600,
  tooltip: 1700,
} as const;

export {
  BREAKPOINT__DEFAULT,
  BREAKPOINT__OPTIONS,
  BREAKPOINT__TOKENS,
  CONTAINER__SIZE__OPTIONS,
  CONTAINER__TOKENS,
  Z_INDEX__TOKENS,
};
export type { Breakpoint, ContainerSize };
