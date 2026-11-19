import type {
  HoverStyleProps,
  LinkStyleProps,
  TextStyleProps,
} from '@mainset/ui-core';
import {
  LINK__CLASS_NAME_CONFIG,
  TEXT_BASE__CLASS_NAME_CONFIG,
  cnx,
} from '@mainset/ui-core';
import React from 'react';

import type { AnyComponent, PolymorphicProps } from '../utils/index.mjs';
import { splitStyleProps } from '../utils/index.mjs';

type LinkElementType = 'a' | AnyComponent;

type LinkProps<C extends LinkElementType = 'a'> = PolymorphicProps<
  'lnkAs',
  C,
  LinkStyleProps & TextStyleProps & HoverStyleProps
>;

/**
 * A text link in the current tone's text color. `lnkAs={RouterLink}` keeps the router's
 * navigation and props; `lnkUnderline` is `always` (default, for links in running text),
 * `hover` or `none`; `txt*` props adjust the text.
 *
 * @example <Link lnkAs={RouterLink} to="/pricing" lnkUnderline="hover">Pricing</Link>
 */
function Link<C extends LinkElementType = 'a'>({
  lnkAs,

  children,
  className,

  ...props
}: LinkProps<C>): React.ReactElement {
  const [classNames, restProps, style] = splitStyleProps(
    [LINK__CLASS_NAME_CONFIG, TEXT_BASE__CLASS_NAME_CONFIG],
    props,
  );

  return React.createElement(
    lnkAs || 'a',
    { className: cnx(className, classNames), style, ...restProps },
    children,
  );
}

export { Link };
export type { LinkProps };
