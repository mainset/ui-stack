import { cnx } from './cnx.mjs';
import type { ClassNameFromPropConfig } from './extract-class-names-from-props.mjs';
import { extractClassNamesFromProps } from './extract-class-names-from-props.mjs';
import type { ResponsiveStyle } from './responsive.mjs';

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
  const [classNames] = extractClassNamesFromProps(configs, props);

  return cnx(classNames);
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
  const [classNames, , style] = extractClassNamesFromProps(configs, props);

  return { className: cnx(classNames), style };
}

export { composeClassNames, composeStyleProps };
export type { ResponsiveStyle };
