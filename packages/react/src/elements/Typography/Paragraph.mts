import type { SpacingStyleProps, TextStyleProps } from '@mainset/ui-core';
import {
  TEXT_BASE__CLASS_NAME_CONFIG,
  cnx,
  extractClassNamesFromProps,
  extractSpacingClassNamesFromProps,
} from '@mainset/ui-core';
import React from 'react';

type ParagraphProps = React.HTMLAttributes<HTMLParagraphElement> &
  TextStyleProps &
  Partial<SpacingStyleProps>;

const Paragraph: React.FC<ParagraphProps> = ({
  children,
  className,

  ...props
}) => {
  const [classNames, extractedCNProps] = extractClassNamesFromProps(
    [TEXT_BASE__CLASS_NAME_CONFIG],
    props,
  );
  const [spacingClassNames, restProps] =
    extractSpacingClassNamesFromProps(extractedCNProps);

  return React.createElement(
    'p',
    {
      className: cnx(className, classNames, spacingClassNames),
      ...restProps,
    },
    children,
  );
};

export { Paragraph };
