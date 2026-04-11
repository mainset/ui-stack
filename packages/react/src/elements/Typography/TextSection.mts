import type { TextStyleProps } from '@mainset/ui-core';
import {
  SPACING__STYLE_CONFIG,
  TEXT_BASE__CLASS_NAME_CONFIG,
  cnx,
  extractClassNamesFromProps,
  extractStyleObjFromProps,
  stylesSpacingInlineStyleBased,
  stylesTextBase,
} from '@mainset/ui-core';
import React from 'react';

interface TextSectionProps
  extends React.HTMLAttributes<HTMLSpanElement>, TextStyleProps {}

const TextSection: React.FC<TextSectionProps> = ({
  className,
  children,

  ...props
}) => {
  const [classNames, extractedCNProps] = extractClassNamesFromProps(
    [TEXT_BASE__CLASS_NAME_CONFIG],
    props,
    stylesTextBase,
  );
  const [styleObj, extractedStyleProps] = extractStyleObjFromProps(
    [SPACING__STYLE_CONFIG],
    extractedCNProps,
  );

  return React.createElement(
    'span',
    {
      className: cnx(
        className,
        classNames,
        stylesSpacingInlineStyleBased['ms-spacing'],
      ),
      style: styleObj,
      ...extractedStyleProps,
    },
    children,
  );
};

export { TextSection };
