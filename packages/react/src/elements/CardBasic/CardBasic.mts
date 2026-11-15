import { cnx, spacingRecipe } from '@mainset/ui-core';
import React from 'react';

import type { SurfaceProps } from '../Surface/index.mjs';
import { Surface } from '../Surface/index.mjs';

interface CardBasicProps
  extends React.HTMLAttributes<HTMLDivElement>, SurfaceProps {}

const PROPS__BY_CARD_SIZE = {
  base: {
    spcType: 'p',
    spcScale: 'component',
    spcSize: 'xl',
  },
} as const;

const CardBasic: React.FC<CardBasicProps> = ({
  children,
  className,

  ...props
}) => {
  return React.createElement(
    Surface,
    {
      className: cnx(
        className,
        spacingRecipe(PROPS__BY_CARD_SIZE['base']).className,
      ),
      ...props,
    },
    children,
  );
};

export { CardBasic };
