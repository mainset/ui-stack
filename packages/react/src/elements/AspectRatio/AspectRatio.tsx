import type { AspectRatioStyleProps, BorderStyleProps } from '@mainset/ui-core';
import {
  ASPECT_RATIO__CLASS_NAME_CONFIG,
  BORDER__CLASS_NAME_CONFIG,
  cnx,
} from '@mainset/ui-core';
import React from 'react';

import { splitStyleProps } from '../utils/index.mjs';

type AspectRatioProps = React.ComponentPropsWithRef<'div'> &
  AspectRatioStyleProps &
  BorderStyleProps;

/**
 * A box of a fixed ratio (`aspRatio`, default `16-9`) that its single media child fills:
 * cropped (`aspFit="cover"`, default) or letterboxed (`contain`). The space is kept before the
 * image loads, so the page doesn't shift; round it with `brdRadius`.
 *
 * @example
 * <AspectRatio aspRatio="16-10" brdRadius="lg">
 *   <img src={shot} alt="The search results" />
 * </AspectRatio>
 */
function AspectRatio({ className, children, ...props }: AspectRatioProps) {
  const [classNames, restProps, style] = splitStyleProps(
    [ASPECT_RATIO__CLASS_NAME_CONFIG, BORDER__CLASS_NAME_CONFIG],
    props,
  );

  return (
    <div className={cnx(className, classNames)} style={style} {...restProps}>
      {children}
    </div>
  );
}

export { AspectRatio };
export type { AspectRatioProps };
