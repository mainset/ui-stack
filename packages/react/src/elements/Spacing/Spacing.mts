import type { SpacingStyleProps } from '@mainset/ui-core';
import {
  // SPACING__CLASS_NAME_CONFIG,
  SPACING__STYLE_CONFIG,
  cnx,
  // extractClassNamesFromProps,
  extractStyleObjFromProps,
  // stylesSpacingCNBased,
  stylesSpacingInlineStyleBased,
} from '@mainset/ui-core';
import React from 'react';

type SpacingProps = React.HTMLAttributes<HTMLElement> &
  SpacingStyleProps & {
    as?: 'span' | 'div';
  };

const Spacing: React.FC<SpacingProps> = ({
  as = 'div',

  children,
  className,
  // style,

  ...props
}) => {
  // 1. Maintain the exact extraction usage for standard utility classes
  // const [classNames, restProps] = extractClassNamesFromProps(
  //   [SPACING__CLASS_NAME_CONFIG],
  //   props,
  //   stylesSpacingCNBased,
  // );

  const [styleObj, restProps] = extractStyleObjFromProps(
    [SPACING__STYLE_CONFIG],
    props,
  );

  return React.createElement(
    as,
    {
      className: cnx(className, stylesSpacingInlineStyleBased['ms-spacing']),
      style: styleObj,
      ...restProps,
    },
    children,
  );
};

export { Spacing };
