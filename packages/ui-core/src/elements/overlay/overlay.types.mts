import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import { OVERLAY__CLASS_NAME_CONFIG } from './overlay.constants.mjs';

interface OverlayStyleProps {
  // value-mapped
  ovrPlacement?: ExtractClassNameFromPropOptions<
    typeof OVERLAY__CLASS_NAME_CONFIG,
    'ovrPlacement'
  > | null;
}

export type { OverlayStyleProps };
