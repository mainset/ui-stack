import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import { BUTTON__CLASS_NAME_CONFIG } from './button.constants.mjs';

interface ButtonStyleProps {
  // value-mapped
  btnTheme: ExtractClassNameFromPropOptions<
    typeof BUTTON__CLASS_NAME_CONFIG,
    'btnTheme'
  > | null;
  btnThemeVariant?: ExtractClassNameFromPropOptions<
    typeof BUTTON__CLASS_NAME_CONFIG,
    'btnThemeVariant'
  > | null;
  // boolean
  btnIsDisabled?: ExtractClassNameFromPropOptions<
    typeof BUTTON__CLASS_NAME_CONFIG,
    'btnIsDisabled'
  > | null;
  btnIsFullWidth?: ExtractClassNameFromPropOptions<
    typeof BUTTON__CLASS_NAME_CONFIG,
    'btnIsFullWidth'
  > | null;
}

export type { ButtonStyleProps };
