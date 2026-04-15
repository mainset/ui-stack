import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import { BORDER__CLASS_NAME_CONFIG } from './border.constants.mjs';

interface BorderStyleProps {
  // value-mapped
  brdColor?: ExtractClassNameFromPropOptions<
    typeof BORDER__CLASS_NAME_CONFIG,
    'brdColor'
  > | null;
  brdRadius?: ExtractClassNameFromPropOptions<
    typeof BORDER__CLASS_NAME_CONFIG,
    'brdRadius'
  > | null;
  brdStyle?: ExtractClassNameFromPropOptions<
    typeof BORDER__CLASS_NAME_CONFIG,
    'brdStyle'
  > | null;
  brdWidth?: ExtractClassNameFromPropOptions<
    typeof BORDER__CLASS_NAME_CONFIG,
    'brdWidth'
  > | null;
}

export type { BorderStyleProps };
