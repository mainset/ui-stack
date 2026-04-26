import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import { BACKGROUND__CLASS_NAME_CONFIG } from './background.constants.mjs';

interface BackgroundStyleProps {
  // value-mapped
  bgColor?: ExtractClassNameFromPropOptions<
    typeof BACKGROUND__CLASS_NAME_CONFIG,
    'bgColor'
  > | null;
}

export type { BackgroundStyleProps };
