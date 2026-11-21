import { cnx, spacingRecipe } from '@mainset/ui-core';
import React from 'react';

import type { SurfaceProps } from '../Surface/index.mjs';
import { Surface } from '../Surface/index.mjs';

interface CardBasicProps
  extends React.HTMLAttributes<HTMLDivElement>, SurfaceProps {
  /**
   * The whole card is a link: put one `<Link lnkIsStretched>` inside (its title, usually). The card
   * is also a hover group, so `hvrEffect` on it or inside it (an arrow) plays on hover.
   */
  crdIsInteractive?: boolean;
}

const PROPS__BY_CARD_SIZE = {
  base: {
    spcType: 'p',
    spcScale: 'component',
    spcSize: 'xl',
  },
} as const;

const CardBasic: React.FC<CardBasicProps> = ({
  crdIsInteractive,

  children,
  className,

  ...props
}) => {
  return React.createElement(
    Surface,
    {
      className: cnx(
        className,
        spacingRecipe(PROPS__BY_CARD_SIZE.base),
        crdIsInteractive && 'ms-link-area',
      ),
      hvrIsGroup: crdIsInteractive || undefined,
      ...props,
    },
    children,
  );
};

export { CardBasic };
