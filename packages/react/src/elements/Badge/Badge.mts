import {
  TEXT_BASE__CLASS_NAME_CONFIG,
  cnx,
  composeClassNames,
  spacingRecipe,
} from '@mainset/ui-core';
import React from 'react';

import type { SurfaceProps } from '../Surface/index.mjs';
import { Surface } from '../Surface/index.mjs';

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, SurfaceProps {
  /** `sm`: a compact label (counts, "New", a status), in small text */
  bdgSize?: 'sm' | 'base';
}

// NOTE: `sm` pads each axis on its own: a label is wider than it is tall
const CLASS_NAMES__BY_BADGE_SIZE = {
  sm: cnx(
    spacingRecipe({ spcType: 'pv', spcScale: 'element', spcSize: 'xs' }),
    spacingRecipe({ spcType: 'ph', spcScale: 'element', spcSize: 'lg' }),
    composeClassNames([TEXT_BASE__CLASS_NAME_CONFIG], {
      txtSize: 'xs',
      txtLeading: 'tight',
    }),
  ),
  base: spacingRecipe({ spcType: 'p', spcScale: 'element', spcSize: 'base' }),
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
      className: cnx(className, CLASS_NAMES__BY_BADGE_SIZE[bdgSize]),
      ...props,
    },
    children,
  );
};

export { Badge };
