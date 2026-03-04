import cn from 'classnames';
import React from 'react';

import { asLayout } from '../../hocs/Layout';

interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  noGutters?: boolean;
  withHorizontalScroll?: boolean;
}

const Row: React.FC<RowProps> = ({
  children,
  className,

  noGutters,
  withHorizontalScroll,

  ...props
}) =>
  React.createElement(
    'div',
    {
      className: cn(
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

export { Row };
export default asLayout(Row);
