import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import { DIALOG__CLASS_NAME_CONFIG } from './dialog.constants.mjs';

interface DialogStyleProps {
  // value-mapped
  dlgSize?: ExtractClassNameFromPropOptions<
    typeof DIALOG__CLASS_NAME_CONFIG,
    'dlgSize'
  > | null;
  // boolean
  dlgIsDrawer?: ExtractClassNameFromPropOptions<
    typeof DIALOG__CLASS_NAME_CONFIG,
    'dlgIsDrawer'
  > | null;
}

export type { DialogStyleProps };
