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

interface SurfaceProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    SurfaceStyleProps,
    Pick<BorderStyleProps, 'brdStyle'> {
  as?: React.ElementType;
}

const Surface: React.FC<SurfaceProps> = ({
  as = 'div',

  srfTheme,
  srfVariant,

  children,
  className,

  ...props
}) => {
  const classNameProps = React.useMemo(() => {
    const baseProps: BackgroundStyleProps & BorderStyleProps = Object.assign({
      brdRadius: 'sm',
    });

    if (srfVariant === 'solid') {
      baseProps['bgColor'] = srfTheme;
      baseProps['brdColor'] = srfTheme; // Solid surfaces often need a matching border to prevent layout shifts!
    }

    if (srfVariant === 'outlined') {
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
    Object.assign({ srfVariant }, classNameProps, props),
    Object.assign({}, stylesBackground, stylesBorder, stylesSurface),
  );

  return React.createElement(
    as,
    {
      className: cnx(className, classNames),
      ...restProps,
    },
    children,
  );
};

export { Surface };
export type { SurfaceProps };
