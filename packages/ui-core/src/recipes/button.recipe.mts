import type { ButtonStyleProps } from '../elements/button/index.mjs';
import { BUTTON__CLASS_NAME_CONFIG } from '../elements/button/index.mjs';
import type { ControlStyleProps } from '../elements/control/index.mjs';
import { cnx, composeClassNames } from '../utils/index.mjs';
import { controlRecipe } from './control.recipe.mjs';
import type { SurfaceRecipeProps } from './surface.recipe.mjs';
import { surfaceRecipe } from './surface.recipe.mjs';

type ButtonRecipeProps = ButtonStyleProps &
  ControlStyleProps &
  SurfaceRecipeProps;

/**
 * Button = surface (tone × variant) + control (size) + button (behaviour).
 *
 * @example
 * buttonRecipe({ srfVariant: 'outlined', srfTheme: 'error', ctlSize: 'sm' })
 * // → "ms-background ms-border ms-surface ms-surface--variant-outlined ms-surface--hover-all
 * //    ms-tone-error ms-control ms-control--size-sm ms-button"
 */
function buttonRecipe({
  ctlSize,
  btnIsDisabled,
  btnIsFullWidth,
  srfHover = 'all',
  ...surfaceProps
}: ButtonRecipeProps = {}) {
  return cnx(
    surfaceRecipe({ srfHover, ...surfaceProps }),
    controlRecipe({ ctlSize }),
    composeClassNames([BUTTON__CLASS_NAME_CONFIG], {
      btnIsDisabled,
      btnIsFullWidth,
    }),
  );
}

export { buttonRecipe };
export type { ButtonRecipeProps };
