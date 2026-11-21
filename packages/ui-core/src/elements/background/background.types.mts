import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import { BACKGROUND__CLASS_NAME_CONFIG } from './background.constants.mjs';

interface BackgroundStyleProps {
  // value-mapped: a tone, or the scheme's `canvas` / `surface` / `subtle`
  bgColor?: ExtractClassNameFromPropOptions<
    typeof BACKGROUND__CLASS_NAME_CONFIG,
    'bgColor'
  > | null;
}

export type { BackgroundStyleProps };
