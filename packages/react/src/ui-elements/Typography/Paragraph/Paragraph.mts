import React from 'react';

// import withTypography from '../Typography';

interface ParagraphBasicProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const ParagraphBasic: React.FC<ParagraphBasicProps> = ({
  children,
  className,

  ...props
}) =>
  React.createElement(
    'p',
    {
      className: `ms-paragraph${className && ` ${className}`}`,
      ...props,
    },
    children,
  );

export { ParagraphBasic };
// export default withTypography(Paragraph);
