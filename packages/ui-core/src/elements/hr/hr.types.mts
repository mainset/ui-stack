import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import { HR__CLASS_NAME_CONFIG } from './hr.constants.mjs';

interface HrBaseProps {
  // value-mapped
  hrColor?: ExtractClassNameFromPropOptions<
    typeof HR__CLASS_NAME_CONFIG,
    'hrColor'
  > | null;
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

export type { HrBaseProps };
