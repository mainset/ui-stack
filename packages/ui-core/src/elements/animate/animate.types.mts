import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import { ANIMATE__CLASS_NAME_CONFIG } from './animate.constants.mjs';

type AnimateConfig = typeof ANIMATE__CLASS_NAME_CONFIG;

interface AnimateStyleProps {
  // value-mapped
  anmState?: ExtractClassNameFromPropOptions<AnimateConfig, 'anmState'> | null;
  anmSlide?: ExtractClassNameFromPropOptions<AnimateConfig, 'anmSlide'> | null;
  anmZoom?: ExtractClassNameFromPropOptions<AnimateConfig, 'anmZoom'> | null;
  anmDuration?: ExtractClassNameFromPropOptions<
    AnimateConfig,
    'anmDuration'
  > | null;
  // boolean
  anmFade?: ExtractClassNameFromPropOptions<AnimateConfig, 'anmFade'> | null;
}

export type { AnimateStyleProps };
