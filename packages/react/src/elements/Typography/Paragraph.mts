import type { SpacingStyleProps, TextStyleProps } from '@mainset/ui-core';
import {
  TEXT_BASE__CLASS_NAME_CONFIG,
  cnx,
  extractClassNamesFromProps,
  extractSpacingClassNamesFromProps,
} from '@mainset/ui-core';
import React from 'react';

import { mergeResponsiveStyle } from '../utils/index.mjs';

type ParagraphProps = React.HTMLAttributes<HTMLParagraphElement> &
  TextStyleProps &
  Partial<SpacingStyleProps>;

const Paragraph: React.FC<ParagraphProps> = ({
  children,
  className,
  style,

  ...props
}) => {
  const [classNames, extractedCNProps] = extractClassNamesFromProps(
    [TEXT_BASE__CLASS_NAME_CONFIG],
    props,
  );
  const [spacingClassNames, restProps, spacingStyle] =
    extractSpacingClassNamesFromProps(extractedCNProps);

  return React.createElement(
    'p',
    {
      className: cnx(className, classNames, spacingClassNames),
      style: mergeResponsiveStyle(spacingStyle, style),
      ...restProps,
    },
    children,
  );
};

export { Paragraph };
