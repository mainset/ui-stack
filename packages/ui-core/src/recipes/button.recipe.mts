import type { ButtonStyleProps } from '../elements/button/index.mjs';
import { BUTTON__CLASS_NAME_CONFIG } from '../elements/button/index.mjs';
import type { ControlStyleProps } from '../elements/control/index.mjs';
import { CONTROL__CLASS_NAME_CONFIG } from '../elements/control/index.mjs';
import { cnx, composeClassNames } from '../utils/index.mjs';
import type { SurfaceRecipeProps } from './surface.recipe.mjs';
import { SURFACE__RECIPE_CONFIGS } from './surface.recipe.mjs';
import { toneRecipe } from './tone.recipe.mjs';

type ButtonRecipeProps = ButtonStyleProps &
  ControlStyleProps &
  SurfaceRecipeProps;

/** Button = surface (tone × variant) + control (size) + button (behaviour), in one pass */
const BUTTON__RECIPE_CONFIGS = [
  ...SURFACE__RECIPE_CONFIGS,
  CONTROL__CLASS_NAME_CONFIG,
  BUTTON__CLASS_NAME_CONFIG,
];

/**
 * Button = surface (tone × variant) + control (size) + button (behaviour).
 *
 * @example
 * buttonRecipe({ srfVariant: 'outlined', srfTheme: 'error', ctlSize: 'sm' })
 * // → "ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-outlined
 * //    ms-control ms-control--size-sm ms-button ms-tone-error"
 */
function buttonRecipe({
  srfTheme,
  srfHover = 'all',
  ...props
}: ButtonRecipeProps = {}) {
  return cnx(
    composeClassNames(BUTTON__RECIPE_CONFIGS, { srfHover, ...props }),
    toneRecipe(srfTheme),
  );
}

export { BUTTON__RECIPE_CONFIGS, buttonRecipe };
export type { ButtonRecipeProps };
