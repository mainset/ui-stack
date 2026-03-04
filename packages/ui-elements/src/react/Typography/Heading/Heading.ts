import React from 'react';

// import withTypography from '../Typography';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  hSize?: 1 | 2 | 3 | 4 | 5 | 6;
}

const Heading: React.FC<HeadingProps> = ({
  children,
  className,

  hSize = 1,

  ...props
}) =>
  React.createElement(
    `h${hSize}`,
    {
      className: `ms-heading${className && ` ${className}`}`,
      ...props,
    },
    children,
  );

export default Heading;
// export default withTypography(Heading);
