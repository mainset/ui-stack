import type { ButtonStyleProps, ElementPlainSize } from '@mainset/ui-core';
import { cnx, controlRecipe } from '@mainset/ui-core';
import React from 'react';

import type { ButtonBasicProps } from '../../elements/ButtonBasic/index.mjs';
import type { SurfaceProps } from '../../elements/Surface/index.mjs';
import { ButtonBasic } from '../../elements/index.mjs';

type AllowedAs = 'button' | 'div' | 'a';
type ButtonElementType = AllowedAs | React.JSXElementConstructor<any>;

// NOTE: {SurfaceProps} takes the same {C}: the bare default (`'div'`) would intersect `as` into `never`
type ButtonProps<C extends ButtonElementType = 'button'> = SurfaceProps<C> &
  // NOTE: the {btnIsDisabled} is supported in lower level of {ButtonBasic}
  Omit<ButtonStyleProps, 'btnIsDisabled'> &
  ButtonBasicProps<C> & {
    btnIsPending?: boolean;
    btnSize?: ElementPlainSize;
  };

/**
 * Button = ButtonBasic (behaviour) + Surface (tone × variant) + Control (size).
 * Sizes are pure CSS (`--ms-control-*` tokens), so the same button can be
 * rendered without React via `buttonRecipe()` from `@mainset/ui-core`.
 */
function Button<C extends ButtonElementType = 'button'>({
  btnSize = 'base',
  btnIsPending,
  btnIsDisabled,

  className,
  children,
  ...props
}: ButtonProps<C>) {
  const isDisabled = btnIsPending || btnIsDisabled;

  return React.createElement(
    ButtonBasic,
    {
      // styling
      className: cnx(className, controlRecipe({ ctlSize: btnSize })),

      // btn specific
      srfHover: 'all',
      btnIsDisabled: isDisabled,
      'aria-busy': btnIsPending || undefined,

      // rest
      ...props,
    },
    children,
  );
}

export { Button };
export type { ButtonProps };
