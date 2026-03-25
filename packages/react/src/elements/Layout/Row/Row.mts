import { cnx } from '@mainset/ui-core';
import React from 'react';

import { asLayout } from '../../hocs/Layout/index.mjs';

interface RowBasicProps extends React.HTMLAttributes<HTMLDivElement> {
  noGutters?: boolean;
  withHorizontalScroll?: boolean;
}

const RowBasic: React.FC<RowBasicProps> = ({
  children,
  className,

  noGutters,
  withHorizontalScroll,

  ...props
}) =>
  React.createElement(
    'div',
    {
      className: cnx(
        'ms-row',
        {
          'ms-row--no-gutters': noGutters,
          'ms-row--with-scroll': withHorizontalScroll,
        },
        className,
      ),
      ...props,
    },
    children,
  );

const RowLayout = asLayout(RowBasic);

export { RowLayout as Row };
