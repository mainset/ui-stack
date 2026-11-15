import type {
  BackgroundStyleProps,
  BorderStyleProps,
  SurfaceStyleProps,
} from '@mainset/ui-core';
import {
  SURFACE__RECIPE_CONFIGS,
  cnx,
  extractClassNamesFromProps,
  toneRecipe,
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
  | 'footer'
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

/**
 * Tone × variant container. All the visual logic lives in ui-core CSS:
 * `srfTheme` sets the tone (`.ms-tone-*`), `srfVariant` picks how the tone is painted.
 * `bg*` / `brd*` props are utilities and always win over the variant.
 */
const Surface = <C extends SurfaceElementType = 'div'>({
  as,

  srfTheme,

  children,
  className,

  ...props
}: SurfaceProps<C>) => {
  const Component = as || 'div';

  const [classNames, restProps] = extractClassNamesFromProps(
    SURFACE__RECIPE_CONFIGS,
    props,
  );

  return React.createElement(
    Component,
    {
      className: cnx(className, classNames, toneRecipe(srfTheme)),
      ...restProps,
    },
    children,
  );
};

export { Surface };
export type { SurfaceProps };
