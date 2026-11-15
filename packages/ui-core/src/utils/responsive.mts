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

/**
 * Whether `value` is one of a prop's declared options. Checked before a value becomes an inline
 * CSS variable: an unknown value would otherwise be written into `style` as is.
 */
const isDeclaredOption = (
  options: readonly unknown[],
  value: unknown,
): value is string | number =>
  (typeof value === 'string' || typeof value === 'number') &&
  options.includes(value);

// A web package: no Node typings, only the `NODE_ENV` read that bundlers replace
declare const process: { env: { NODE_ENV?: string } };

const isProduction = (() => {
  try {
    // NOTE: bundlers replace `process.env.NODE_ENV`; without one, `process` is missing (→ dev)
    return process.env.NODE_ENV === 'production';
  } catch {
    return false;
  }
})();

/**
 * Dev-only warning for class-string-only helpers given a per-breakpoint value of a `css-var`
 * prop: its breakpoint class has no value without the inline style they can't return.
 */
function warnDroppedResponsiveStyle(
  helperName: string,
  style: ResponsiveStyle,
) {
  if (isProduction || !Object.keys(style).length) return;

  console.warn(
    `[@mainset/ui-core] ${helperName}() returns a class string only, so the inline CSS variables ` +
      `of per-breakpoint values are dropped: ${Object.keys(style).join(', ')}. ` +
      `Use the \`*StyleProps()\` variant and set its \`style\` on the element.`,
  );
}

export {
  RESPONSIVE_BASE_BREAKPOINT,
  isDeclaredOption,
  isResponsiveObject,
  responsiveVarClassName,
  responsiveVarName,
  warnDroppedResponsiveStyle,
};
export type { ResponsiveStyle };
