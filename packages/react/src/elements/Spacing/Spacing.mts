import type { SpacingStyleProps } from '@mainset/ui-core';
import { cnx, extractSpacingClassNamesFromProps } from '@mainset/ui-core';
import React from 'react';

type SpacingProps = React.HTMLAttributes<HTMLElement> &
  SpacingStyleProps & {
    as?: 'span' | 'div';
  };

const Spacing: React.FC<SpacingProps> = ({
  as = 'div',

  children,
  className,

  ...props
}) => {
  const [spacingClassNames, restProps] =
    extractSpacingClassNamesFromProps(props);

  return React.createElement(
    as,
    {
      className: cnx(className, spacingClassNames),
      ...restProps,
    },
    children,
  );
};

export { Spacing };
