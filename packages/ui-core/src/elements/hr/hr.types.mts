import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import type { ElementColor } from '../elements.types.mjs';
import { HR__CLASS_NAME_CONFIG } from './hr.constants.mjs';

interface HrStyleProps {
  // value-mapped
  hrColor?: ElementColor | null;
  hrDirection?: ExtractClassNameFromPropOptions<
    typeof HR__CLASS_NAME_CONFIG,
    'hrDirection'
  > | null;
  // boolean
  hrIsHidden?: ExtractClassNameFromPropOptions<
    typeof HR__CLASS_NAME_CONFIG,
    'hrIsHidden'
  > | null;
}

export type { HrStyleProps };
