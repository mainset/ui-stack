import type { ClassNameFromPropConfig } from './extract-class-names-from-props.mjs';
import { composeClassNameString } from './extract-class-names-from-props.mjs';
import type { ResponsiveStyle } from './responsive.mjs';
import { warnDroppedResponsiveStyle } from './responsive.mjs';

/**
 * Framework-agnostic "recipe" core: style props in, class string out.
 * Unlike {extractClassNamesFromProps}, it ignores non-style props, so it can be
 * used directly in any template: `<button class="${composeClassNames(...)}">`.
 * NOTE: for configs with `css-var` responsive props (e.g. `layGapSize`) use {composeStyleProps},
 * which also returns the inline CSS variables those breakpoint classes read.
 */
function composeClassNames(
  configs: ClassNameFromPropConfig[],
  props: Record<string, any>,
): string {
  const [className, style] = composeClassNameString(configs, props);
  warnDroppedResponsiveStyle('composeClassNames', style);

  return className;
}

/**
 * Like {composeClassNames}, plus the inline CSS variables of `css-var` responsive props.
 * @example
 * composeStyleProps([LAYOUT__CLASS_NAME_CONFIG], { layGapSize: { base: 'sm', md: 'lg' } })
 * // → { className: 'ms-layout ms-layout--gap-size-sm ms-layout--gap-size@md',
 * //     style: { '--ms-layout-gap-size-at-md': 'var(--ms-space-layout-row-lg) var(--ms-space-layout-column-lg)' } }
 */
function composeStyleProps(
  configs: ClassNameFromPropConfig[],
  props: Record<string, any>,
): { className: string; style: ResponsiveStyle } {
  const [className, style] = composeClassNameString(configs, props);

  return { className, style };
}

export { composeClassNames, composeStyleProps };
export type { ResponsiveStyle };
