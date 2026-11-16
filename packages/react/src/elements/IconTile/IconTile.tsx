import type { ElementColor, IconTileStyleProps } from '@mainset/ui-core';
import {
  ICON_TILE__CLASS_NAME_CONFIG,
  cnx,
  toneRecipe,
} from '@mainset/ui-core';
import React from 'react';

import { splitStyleProps } from '../utils/index.mjs';

type IconTileProps = React.ComponentPropsWithRef<'span'> &
  IconTileStyleProps & {
    /** The tone it's painted with (default: the inherited one, `primary`) */
    ictTheme?: ElementColor | null;
  };

/**
 * An icon on a small tile, beside a feature's title or a list row. Decorative (`aria-hidden`):
 * the text next to it says what it means. `ictVariant`: `outlined` (default, a neutral tile with
 * a toned icon), `soft` or `solid`; `ictShape`: `square` or `circle`.
 *
 * @example <IconTile><WifiOff /></IconTile>
 */
function IconTile({
  ictTheme,

  className,
  children,
  ...props
}: IconTileProps) {
  const [classNames, restProps, style] = splitStyleProps(
    [ICON_TILE__CLASS_NAME_CONFIG],
    props,
  );

  return (
    <span
      aria-hidden="true"
      className={cnx(className, classNames, toneRecipe(ictTheme))}
      style={style}
      {...restProps}
    >
      {children}
    </span>
  );
}

export { IconTile };
export type { IconTileProps };
