import type { ControlStyleProps } from '../elements/control/index.mjs';
import { CONTROL__CLASS_NAME_CONFIG } from '../elements/control/index.mjs';
import {
  INPUT__CLASS_NAME_CONFIG,
  SELECT__CLASS_NAME_CONFIG,
} from '../elements/input/index.mjs';
import { composeClassNames } from '../utils/index.mjs';

const INPUT__RECIPE_CONFIGS = [
  CONTROL__CLASS_NAME_CONFIG,
  INPUT__CLASS_NAME_CONFIG,
];

/**
 * For `<input>` (text-like types), `<textarea>` and native `<select>`: the control size + field look.
 *
 * @example
 * inputRecipe({ ctlSize: 'lg' }) // → "ms-control ms-control--size-lg ms-input"
 * // a select also needs its wrapper: <span class="ms-select"><select class="…">…</select></span>
 */
function inputRecipe(props: ControlStyleProps = {}) {
  return composeClassNames(INPUT__RECIPE_CONFIGS, props);
}

/** The wrapper of a native `<select>` (draws the chevron) → `"ms-select"` */
function selectWrapperRecipe() {
  return composeClassNames([SELECT__CLASS_NAME_CONFIG], {});
}

export { INPUT__RECIPE_CONFIGS, inputRecipe, selectWrapperRecipe };
