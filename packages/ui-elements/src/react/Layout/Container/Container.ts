import React from 'react';

import { asLayout } from '../../hocs/Layout';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  gapSize?: 'wide';
  width?: 'full' | 'wide' | 'narrow';
}

const Container: React.FC<ContainerProps> = ({
  children,
  className,

  gapSize,
  width = 'wide',

  ...props
}) =>
  React.createElement(
    'div',
    {
      className: `ms-container ms-container--width-${width} ms-container--gap-${gapSize} ${className && ` ${className}`}`,
      ...props,
    },
    children,
  );

export { Container };
export default asLayout(Container);
