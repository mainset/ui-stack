import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import { TABS__CLASS_NAME_CONFIG } from './tabs.constants.mjs';

interface TabsStyleProps {
  // value-mapped
  tbsOrientation?: ExtractClassNameFromPropOptions<
    typeof TABS__CLASS_NAME_CONFIG,
    'tbsOrientation'
  > | null;
}

export type { TabsStyleProps };
