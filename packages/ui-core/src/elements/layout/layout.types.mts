import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import type { ElementPlainSize } from '../elements.types.mjs';
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
  layGapSize?: ElementPlainSize | null;
}

export type { LayoutStyleProps };
