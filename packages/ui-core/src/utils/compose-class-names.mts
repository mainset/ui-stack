import { cnx } from './cnx.mjs';
import type { ClassNameFromPropConfig } from './extract-class-names-from-props.mjs';
import { extractClassNamesFromProps } from './extract-class-names-from-props.mjs';

/**
 * Framework-agnostic "recipe" core: style props in, class string out.
 * Unlike {extractClassNamesFromProps}, it ignores non-style props, so it can be
 * used directly in any template: `<button class="${composeClassNames(...)}">`.
 */
function composeClassNames(
  configs: ClassNameFromPropConfig[],
  props: Record<string, any>,
): string {
  const [classNames] = extractClassNamesFromProps(configs, props);

  return cnx(classNames);
}

export { composeClassNames };
