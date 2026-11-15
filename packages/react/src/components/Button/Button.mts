import type { ButtonStyleProps, ElementPlainSize } from '@mainset/ui-core';
import { BUTTON__RECIPE_CONFIGS } from '@mainset/ui-core';
import type React from 'react';

import type { ButtonBasicProps } from '../../elements/ButtonBasic/index.mjs';
import { renderButton } from '../../elements/ButtonBasic/render-button.mjs';
import type { SurfaceProps } from '../../elements/Surface/index.mjs';

type AllowedAs = 'button' | 'div' | 'a';
type ButtonElementType = AllowedAs | React.JSXElementConstructor<any>;

// NOTE: {SurfaceProps} takes the same {C}: the bare default (`'div'`) would intersect `as` into `never`
type ButtonProps<C extends ButtonElementType = 'button'> = SurfaceProps<C> &
  // NOTE: {btnIsDisabled} comes from {ButtonBasicProps}
  Omit<ButtonStyleProps, 'btnIsDisabled'> &
  ButtonBasicProps<C> & {
    btnIsPending?: boolean;
    btnSize?: ElementPlainSize;
  };

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
