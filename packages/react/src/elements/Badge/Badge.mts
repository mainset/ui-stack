import {
  SPACING__STYLE_CONFIG,
  cnx,
  extractStyleObjFromProps,
  stylesSpacingInlineStyleBased,
} from '@mainset/ui-core';
import React from 'react';

import type { SurfaceProps } from '../Surface/index.mjs';
import { Surface } from '../Surface/index.mjs';

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, SurfaceProps {
  bdgSize?: 'base';
}

const PROPS__BY_BADGE_SIZE = {
  base: {
    spcType: 'p',
    spcScale: 'element',
    spcSize: 'base',
  },
};

const Badge: React.FC<BadgeProps> = ({
  bdgSize = 'base',

  children,
  className,

  ...props
}) => {
  const [styleObj] = extractStyleObjFromProps(
    [SPACING__STYLE_CONFIG],
    PROPS__BY_BADGE_SIZE[bdgSize],
  );

  return React.createElement(
    Surface,
    {
      className: cnx(className, stylesSpacingInlineStyleBased['ms-spacing']),
      style: styleObj,
      ...props,
    },
    children,
  );
};

export { Badge };
