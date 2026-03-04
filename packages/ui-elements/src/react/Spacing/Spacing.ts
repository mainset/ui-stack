import cn from 'classnames';
import React from 'react';

interface SpacingProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'span' | 'div';

  type:
    | 'm' // margin
    | 'p' // padding

    // margin
    | 'mt' // top
    | 'mr' // right
    | 'mb' // bottom
    | 'ml' // left
    | 'mv' // vertical
    | 'mh' // horizontal

    // padding
    | 'pt' // top
    | 'pr' // right
    | 'pb' // bottom
    | 'pl' // left
    | 'pv' // vertical
    | 'ph'; // horizontal
  size: number;
}

const Spacing: React.FC<SpacingProps> = ({
  as = 'span',
  className,
  children,
  type,
  size,
  ...props
}) =>
  React.createElement(
    as,
    {
      className: cn('ms-spcng', `ms-spcng-${type}--${size}`, className),
      ...props,
    },
    children,
  );

export default Spacing;
