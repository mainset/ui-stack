import type { HrStyleProps, SpacingStyleProps } from '@mainset/ui-core';
import {
  HR__CLASS_NAME_CONFIG,
  SPACING__STYLE_CONFIG,
  cnx,
  extractClassNamesFromProps,
  extractStyleObjFromProps,
} from '@mainset/ui-core';
import React from 'react';

type HrProps = React.HTMLAttributes<HTMLHRElement> &
  HrStyleProps &
  Partial<SpacingStyleProps>;

const Hr: React.FC<HrProps> = ({
  children,
  className,
  style,

  ...props
}) => {
  const [classNames, extractedCNProps] = extractClassNamesFromProps(
    [HR__CLASS_NAME_CONFIG],
    props,
  );
  const [styleObj, extractedStyleProps] = extractStyleObjFromProps(
    [SPACING__STYLE_CONFIG],
    extractedCNProps,
  );

  return React.createElement(
    'hr',
    {
      className: cnx(className, classNames, 'ms-spacing'),
      // NOTE: merge, so a consumer `style` extends (not replaces) the spacing variables
      style: { ...styleObj, ...style },
      ...extractedStyleProps,
    },
    children,
  );
};

export { Hr };
