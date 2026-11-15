import { BREAKPOINT__DEFAULT } from '../tokens/index.mjs';

/** Inline CSS variables set by `css-var` responsive props, e.g. `{ '--ms-layout-gap-size-at-md': '…' }` */
type ResponsiveStyle = Record<string, string>;

// The mobile-first default breakpoint (min-width 0): its value is a plain class, no `@{breakpoint}`
const RESPONSIVE_BASE_BREAKPOINT = BREAKPOINT__DEFAULT;

const isResponsiveObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

// NOTE: the names below must match the `responsive-var-variants` Sass mixin (`styles/_options.scss`)

/** `ms-layout--gap-size@md`: applies the breakpoint's CSS variable inside its media query */
const responsiveVarClassName = (
  baseClass: string,
  modifier: string,
  breakpoint: string,
) => `${baseClass}--${modifier}@${breakpoint}`;

/** `--ms-layout-gap-size-at-md`: the value of that breakpoint, set inline */
const responsiveVarName = (
  baseClass: string,
  modifier: string,
  breakpoint: string,
) => `--${baseClass}-${modifier}-at-${breakpoint}`;

export {
  RESPONSIVE_BASE_BREAKPOINT,
  isResponsiveObject,
  responsiveVarClassName,
  responsiveVarName,
};
export type { ResponsiveStyle };
