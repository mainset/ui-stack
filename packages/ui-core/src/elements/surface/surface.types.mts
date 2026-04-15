import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import type { BackgroundStyleProps } from '../background/background.types.mts';
import { SURFACE__CLASS_NAME_CONFIG } from './surface.constants.mjs';

interface SurfaceStyleProps {
  // value-mapped
  srfTheme?: BackgroundStyleProps['bgColor'];
  srfVariant?: ExtractClassNameFromPropOptions<
    typeof SURFACE__CLASS_NAME_CONFIG,
    'srfVariant'
  > | null;
}

export type { SurfaceStyleProps };
