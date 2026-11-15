import type { SpacingStyleProps, TextStyleProps } from '@mainset/ui-core';
import {
  TEXT_BASE__CLASS_NAME_CONFIG,
  cnx,
  extractClassNamesFromProps,
  extractSpacingClassNamesFromProps,
} from '@mainset/ui-core';
import React from 'react';

type TextSectionProps = React.HTMLAttributes<HTMLSpanElement> &
  TextStyleProps &
  Partial<SpacingStyleProps>;

const TextSection: React.FC<TextSectionProps> = ({
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
    'span',
    {
      className: cnx(className, classNames, spacingClassNames),
      ...restProps,
    },
    children,
  );
};

export { TextSection };
