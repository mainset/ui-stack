import type { ExtractClassNameFromPropOptions } from '../utils/index.mjs';
import { SURFACE__CLASS_NAME_CONFIG } from './surface.constants.mjs';

interface SurfaceBaseProps {
  // value-mapped
  srfBackgroundColor?: ExtractClassNameFromPropOptions<
    typeof SURFACE__CLASS_NAME_CONFIG,
    'srfBackgroundColor'
  > | null;
  srfBorderRadius?: ExtractClassNameFromPropOptions<
    typeof SURFACE__CLASS_NAME_CONFIG,
    'srfBorderRadius'
  > | null;
}

export type { SurfaceBaseProps };
