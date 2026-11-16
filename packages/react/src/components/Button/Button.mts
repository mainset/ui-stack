import type {
  BackgroundStyleProps,
  BorderStyleProps,
  ButtonStyleProps,
  ElementPlainSize,
  SurfaceStyleProps,
} from '@mainset/ui-core';
import { BUTTON__RECIPE_CONFIGS } from '@mainset/ui-core';

import type { ButtonElementType } from '../../elements/ButtonBasic/index.mjs';
import { renderButton } from '../../elements/ButtonBasic/render-button.mjs';
import type { PolymorphicProps } from '../../elements/utils/index.mjs';

type ButtonOwnProps = SurfaceStyleProps &
  BackgroundStyleProps &
  BorderStyleProps &
  ButtonStyleProps & {
    btnIsPending?: boolean;
    btnSize?: ElementPlainSize;
  };

// `btnAs="a"` / `btnAs={Link}` keeps the button look on a link
type ButtonProps<C extends ButtonElementType = 'button'> = PolymorphicProps<
  'btnAs',
  C,
  ButtonOwnProps
>;

/**
 * Button = Surface (tone × variant) + Control (size) + button behaviour, as one element:
 * a single class-name pass over `BUTTON__RECIPE_CONFIGS` (the same classes as `buttonRecipe()`
 * from `@mainset/ui-core`, so it can be rendered without React too).
 */
function Button<C extends ButtonElementType = 'button'>({
  btnSize = 'base',
  btnIsPending,
  btnIsDisabled,
  srfHover = 'all',

  ...props
}: ButtonProps<C>) {
  return renderButton(BUTTON__RECIPE_CONFIGS, {
    'aria-busy': btnIsPending || undefined,
    ...props,
    srfHover,
    ctlSize: btnSize,
    btnIsDisabled: btnIsPending || btnIsDisabled,
  });
}

export { Button };
export type { ButtonProps };
