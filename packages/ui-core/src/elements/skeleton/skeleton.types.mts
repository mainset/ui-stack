import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import { SKELETON__CLASS_NAME_CONFIG } from './skeleton.constants.mjs';

interface SkeletonStyleProps {
  // value-mapped
  sklVariant?: ExtractClassNameFromPropOptions<
    typeof SKELETON__CLASS_NAME_CONFIG,
    'sklVariant'
  > | null;
}

export type { SkeletonStyleProps };
