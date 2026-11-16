import type { BoxRecipeProps, HoverStyleProps } from '@mainset/ui-core';
import { BOX__RECIPE_CONFIGS, cnx } from '@mainset/ui-core';
import React from 'react';

import type { BlockElementType, PolymorphicProps } from '../utils/index.mjs';
import { splitStyleProps } from '../utils/index.mjs';

type BoxProps<C extends BlockElementType = 'div'> = PolymorphicProps<
  'boxAs',
  C,
  BoxRecipeProps & HoverStyleProps
>;

/**
 * The base layout primitive: spacing (`spc*`, responsive), background (`bgColor`) and border
 * (`brd*`) utilities on any block element. Same classes as `boxStyleProps()` in ui-core.
 *
 * @example
 * <Box boxAs="section" spcType="p" spcScale="block" spcSize={{ base: 'sm', md: 'lg' }}>…</Box>
 */
function Box<C extends BlockElementType = 'div'>({
  boxAs,

  children,
  className,

  ...props
}: BoxProps<C>): React.ReactElement {
  const [classNames, restProps, style] = splitStyleProps(
    BOX__RECIPE_CONFIGS,
    props,
  );

  return React.createElement(
    boxAs || 'div',
    { className: cnx(className, classNames), style, ...restProps },
    children,
  );
}

export { Box };
export type { BoxProps };
