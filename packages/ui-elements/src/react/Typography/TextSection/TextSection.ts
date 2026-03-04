import React from 'react';

// import withTypography from '../Typography';

interface TextSectionProps extends React.HTMLAttributes<HTMLSpanElement> {}

const TextSection: React.FC<TextSectionProps> = ({
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

export default TextSection;
// export default withTypography(TextSection);
