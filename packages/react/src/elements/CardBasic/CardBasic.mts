import {
  SPACING__STYLE_CONFIG,
  cnx,
  extractStyleObjFromProps,
  stylesSpacingInlineStyleBased,
} from '@mainset/ui-core';
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
};

const CardBasic: React.FC<CardBasicProps> = ({
  children,
  className,

  ...props
}) => {
  const [styleObj] = extractStyleObjFromProps(
    [SPACING__STYLE_CONFIG],
    PROPS__BY_CARD_SIZE['base'],
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

export { CardBasic };
