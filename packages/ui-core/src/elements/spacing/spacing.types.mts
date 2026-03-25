import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import { SPACING__CLASS_NAME_CONFIG } from './spacing.constants.mjs';

interface SpacingBaseProps {
  // value-mapped
  spcScale: ExtractClassNameFromPropOptions<
    typeof SPACING__CLASS_NAME_CONFIG,
    'spcScale'
  >;
  spcType: ExtractClassNameFromPropOptions<
    typeof SPACING__CLASS_NAME_CONFIG,
    'spcType'
  >;
  spcSize?: ExtractClassNameFromPropOptions<
    typeof SPACING__CLASS_NAME_CONFIG,
    'spcSize'
  > | null;
}

export type { SpacingBaseProps };
