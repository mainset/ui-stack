import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import { FLEX_CONTAINER__CLASS_NAME_CONFIG } from './flex.constants.mjs';

interface FlexContainerStyleProps {
  // value-mapped
  flxDisplay?: ExtractClassNameFromPropOptions<
    typeof FLEX_CONTAINER__CLASS_NAME_CONFIG,
    'flxDisplay'
  > | null;
  flxDirection?: ExtractClassNameFromPropOptions<
    typeof FLEX_CONTAINER__CLASS_NAME_CONFIG,
    'flxDirection'
  > | null;
  flxJustify?: ExtractClassNameFromPropOptions<
    typeof FLEX_CONTAINER__CLASS_NAME_CONFIG,
    'flxJustify'
  > | null;
  flxAlign?: ExtractClassNameFromPropOptions<
    typeof FLEX_CONTAINER__CLASS_NAME_CONFIG,
    'flxAlign'
  > | null;
}

interface FlexItemStyleProps {
  // value-mapped
  // TODO:
  // boolean
  // TODO:
}

export type { FlexContainerStyleProps, FlexItemStyleProps };
