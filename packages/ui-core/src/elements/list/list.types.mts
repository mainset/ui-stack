import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import { LIST__CLASS_NAME_CONFIG } from './list.constants.mjs';

interface ListStyleProps {
  // value-mapped
  lstDirection?: ExtractClassNameFromPropOptions<
    typeof LIST__CLASS_NAME_CONFIG,
    'lstDirection'
  > | null;
  lstStyle?: ExtractClassNameFromPropOptions<
    typeof LIST__CLASS_NAME_CONFIG,
    'lstStyle'
  > | null;
  lstJustify?: ExtractClassNameFromPropOptions<
    typeof LIST__CLASS_NAME_CONFIG,
    'lstJustify'
  > | null;
}

export type { ListStyleProps };
