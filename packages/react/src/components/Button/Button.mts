import type { ButtonStyleProps } from '@mainset/ui-core';
import {
  SPACING__STYLE_CONFIG,
  TEXT_BASE__CLASS_NAME_CONFIG,
  cnx,
  extractClassNamesFromProps,
  extractStyleObjFromProps,
  stylesSpacingInlineStyleBased,
  stylesTextBase,
} from '@mainset/ui-core';
import React from 'react';

import type { ButtonBasicProps } from '../../elements/ButtonBasic/index.mjs';
import type { SurfaceProps } from '../../elements/Surface/index.mjs';
import { ButtonBasic } from '../../elements/index.mjs';

type AllowedAs = 'button' | 'div' | 'a';
type ButtonElementType = AllowedAs | React.JSXElementConstructor<any>;

type ButtonProps<C extends ButtonElementType = 'button'> = SurfaceProps &
  // NOTE: the {btnIsDisabled} is supported in lower level of {ButtonBasic}
  Omit<ButtonStyleProps, 'btnIsDisabled'> &
  ButtonBasicProps<C> & {
    btnIsPending?: boolean;
    btnSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  };

// TODO: introduce {--ms-padding-button-xs} CSS variable
const PROPS__BY_BUTTON_SIZE = {
  xs: {
    txtSize: 'x-small',
    spcType: 'ph',
    spcScale: 'element',
    spcSize: 'sm',
  },
  sm: {
    txtSize: 'small',
    spcType: 'ph',
    spcScale: 'element',
    spcSize: 'base',
  },
  base: {
    txtSize: 'small',
    spcType: 'p',
    spcScale: 'element',
    spcSizes: { v: 'sm', h: 'xl' },
  },
  lg: {
    txtSize: 'large',
    spcType: 'p',
    spcScale: 'element',
    spcSizes: { v: 'sm', h: 'xl' },
  },
  xl: {
    txtSize: 'x-large',
    spcType: 'p',
    spcScale: 'component',
    spcSizes: { v: 'xs', h: 'base' },
    // spcSizes: { v: 'sm', h: 'xl' },
  },
};

const Button = <C extends ButtonElementType = 'button'>({
  btnSize = 'base',
  btnIsPending,
  btnIsDisabled,

  className,
  children,
  ...props
}: ButtonProps<C>) => {
  const [classNames] = extractClassNamesFromProps(
    [TEXT_BASE__CLASS_NAME_CONFIG],
    PROPS__BY_BUTTON_SIZE[btnSize],
    stylesTextBase,
  );
  const [styleObj] = extractStyleObjFromProps(
    [SPACING__STYLE_CONFIG],
    PROPS__BY_BUTTON_SIZE[btnSize],
  );

  const isDisabled = React.useMemo(
    () => btnIsPending || btnIsDisabled,
    [btnIsPending, btnIsDisabled],
  );

  return React.createElement(
    ButtonBasic,
    {
      className: cnx(
        className,
        classNames,
        stylesSpacingInlineStyleBased['ms-spacing'],
      ),

      btnIsDisabled: isDisabled,

      style: styleObj,
      ...props,
    },
    children,
  );
};

export { Button };
export type { ButtonProps };
