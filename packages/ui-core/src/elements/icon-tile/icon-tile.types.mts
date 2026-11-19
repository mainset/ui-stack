import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import { ICON_TILE__CLASS_NAME_CONFIG } from './icon-tile.constants.mjs';

type IconTileConfig = typeof ICON_TILE__CLASS_NAME_CONFIG;

interface IconTileStyleProps {
  // value-mapped
  ictSize?: ExtractClassNameFromPropOptions<IconTileConfig, 'ictSize'> | null;
  ictShape?: ExtractClassNameFromPropOptions<IconTileConfig, 'ictShape'> | null;
  ictVariant?: ExtractClassNameFromPropOptions<
    IconTileConfig,
    'ictVariant'
  > | null;
}

export type { IconTileStyleProps };
