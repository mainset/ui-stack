import { cnx, spacingRecipe } from '@mainset/ui-core';
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
} as const;

const Badge: React.FC<BadgeProps> = ({
  bdgSize = 'base',

  children,
  className,

  ...props
}) => {
  return React.createElement(
    Surface,
    {
      className: cnx(className, spacingRecipe(PROPS__BY_BADGE_SIZE[bdgSize])),
      ...props,
    },
    children,
  );
};

export { Badge };
