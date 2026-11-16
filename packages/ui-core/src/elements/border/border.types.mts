import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import type { ElementPlainSize } from '../elements.types.mjs';
import { BORDER__CLASS_NAME_CONFIG } from './border.constants.mjs';

interface BorderStyleProps {
  // value-mapped: a tone, or the scheme's `subtle` / `default` / `strong` hairlines
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
  brdWidth?: ElementPlainSize | null;
}

export type { BorderStyleProps };
