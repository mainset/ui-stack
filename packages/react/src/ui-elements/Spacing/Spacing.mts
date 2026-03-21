import type { SpacingBaseProps } from '@mainset/ui-core';
import {
  SPACING__CLASS_NAME_CONFIG,
  cnx,
  extractClassNamesFromProps,
  stylesSpacing,
} from '@mainset/ui-core';
import React from 'react';

interface SpacingProps
  extends React.HTMLAttributes<HTMLElement>, SpacingBaseProps {
  as?: 'span' | 'div';
}

const Spacing: React.FC<SpacingProps> = ({
  as = 'div',
  children,
  className,

  ...props
}) => {
  const [classNames, restProps] = extractClassNamesFromProps(
    [SPACING__CLASS_NAME_CONFIG],
    props,
    stylesSpacing,
  );
  return React.createElement(
    as,
    {
      className: cnx(classNames, className),
      ...restProps,
    },
    children,
  );
};

export { Spacing };
