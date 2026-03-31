import type { TextStyleProps } from '@mainset/ui-core';
import {
  TEXT_BASE__CLASS_NAME_CONFIG,
  cnx,
  extractClassNamesFromProps,
  stylesTextBase,
} from '@mainset/ui-core';
import React from 'react';

interface ParagraphProps
  extends React.HTMLAttributes<HTMLParagraphElement>, TextStyleProps {}

const Paragraph: React.FC<ParagraphProps> = ({
  children,
  className,

  ...props
}) => {
  const [classNames, restProps] = extractClassNamesFromProps(
    [TEXT_BASE__CLASS_NAME_CONFIG],
    props,
    stylesTextBase,
  );
  return React.createElement(
    'p',
    {
      className: cnx(className, classNames),
      ...restProps,
    },
    children,
  );
};

export { Paragraph };
