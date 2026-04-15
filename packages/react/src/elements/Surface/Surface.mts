import type {
  BackgroundStyleProps,
  BorderStyleProps,
  SurfaceStyleProps,
} from '@mainset/ui-core';
import {
  BACKGROUND__CLASS_NAME_CONFIG,
  BORDER__CLASS_NAME_CONFIG,
  SURFACE__CLASS_NAME_CONFIG,
  cnx,
  extractClassNamesFromProps,
  stylesBackground,
  stylesBorder,
  stylesSurface,
} from '@mainset/ui-core';
import React from 'react';

type AllowedAs =
  | 'div'
  | 'span'
  // | 'article'
  // | 'main'
  | 'section'
  // | 'aside'
  // | 'header'
  // | 'footer'
  // | 'li'
  // | 'ul'
  // | 'ol'
  | 'a'
  | 'button';

type SurfaceElementType = AllowedAs | React.JSXElementConstructor<any>;

// 1. Extend from all composed utility traits so they autocomplete and can be overridden
type SurfaceOwnProps<C extends SurfaceElementType> = SurfaceStyleProps &
  BackgroundStyleProps &
  BorderStyleProps & {
    as?: C;
  };

// 2. Safely merge with dynamic component props (e.g. `href` if as="a")
type SurfaceProps<C extends SurfaceElementType = 'div'> = SurfaceOwnProps<C> &
  Omit<React.ComponentPropsWithoutRef<C>, keyof SurfaceOwnProps<C>>;

const Surface = <C extends SurfaceElementType = 'div'>({
  as,

  srfTheme,
  srfVariant,

  children,
  className,

  ...props
}: SurfaceProps<C>) => {
  const Component = as || 'div';

  const classNameProps = React.useMemo(() => {
    const baseProps: BackgroundStyleProps & BorderStyleProps = Object.assign({
      brdRadius: 'sm',
    });

    if (srfVariant === 'solid') {
      baseProps['bgColor'] = srfTheme;
      baseProps['brdColor'] = srfTheme; // Solid surfaces often need a matching border to prevent layout shifts!
    }

    if (srfVariant === 'outlined') {
      baseProps['bgColor'] = srfTheme;
      baseProps['brdColor'] = srfTheme;
      baseProps['brdStyle'] = 'solid';
      baseProps['brdWidth'] = 'base';
    }

    if (srfVariant === 'ghost') {
      baseProps['bgColor'] = srfTheme;
      baseProps['brdColor'] = 'transparent';
    }

    return baseProps;
  }, [srfTheme, srfVariant]);

  const [classNames, restProps] = extractClassNamesFromProps(
    [
      BACKGROUND__CLASS_NAME_CONFIG,
      BORDER__CLASS_NAME_CONFIG,
      SURFACE__CLASS_NAME_CONFIG,
    ],
    // The latter arguments override the former:
    // This allows a user to pass `brdRadius="pill"` to override the `sm` default!
    Object.assign({ srfVariant }, classNameProps, props),
    Object.assign({}, stylesBackground, stylesBorder, stylesSurface),
  );

  return React.createElement(
    Component,
    {
      className: cnx(className, classNames, stylesSurface['ms-surface']),
      ...restProps,
    },
    children,
  );
};

export { Surface };
export type { SurfaceProps };
