import React from 'react';

import { asLayout } from '../../hocs/Layout/index.mjs';

interface ContainerBasicProps extends React.HTMLAttributes<HTMLDivElement> {
  gapSize?: 'wide';
  width?: 'full' | 'wide' | 'narrow';
}

const ContainerBasic: React.FC<ContainerBasicProps> = ({
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

const ContainerLayout = asLayout(ContainerBasic);

export { ContainerLayout as Container };
