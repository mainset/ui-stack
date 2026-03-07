import cn from 'classnames';
import React from 'react';

import { asLayout } from '../../hocs/Layout/index.mjs';

type ColSize =
  | 'full'
  | 'unset'
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12;

interface ColBasicProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ColSize;
  xs?: ColSize;
  sm?: ColSize;
  md?: ColSize;
  lg?: ColSize;
  xl?: ColSize;

  // NOTE: 0 is added to the type to allow resetting offset
  offset?: 0 | Exclude<ColSize, 'full' | 'unset' | 12>;

  noSpacing?: boolean;
}

const ColBasic: React.FC<ColBasicProps> = ({
  children,
  className,

  size = 'full',
  xs,
  sm,
  md,
  lg,
  xl,

  offset,
  noSpacing,

  ...props
}) =>
  React.createElement(
    'div',
    {
      className: cn(
        'ms-col',
        {
          [`ms-col--offset-${offset}`]: offset,
          [`ms-col--size-${size}`]: size && !(xs || sm || md || lg || xl),
          [`ms-col--xs-${xs}`]: xs,
          [`ms-col--sm-${sm}`]: sm,
          [`ms-col--md-${md}`]: md,
          [`ms-col--lg-${lg}`]: lg,
          [`ms-col--xl-${xl}`]: xl,
          'ms-col--no-spacing': noSpacing,
        },
        className,
      ),
      ...props,
    },
    children,
  );

const ColLayout = asLayout(ColBasic);

export { ColLayout as Col };
