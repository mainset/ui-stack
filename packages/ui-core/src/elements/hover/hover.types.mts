import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import { HOVER__CLASS_NAME_CONFIG } from './hover.constants.mjs';

interface HoverStyleProps {
  // value-mapped
  hvrEffect?: ExtractClassNameFromPropOptions<
    typeof HOVER__CLASS_NAME_CONFIG,
    'hvrEffect'
  > | null;
  // boolean
  /** Hovering (or keyboard-focusing) this element plays the effects of its descendants */
  hvrIsGroup?: ExtractClassNameFromPropOptions<
    typeof HOVER__CLASS_NAME_CONFIG,
    'hvrIsGroup'
  > | null;
}

export type { HoverStyleProps };
