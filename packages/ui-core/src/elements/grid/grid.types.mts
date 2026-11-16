import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import type { ResponsiveValue } from '../elements.types.mjs';
import {
  GRID_CONTAINER__CLASS_NAME_CONFIG,
  GRID_ITEM__CLASS_NAME_CONFIG,
} from './grid.constants.mjs';

interface GridContainerStyleProps {
  // value-mapped (responsive)
  grdDisplay?: ResponsiveValue<
    ExtractClassNameFromPropOptions<
      typeof GRID_CONTAINER__CLASS_NAME_CONFIG,
      'grdDisplay'
    >
  > | null;
  grdAutoFlow?: ResponsiveValue<
    ExtractClassNameFromPropOptions<
      typeof GRID_CONTAINER__CLASS_NAME_CONFIG,
      'grdAutoFlow'
    >
  > | null;
  grdColumns?: ResponsiveValue<
    ExtractClassNameFromPropOptions<
      typeof GRID_CONTAINER__CLASS_NAME_CONFIG,
      'grdColumns'
    >
  > | null;
}

interface GridItemStyleProps {
  // value-mapped (responsive)
  grdColSpan?: ResponsiveValue<
    ExtractClassNameFromPropOptions<
      typeof GRID_ITEM__CLASS_NAME_CONFIG,
      'grdColSpan'
    >
  > | null;
  // boolean
  grdIsFullRow?: boolean | null;
}

export type { GridContainerStyleProps, GridItemStyleProps };
