import type { ControlStyleProps } from '../elements/control/index.mjs';
import { CONTROL__CLASS_NAME_CONFIG } from '../elements/control/index.mjs';
import { composeClassNames } from '../utils/index.mjs';

/**
 * @example controlRecipe({ ctlSize: 'lg' }) // → "ms-control ms-control--size-lg"
 */
function controlRecipe(props: ControlStyleProps = {}) {
  return composeClassNames([CONTROL__CLASS_NAME_CONFIG], props);
}

export { controlRecipe };
