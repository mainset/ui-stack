import type { ButtonStyleProps } from '@mainset/ui-core';
import {
  BUTTON__CLASS_NAME_CONFIG,
  cnx,
  extractClassNamesFromProps,
  stylesButton,
} from '@mainset/ui-core';
import React from 'react';

type AllowedAs = 'button' | 'div' | 'a';
type ButtonElementType = AllowedAs | React.JSXElementConstructor<any>;

// 1. Better Types: Separate our own props from the element's props
type ButtonBasicOwnProps<C extends ButtonElementType> = Pick<
  ButtonStyleProps,
  'btnIsDisabled'
> & {
  as?: C;

  btnTheme: Extract<ButtonStyleProps['btnTheme'], 'transparent'>;
};

// 2. Omit our own keys from the inherited props to prevent collision
type ButtonBasicProps<C extends ButtonElementType = 'button'> =
  ButtonBasicOwnProps<C> &
    Omit<React.ComponentPropsWithoutRef<C>, keyof ButtonBasicOwnProps<C>>;

const ButtonBasic = <C extends ButtonElementType = 'button'>({
  as,

  children,
  className,

  ...props
}: ButtonBasicProps<C>) => {
  const Component = as || 'button';
  const { btnIsDisabled } = props;

  const [classNames, restProps] = extractClassNamesFromProps(
    [BUTTON__CLASS_NAME_CONFIG],
    props,
    stylesButton,
  );

  // 4. Combine tag-specific defaults and disabled states safely
  const elementProps = React.useMemo(() => {
    const simulatedDisabledProps = btnIsDisabled
      ? { 'aria-disabled': true, tabIndex: -1 }
      : {};

    switch (Component) {
      case 'button':
        return {
          type: restProps.type || 'button',
          disabled: btnIsDisabled,
        } satisfies React.ButtonHTMLAttributes<HTMLButtonElement>;

      case 'div':
        return {
          role: 'button',
          ...simulatedDisabledProps,
        } satisfies React.HTMLAttributes<HTMLDivElement>;

      case 'a':
        return simulatedDisabledProps satisfies React.AnchorHTMLAttributes<HTMLAnchorElement>;

      default:
        // Covers any custom React Components (like NavLink)
        return simulatedDisabledProps;
    }
  }, [Component, btnIsDisabled, restProps.type]);

  return React.createElement(
    Component,
    {
      className: cnx(className, classNames, stylesButton['ms-button']),
      ...elementProps,
      ...restProps,
    },
    children,
  );
};

export { ButtonBasic };
export type { ButtonBasicProps };
