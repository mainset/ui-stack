import type { HrBaseProps } from '@mainset/ui-core';
import {
  HR__CLASS_NAME_CONFIG,
  cnx,
  extractClassNamesFromProps,
  stylesHr,
} from '@mainset/ui-core';
import React from 'react';

interface HrProps extends React.HTMLAttributes<HTMLHRElement>, HrBaseProps {}

const Hr: React.FC<HrProps> = ({
  children,
  className,

  ...props
}) => {
  const [classNames, restProps] = extractClassNamesFromProps(
    [HR__CLASS_NAME_CONFIG],
    props,
    stylesHr,
  );
  return React.createElement(
    'hr',
    {
      className: cnx(classNames, className),
      ...restProps,
    },
    children,
  );
};

export { Hr };
