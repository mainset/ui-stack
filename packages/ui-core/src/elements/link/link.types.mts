import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import { LINK__CLASS_NAME_CONFIG } from './link.constants.mjs';

interface LinkStyleProps {
  // value-mapped
  lnkUnderline?: ExtractClassNameFromPropOptions<
    typeof LINK__CLASS_NAME_CONFIG,
    'lnkUnderline'
  > | null;
}

export type { LinkStyleProps };
