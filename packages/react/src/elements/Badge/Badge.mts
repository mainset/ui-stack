import type { SurfaceBaseProps } from '@mainset/ui-core';
import {
  SPACING__STYLE_CONFIG,
  SURFACE__CLASS_NAME_CONFIG,
  cnx,
  extractClassNamesFromProps,
  extractStyleObjFromProps,
  stylesSpacingInlineStyleBased,
  stylesSurface,
} from '@mainset/ui-core';
import React from 'react';

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, SurfaceBaseProps {}

const Badge: React.FC<BadgeProps> = ({
  children,
  className,

  ...props
}) => {
  const [classNames, restProps] = extractClassNamesFromProps(
    [SURFACE__CLASS_NAME_CONFIG],
    props,
    stylesSurface,
  );
  const [styleObj] = extractStyleObjFromProps([SPACING__STYLE_CONFIG], {
    spcType: 'p',
    spcScale: 'element',
    spcSize: 'base',
  });

  return React.createElement(
    'div',
    {
      className: cnx(
        className,
        stylesSpacingInlineStyleBased['ms-spacing'],
        classNames,
      ),
      style: styleObj,
      ...restProps,
    },
    children,
  );
};

export { Badge };
