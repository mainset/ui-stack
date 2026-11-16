import type { ClassNameFromPropConfig } from '@mainset/ui-core';
import {
  extractClassNamesFromProps,
  extractHoverClassNamesFromProps,
  extractSpacingClassNamesFromProps,
} from '@mainset/ui-core';
import type React from 'react';

import { mergeResponsiveStyle } from './merge-responsive-style.mjs';

type SplitStyleProps = [
  classNames: string[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- spread onto the element as-is
  restProps: Record<string, any>,
  style: React.CSSProperties | undefined,
];

/**
 * One pass over a component's style props: the class-name {configs} plus the spacing (`spc*`)
 * and hover (`hvr*`) props. Returns the classes, the props left for the element, and its `style` with the CSS
 * variables of responsive props merged in (the element's own `style` wins).
 */
function splitStyleProps(
  configs: ClassNameFromPropConfig[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- props are interfaces (no index signature)
  { style, ...props }: Record<string, any> & { style?: React.CSSProperties },
): SplitStyleProps {
  const [classNames, withoutClassProps, responsiveStyle] =
    extractClassNamesFromProps(configs, props);
  const [spacingClassNames, withoutSpacingProps, spacingStyle] =
    extractSpacingClassNamesFromProps(withoutClassProps);
  const [hoverClassName, restProps] =
    extractHoverClassNamesFromProps(withoutSpacingProps);

  return [
    hoverClassName
      ? classNames.concat(spacingClassNames, hoverClassName)
      : classNames.concat(spacingClassNames),
    restProps,
    mergeResponsiveStyle({ ...responsiveStyle, ...spacingStyle }, style),
  ];
}

export { splitStyleProps };
