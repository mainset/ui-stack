import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import { BUTTON__CLASS_NAME_CONFIG } from './button.constants.mjs';

interface ButtonStyleProps {
  // boolean
  btnIsDisabled?: ExtractClassNameFromPropOptions<
    typeof BUTTON__CLASS_NAME_CONFIG,
    'btnIsDisabled'
  > | null;
  btnIsFullWidth?: ExtractClassNameFromPropOptions<
    typeof BUTTON__CLASS_NAME_CONFIG,
    'btnIsFullWidth'
  > | null;
  /** Icon only: a square of the control height. Give it an `aria-label`. */
  btnIsIcon?: ExtractClassNameFromPropOptions<
    typeof BUTTON__CLASS_NAME_CONFIG,
    'btnIsIcon'
  > | null;
}

export type { ButtonStyleProps };
