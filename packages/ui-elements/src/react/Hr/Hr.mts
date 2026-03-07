import React from 'react';

interface HrProps extends React.HTMLAttributes<HTMLHRElement> {
  direction?: 'horizontal' | 'vertical';
  isHidden?: boolean;
}

const Hr: React.FC<HrProps> = ({
  className,

  direction = 'horizontal',
  isHidden,

  ...props
}) => React.createElement(
  'hr',
  {
    className: `${className ? `${className} ` : ''}ms-break ms-break--direction-${direction}${isHidden ? ' ms-break--hidden' : ''}`,
    ...props,
  },
);

export { Hr };
