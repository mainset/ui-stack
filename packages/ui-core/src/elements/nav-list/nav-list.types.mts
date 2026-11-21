import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import { NAV_LIST__CLASS_NAME_CONFIG } from './nav-list.constants.mjs';

interface NavListStyleProps {
  // value-mapped
  navVariant?: ExtractClassNameFromPropOptions<
    typeof NAV_LIST__CLASS_NAME_CONFIG,
    'navVariant'
  > | null;
}

export type { NavListStyleProps };
