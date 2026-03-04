import cn from 'classnames';
import React from 'react';

interface TextTagProps<
  Color extends string = string,
  Family extends string = string,
> extends React.HTMLAttributes<HTMLElement> {
  as: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div' | 'a';

  align?: 'center' | 'right';
  size:
    | 'xx-small'
    | 'x-small'
    | 'smaller'
    | 'sm'
    | 'md'
    | 'lg'
    | 'larger'
    | 'x-large'
    | 'xx-large';
  weight?: 'lighter' | 'normal' | 'bolder' | 'bold';

  // redefine
  color?: Color;
  family?: Family;
}

const TextTag: React.FC<TextTagProps> = ({
  as,

  className,
  children,

  align,
  size,
  weight = 'normal',

  color,
  family,

  ...props
}) =>
  React.createElement(
    as,
    {
      className: cn(
        'ms-text',
        {
          [`ms-text--align-${align}`]: align,
          [`ms-text--color-${color}`]: color,
          [`ms-text--family-${family}`]: family,
          [`ms-text--size-${size}`]: size,
          [`ms-text--weight-${weight}`]: weight,
        },
        className,
      ),
      ...props,
    },
    children,
  );

export default TextTag;
