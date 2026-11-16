import type { SpacingStyleProps } from '@mainset/ui-core';
import { cnx, extractSpacingClassNamesFromProps } from '@mainset/ui-core';
import React from 'react';

import type { PolymorphicProps } from '../utils/index.mjs';
import { mergeResponsiveStyle } from '../utils/index.mjs';

type SpacingElementType = 'div' | 'span';

type SpacingProps<C extends SpacingElementType = 'div'> = PolymorphicProps<
  'spcAs',
  C,
  SpacingStyleProps
>;

function Spacing<C extends SpacingElementType = 'div'>({
  spcAs,

  children,
  className,
  style,

  ...props
}: SpacingProps<C>): React.ReactElement {
  const [spacingClassNames, restProps, spacingStyle] =
    extractSpacingClassNamesFromProps(props);

  return React.createElement(
    spcAs || 'div',
    {
      className: cnx(className, spacingClassNames),
      style: mergeResponsiveStyle(spacingStyle, style),
      ...restProps,
    },
    children,
  );
}

export { Spacing };
export type { SpacingElementType, SpacingProps };
