import type { BackgroundStyleProps } from '../elements/background/index.mjs';
import { BACKGROUND__CLASS_NAME_CONFIG } from '../elements/background/index.mjs';
import type { BorderStyleProps } from '../elements/border/index.mjs';
import { BORDER__CLASS_NAME_CONFIG } from '../elements/border/index.mjs';
import type { SurfaceStyleProps } from '../elements/surface/index.mjs';
import { SURFACE__CLASS_NAME_CONFIG } from '../elements/surface/index.mjs';
import { cnx, composeClassNames } from '../utils/index.mjs';
import { toneRecipe } from './tone.recipe.mjs';

type SurfaceRecipeProps = SurfaceStyleProps &
  BackgroundStyleProps &
  BorderStyleProps;

const SURFACE__RECIPE_CONFIGS = [
  BACKGROUND__CLASS_NAME_CONFIG,
  BORDER__CLASS_NAME_CONFIG,
  SURFACE__CLASS_NAME_CONFIG,
];

/**
 * @example surfaceRecipe({ srfTheme: 'error', srfVariant: 'soft' })
 * // → "ms-background ms-border ms-surface ms-surface--variant-soft ms-tone-error"
 */
function surfaceRecipe({ srfTheme, ...props }: SurfaceRecipeProps = {}) {
  return cnx(
    composeClassNames(SURFACE__RECIPE_CONFIGS, props),
    toneRecipe(srfTheme),
  );
}

export { SURFACE__RECIPE_CONFIGS, surfaceRecipe };
export type { SurfaceRecipeProps };
