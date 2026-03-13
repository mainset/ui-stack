import React from 'react';

// import withTypography from '../Typography';

interface HeadingBasicProps extends React.HTMLAttributes<HTMLHeadingElement> {
  hSize?: 1 | 2 | 3 | 4 | 5 | 6;
}

const HeadingBasic: React.FC<HeadingBasicProps> = ({
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

export { HeadingBasic };
// export default withTypography(HeadingBasic);
