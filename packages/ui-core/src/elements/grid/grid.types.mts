import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import { GRID_CONTAINER__CLASS_NAME_CONFIG } from './grid.constants.mjs';

interface GridContainerStyleProps {
  // value-mapped
  grdDisplay?: ExtractClassNameFromPropOptions<
    typeof GRID_CONTAINER__CLASS_NAME_CONFIG,
    'grdDisplay'
  > | null;
  grdAutoFlow?: ExtractClassNameFromPropOptions<
    typeof GRID_CONTAINER__CLASS_NAME_CONFIG,
    'grdAutoFlow'
  > | null;
}

interface GridItemStyleProps {
  // value-mapped
  // TODO:
  // boolean
  // TODO:
}

export type { GridContainerStyleProps, GridItemStyleProps };
