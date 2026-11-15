import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import type { ElementPlainSize, ResponsiveValue } from '../elements.types.mjs';
import { LAYOUT__CLASS_NAME_CONFIG } from './layout.constants.mjs';

interface LayoutStyleProps {
  // value-mapped (responsive)
  layJustify?: ResponsiveValue<
    ExtractClassNameFromPropOptions<
      typeof LAYOUT__CLASS_NAME_CONFIG,
      'layJustify'
    >
  > | null;
  layAlign?: ResponsiveValue<
    ExtractClassNameFromPropOptions<
      typeof LAYOUT__CLASS_NAME_CONFIG,
      'layAlign'
    >
  > | null;
  layGapSize?: ResponsiveValue<ElementPlainSize> | null;
}

export type { LayoutStyleProps };
