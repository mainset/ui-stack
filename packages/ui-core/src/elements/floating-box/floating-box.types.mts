import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import { FLOATING_BOX__WRAPPER__CLASS_NAME_CONFIG } from './floating-box.constants.mjs';

interface FloatingBoxWrapperBaseProps {
  // value-mapped
  flbDirection?: ExtractClassNameFromPropOptions<
    typeof FLOATING_BOX__WRAPPER__CLASS_NAME_CONFIG,
    'flbDirection'
  > | null;
  flbAlignment?: ExtractClassNameFromPropOptions<
    typeof FLOATING_BOX__WRAPPER__CLASS_NAME_CONFIG,
    'flbAlignment'
  > | null;
  flbPlacement?: ExtractClassNameFromPropOptions<
    typeof FLOATING_BOX__WRAPPER__CLASS_NAME_CONFIG,
    'flbPlacement'
  > | null;
  flbPosition?: ExtractClassNameFromPropOptions<
    typeof FLOATING_BOX__WRAPPER__CLASS_NAME_CONFIG,
    'flbPosition'
  > | null;
}

export type { FloatingBoxWrapperBaseProps };
