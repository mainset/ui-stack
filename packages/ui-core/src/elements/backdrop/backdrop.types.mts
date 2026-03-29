import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import { BACKDROP__CLASS_NAME_CONFIG } from './backdrop.constants.mjs';

interface BackdropBaseProps {
  // boolean
  bckIsVisible?: ExtractClassNameFromPropOptions<
    typeof BACKDROP__CLASS_NAME_CONFIG,
    'bckIsVisible'
  > | null;
}

export type { BackdropBaseProps };
