import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import type { ElementColor } from '../elements.types.mjs';
import { SURFACE__CLASS_NAME_CONFIG } from './surface.constants.mjs';

interface SurfaceStyleProps {
  // value-mapped
  // a tone (or `transparent`), not a scheme background: it re-points `--ms-tone-*`
  srfTheme?: ElementColor | null;
  srfHover?: ExtractClassNameFromPropOptions<
    typeof SURFACE__CLASS_NAME_CONFIG,
    'srfHover'
  > | null;
  srfVariant?: ExtractClassNameFromPropOptions<
    typeof SURFACE__CLASS_NAME_CONFIG,
    'srfVariant'
  > | null;
}

export type { SurfaceStyleProps };
