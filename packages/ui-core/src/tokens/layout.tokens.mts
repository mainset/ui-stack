/**
 * Layout tokens.
 *
 * Breakpoints say *where* the layout changes; containers say *how wide* content may grow.
 * They start aligned (sm → xl), but are separate concepts and can diverge.
 */

// Mobile-first `min-width` breakpoints. `xs` starts at 0, so it's the default (no media query).
const BREAKPOINT__TOKENS = {
  xs: '0rem',
  sm: '36rem', // 576px
  base: '48rem', // 768px
  lg: '62rem', // 992px
  xl: '75rem', // 1200px
} as const;
type Breakpoint = keyof typeof BREAKPOINT__TOKENS;
const BREAKPOINT__OPTIONS = Object.keys(BREAKPOINT__TOKENS) as Breakpoint[];

// Max content widths
const CONTAINER__TOKENS = {
  xs: '20rem', // 320px
  sm: '36rem', // 576px
  base: '48rem', // 768px
  lg: '62rem', // 992px
  xl: '75rem', // 1200px
} as const satisfies Record<Breakpoint, string>;

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
  BREAKPOINT__OPTIONS,
  BREAKPOINT__TOKENS,
  CONTAINER__TOKENS,
  Z_INDEX__TOKENS,
};
export type { Breakpoint };
