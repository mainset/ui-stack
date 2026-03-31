import type { TextStyleProps } from '@mainset/ui-core';
import {
  TEXT_BASE__CLASS_NAME_CONFIG,
  cnx,
  extractClassNamesFromProps,
  stylesTextBase,
} from '@mainset/ui-core';
import React from 'react';

interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>, TextStyleProps {
  hSize?: 1 | 2 | 3 | 4 | 5 | 6;
}

const Heading: React.FC<HeadingProps> = ({
  hSize = 1,

  className,
  children,

  ...props
}) => {
  const [classNames, restProps] = extractClassNamesFromProps(
    [TEXT_BASE__CLASS_NAME_CONFIG],
    props,
    stylesTextBase,
  );

  return React.createElement(
    `h${hSize}`,
    {
      className: cnx(className, classNames),
      ...restProps,
    },
    children,
  );
};

export { Heading };
