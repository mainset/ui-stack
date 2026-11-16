import { cnx } from '@mainset/ui-core';
import React from 'react';

import type { PolymorphicProps } from '../utils/index.mjs';

type VisuallyHiddenElementType =
  | 'span'
  | 'div'
  | 'p'
  | 'label'
  | 'a'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6';

type VisuallyHiddenProps<C extends VisuallyHiddenElementType = 'span'> =
  PolymorphicProps<
    'vhAs',
    C,
    {
      /** Shown while it (or something inside) has focus, e.g. a "Skip to content" link */
      vhIsFocusable?: boolean;
    }
  >;

/**
 * Hidden on screen, still read by assistive tech (`ms-visually-hidden`).
 *
 * @example <VisuallyHidden vhAs="a" href="#main" vhIsFocusable>Skip to content</VisuallyHidden>
 */
function VisuallyHidden<C extends VisuallyHiddenElementType = 'span'>({
  vhAs,
  vhIsFocusable,

  children,
  className,

  ...props
}: VisuallyHiddenProps<C>): React.ReactElement {
  return React.createElement(
    vhAs || 'span',
    {
      className: cnx(
        className,
        vhIsFocusable ? 'ms-visually-hidden-focusable' : 'ms-visually-hidden',
      ),
      ...props,
    },
    children,
  );
}

export { VisuallyHidden };
export type { VisuallyHiddenProps };
