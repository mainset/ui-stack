import React from 'react';

// import withTypography from '../Typography';

interface TextSectionBasicProps extends React.HTMLAttributes<HTMLSpanElement> {}

const TextSectionBasic: React.FC<TextSectionBasicProps> = ({
  children,
  className,

  ...props
}) =>
  React.createElement(
    'span',
    {
      className: `ms-text-section${className && ` ${className}`}`,
      ...props,
    },
    children,
  );

export { TextSectionBasic };
// export default withTypography(TextSection);
