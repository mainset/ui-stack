import type {
  GridContainerStyleProps,
  GridItemStyleProps,
  LayoutStyleProps,
} from '@mainset/ui-core';
import {
  GRID_CONTAINER__CLASS_NAME_CONFIG,
  GRID_ITEM__CLASS_NAME_CONFIG,
  LAYOUT__CLASS_NAME_CONFIG,
  cnx,
  extractClassNamesFromProps,
} from '@mainset/ui-core';
import React from 'react';

import type { PolymorphicProps } from '../utils/index.mjs';
import { mergeResponsiveStyle } from '../utils/index.mjs';

type GridElementType = 'div' | 'section' | 'main' | 'article' | 'ul' | 'ol';

type GridContainerProps<C extends GridElementType = 'div'> = PolymorphicProps<
  'grdAs',
  C,
  GridContainerStyleProps & LayoutStyleProps
>;

/**
 * CSS grid: auto-fit columns by default, `grdColumns` (1–12, responsive) for equal columns,
 * `layGapSize` for the gap.
 *
 * @example
 * <Grid grdColumns={{ base: 1, md: 2, lg: 3 }} layGapSize="base">
 *   <Grid.Item grdColSpan={{ base: 1, lg: 2 }}>…</Grid.Item>
 * </Grid>
 */
function GridContainer<C extends GridElementType = 'div'>({
  grdAs,

  children,
  className,
  style,

  ...props
}: GridContainerProps<C>) {
  const [classNames, restProps, responsiveStyle] = extractClassNamesFromProps(
    [GRID_CONTAINER__CLASS_NAME_CONFIG, LAYOUT__CLASS_NAME_CONFIG],
    props,
  );

  return React.createElement(
    grdAs || 'div',
    {
      className: cnx(className, classNames),
      style: mergeResponsiveStyle(responsiveStyle, style),
      ...restProps,
    },
    children,
  );
}

type GridItemElementType = 'div' | 'section' | 'article' | 'li';

type GridItemProps<C extends GridItemElementType = 'div'> = PolymorphicProps<
  'grdAs',
  C,
  GridItemStyleProps
>;

/** A grid cell: `grdColSpan` (responsive) columns wide, or `grdIsFullRow` */
function GridItem<C extends GridItemElementType = 'div'>({
  grdAs,

  children,
  className,
  style,

  ...props
}: GridItemProps<C>) {
  const [classNames, restProps, responsiveStyle] = extractClassNamesFromProps(
    [GRID_ITEM__CLASS_NAME_CONFIG],
    props,
  );

  return React.createElement(
    grdAs || 'div',
    {
      className: cnx(className, classNames),
      style: mergeResponsiveStyle(responsiveStyle, style),
      ...restProps,
    },
    children,
  );
}

const Grid = Object.assign(GridContainer, {
  Item: GridItem,
});

export { Grid };
export type {
  GridContainerProps,
  GridElementType,
  GridItemElementType,
  GridItemProps,
};
