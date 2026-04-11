import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import { LAYOUT__CLASS_NAME_CONFIG } from './layout.constants.mjs';

interface LayoutStyleProps {
  // value-mapped
  layJustify?: ExtractClassNameFromPropOptions<
    typeof LAYOUT__CLASS_NAME_CONFIG,
    'layJustify'
  > | null;
  layAlign?: ExtractClassNameFromPropOptions<
    typeof LAYOUT__CLASS_NAME_CONFIG,
    'layAlign'
  > | null;
  layGapSize?: ExtractClassNameFromPropOptions<
    typeof LAYOUT__CLASS_NAME_CONFIG,
    'layGapSize'
  > | null;
}

export type { LayoutStyleProps };
