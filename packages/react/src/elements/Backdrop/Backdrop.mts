import type { BackdropStyleProps, SurfaceStyleProps } from '@mainset/ui-core';
import {
  BACKDROP__CLASS_NAME_CONFIG,
  SURFACE__CLASS_NAME_CONFIG,
  cnx,
  extractClassNamesFromProps,
  stylesBackdrop,
  stylesSurface,
} from '@mainset/ui-core';
import React from 'react';

interface BackdropProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    BackdropStyleProps,
    SurfaceStyleProps {
  /**
   * Determines z-index dynamically based on stack position if needed
   */
  bckZIndex?: number;
  /**
   * Optional click handler for backdrop interactions (e.g., closing modals on click)
   */
  bckOnClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const Backdrop: React.FC<BackdropProps> = ({
  bckZIndex,
  bckOnClick,

  children,
  className,

  ...props
}) => {
  const [classNames, restProps] = extractClassNamesFromProps(
    [BACKDROP__CLASS_NAME_CONFIG, SURFACE__CLASS_NAME_CONFIG],
    props,
    Object.assign({}, stylesBackdrop, stylesSurface),
  );

  return React.createElement(
    'div',
    {
      className: cnx(className, classNames),

      style: { zIndex: bckZIndex },
      'aria-hidden': 'true',

      onClick: bckOnClick,

      ...restProps,
    },
    children,
  );
};

export { Backdrop };
