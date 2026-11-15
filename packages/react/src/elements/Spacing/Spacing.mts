import type { SpacingStyleProps } from '@mainset/ui-core';
import { cnx, extractSpacingClassNamesFromProps } from '@mainset/ui-core';
import React from 'react';

import { mergeResponsiveStyle } from '../utils/index.mjs';

type SpacingProps = React.HTMLAttributes<HTMLElement> &
  SpacingStyleProps & {
    as?: 'span' | 'div';
  };

const Spacing: React.FC<SpacingProps> = ({
  as = 'div',

  children,
  className,
  style,

  ...props
}) => {
  const [spacingClassNames, restProps, spacingStyle] =
    extractSpacingClassNamesFromProps(props);

  return React.createElement(
    as,
    {
      className: cnx(className, spacingClassNames),
      style: mergeResponsiveStyle(spacingStyle, style),
      ...restProps,
    },
    children,
  );
};

export { Spacing };
