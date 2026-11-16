import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import { AVATAR__CLASS_NAME_CONFIG } from './avatar.constants.mjs';

interface AvatarStyleProps {
  // value-mapped
  avtSize?: ExtractClassNameFromPropOptions<
    typeof AVATAR__CLASS_NAME_CONFIG,
    'avtSize'
  > | null;
  avtShape?: ExtractClassNameFromPropOptions<
    typeof AVATAR__CLASS_NAME_CONFIG,
    'avtShape'
  > | null;
}

export type { AvatarStyleProps };
