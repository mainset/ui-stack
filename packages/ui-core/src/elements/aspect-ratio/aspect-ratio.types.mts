import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import { ASPECT_RATIO__CLASS_NAME_CONFIG } from './aspect-ratio.constants.mjs';

interface AspectRatioStyleProps {
  // value-mapped
  aspRatio?: ExtractClassNameFromPropOptions<
    typeof ASPECT_RATIO__CLASS_NAME_CONFIG,
    'aspRatio'
  > | null;
  aspFit?: ExtractClassNameFromPropOptions<
    typeof ASPECT_RATIO__CLASS_NAME_CONFIG,
    'aspFit'
  > | null;
}

export type { AspectRatioStyleProps };
