import type { HrStyleProps, SpacingStyleProps } from '@mainset/ui-core';
import {
  HR__CLASS_NAME_CONFIG,
  SPACING__STYLE_CONFIG,
  cnx,
  extractClassNamesFromProps,
  extractStyleObjFromProps,
  stylesHr,
} from '@mainset/ui-core';
import React from 'react';

type HrProps = React.HTMLAttributes<HTMLHRElement> &
  HrStyleProps &
  SpacingStyleProps;

const Hr: React.FC<HrProps> = ({
  children,
  className,

  ...props
}) => {
  const [classNames, extractedCNProps] = extractClassNamesFromProps(
    [HR__CLASS_NAME_CONFIG],
    props,
    stylesHr,
  );
  const [styleObj, extractedStyleProps] = extractStyleObjFromProps(
    [SPACING__STYLE_CONFIG],
    extractedCNProps,
  );

  return React.createElement(
    'hr',
    {
      className: cnx(className, classNames),
      style: styleObj,
      ...extractedStyleProps,
    },
    children,
  );
};

export { Hr };
