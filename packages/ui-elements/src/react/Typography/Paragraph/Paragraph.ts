import React from 'react';

// import withTypography from '../Typography';

interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const Paragraph: React.FC<ParagraphProps> = ({
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

export default Paragraph;
// export default withTypography(Paragraph);
