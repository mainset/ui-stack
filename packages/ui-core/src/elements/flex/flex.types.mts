import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import {
  FLEX_CONTAINER__CLASS_NAME_CONFIG,
  FLEX_ITEM__CLASS_NAME_CONFIG,
} from './flex.constants.mjs';

interface FlexContainerStyleProps {
  // css-based
  flxDisplay?: ExtractClassNameFromPropOptions<
    typeof FLEX_CONTAINER__CLASS_NAME_CONFIG,
    'flxDisplay'
  > | null;
  flxDirection?: ExtractClassNameFromPropOptions<
    typeof FLEX_CONTAINER__CLASS_NAME_CONFIG,
    'flxDirection'
  > | null;
}

interface FlexItemStyleProps {
  // value-mapped
  flxGrow?: ExtractClassNameFromPropOptions<
    typeof FLEX_ITEM__CLASS_NAME_CONFIG,
    'flxGrow'
  > | null;
}

export type { FlexContainerStyleProps, FlexItemStyleProps };
