import type { TextBaseProps } from '@mainset/ui-core';
import {
  TEXT_BASE__CLASS_NAME_CONFIG,
  cnx,
  extractClassNamesFromProps,
  stylesTextBase,
} from '@mainset/ui-core';
import React from 'react';

interface TextSectionProps
  extends React.HTMLAttributes<HTMLSpanElement>, TextBaseProps {}

const TextSection: React.FC<TextSectionProps> = ({
  className,
  children,

  ...props
}) => {
  const [classNames, restProps] = extractClassNamesFromProps(
    [TEXT_BASE__CLASS_NAME_CONFIG],
    props,
    stylesTextBase,
  );

  return React.createElement(
    'span',
    {
      className: cnx(className, classNames),
      ...restProps,
    },
    children,
  );
};

export { TextSection };
