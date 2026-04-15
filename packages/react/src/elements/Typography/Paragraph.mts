import type { SpacingStyleProps, TextStyleProps } from '@mainset/ui-core';
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
    stylesTextBase,
  );
  const [styleObj, extractedStyleProps] = extractStyleObjFromProps(
    [SPACING__STYLE_CONFIG],
    extractedCNProps,
  );

  return React.createElement(
    'p',
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

export { Paragraph };
