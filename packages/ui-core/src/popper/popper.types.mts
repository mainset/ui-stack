import type { ExtractClassNameFromPropOptions } from '../utils/index.mjs';
import { POPPER_WRAPPER__CLASS_NAME_CONFIG } from './popper.constants.mjs';

interface PopperWrapperBaseProps {
  // boolean
  popIsOpened?: ExtractClassNameFromPropOptions<
    typeof POPPER_WRAPPER__CLASS_NAME_CONFIG,
    'popIsOpened'
  > | null;
}

export type { PopperWrapperBaseProps };
