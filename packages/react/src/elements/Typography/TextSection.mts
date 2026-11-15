import type { SpacingStyleProps, TextStyleProps } from '@mainset/ui-core';
import {
  SPACING__STYLE_CONFIG,
  TEXT_BASE__CLASS_NAME_CONFIG,
  cnx,
  extractClassNamesFromProps,
  extractStyleObjFromProps,
} from '@mainset/ui-core';
import React from 'react';

type TextSectionProps = React.HTMLAttributes<HTMLSpanElement> &
  TextStyleProps &
  Partial<SpacingStyleProps>;

const TextSection: React.FC<TextSectionProps> = ({
  className,
  style,
  children,

  ...props
}) => {
  const [classNames, extractedCNProps] = extractClassNamesFromProps(
    [TEXT_BASE__CLASS_NAME_CONFIG],
    props,
  );
  const [styleObj, extractedStyleProps] = extractStyleObjFromProps(
    [SPACING__STYLE_CONFIG],
    extractedCNProps,
  );

  return React.createElement(
    'span',
    {
      className: cnx(className, classNames, 'ms-spacing'),
      // NOTE: merge, so a consumer `style` extends (not replaces) the spacing variables
      style: { ...styleObj, ...style },
      ...extractedStyleProps,
    },
    children,
  );
};

export { TextSection };
