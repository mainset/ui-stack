import type {
  GridContainerStyleProps,
  GridItemStyleProps,
  LayoutStyleProps,
} from '@mainset/ui-core';
import {
  GRID_CONTAINER__CLASS_NAME_CONFIG,
  LAYOUT__CLASS_NAME_CONFIG,
  cnx,
  extractClassNamesFromProps,
  stylesGrid,
  stylesLayout,
} from '@mainset/ui-core';
import React from 'react';

interface GridContainerProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    React.ComponentPropsWithRef<React.ElementType>,
    GridContainerStyleProps,
    LayoutStyleProps {
  as?: 'main' | 'section' | 'div';
}

const GridContainer: React.FC<GridContainerProps> = ({
  as = 'div',

  children,
  className,

  ...props
}) => {
  const [classNames, restProps] = extractClassNamesFromProps(
    [GRID_CONTAINER__CLASS_NAME_CONFIG, LAYOUT__CLASS_NAME_CONFIG],
    props,
    Object.assign({}, stylesGrid, stylesLayout),
  );

  return React.createElement(
    as,
    {
      className: cnx(className, classNames),
      ...restProps,
    },
    children,
  );
};

interface GridItemProps
  extends React.HTMLAttributes<HTMLDivElement>, GridItemStyleProps {
  as?: 'section' | 'div';
}

const GridItem: React.FC<GridItemProps> = ({
  as = 'div',

  children,
  className,

  ...props
}) => {
  return React.createElement(
    as,
    {
      className: cnx(
        className,
        // stylesGrid['ms-grid__item']
      ),
      ...props,
    },
    children,
  );
};

const Grid = Object.assign(GridContainer, {
  Item: GridItem,
});

export { Grid };
export type { GridContainerProps, GridItemProps };
