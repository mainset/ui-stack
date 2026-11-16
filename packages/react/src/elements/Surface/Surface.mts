import type {
  BackgroundStyleProps,
  BorderStyleProps,
  HoverStyleProps,
  SurfaceStyleProps,
} from '@mainset/ui-core';
import {
  SURFACE__RECIPE_CONFIGS,
  cnx,
  extractClassNamesFromProps,
  extractHoverClassNamesFromProps,
  toneRecipe,
} from '@mainset/ui-core';
import React from 'react';

import type { AnyComponent, PolymorphicProps } from '../utils/index.mjs';

type SurfaceElementType =
  | 'div'
  | 'span'
  | 'section'
  | 'article'
  | 'aside'
  | 'header'
  | 'footer'
  | 'li'
  | 'a'
  | 'button'
  | AnyComponent;

// Every composed utility trait, so they autocomplete and can be overridden
type SurfaceOwnProps = SurfaceStyleProps &
  BackgroundStyleProps &
  BorderStyleProps &
  HoverStyleProps;

// `srfAs="a"` adds `href`, `srfAs={Link}` adds the link's props
type SurfaceProps<C extends SurfaceElementType = 'div'> = PolymorphicProps<
  'srfAs',
  C,
  SurfaceOwnProps
>;

/**
 * Tone × variant container. All the visual logic lives in ui-core CSS:
 * `srfTheme` sets the tone (`.ms-tone-*`), `srfVariant` picks how the tone is painted.
 * `bg*` / `brd*` props are utilities and always win over the variant.
 */
function Surface<C extends SurfaceElementType = 'div'>({
  srfAs,

  srfTheme,

  children,
  className,

  ...props
}: SurfaceProps<C>) {
  const Component: React.ElementType = srfAs || 'div';

  const [hoverClassName, withoutHoverProps] =
    extractHoverClassNamesFromProps(props);
  const [classNames, restProps] = extractClassNamesFromProps(
    SURFACE__RECIPE_CONFIGS,
    withoutHoverProps,
  );

  return React.createElement(
    Component,
    {
      className: cnx(
        className,
        classNames,
        toneRecipe(srfTheme),
        hoverClassName,
      ),
      ...restProps,
    },
    children,
  );
}

export { Surface };
export type { SurfaceElementType, SurfaceProps };
