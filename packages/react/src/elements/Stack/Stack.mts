import type {
  HoverStyleProps,
  StackPreset,
  StackRecipeProps,
} from '@mainset/ui-core';
import { STACK__PRESETS, STACK__RECIPE_CONFIGS, cnx } from '@mainset/ui-core';
import React from 'react';

import type { BlockElementType, PolymorphicProps } from '../utils/index.mjs';
import { splitStyleProps } from '../utils/index.mjs';

type StackProps<C extends BlockElementType = 'div'> = PolymorphicProps<
  'stkAs',
  C,
  StackRecipeProps & HoverStyleProps
>;

// One implementation per preset, so Stack / HStack / Cluster can't drift apart
function createStack(preset: StackPreset, displayName: string) {
  function StackComponent<C extends BlockElementType = 'div'>({
    stkAs,

    children,
    className,

    ...props
  }: StackProps<C>): React.ReactElement {
    const [classNames, restProps, style] = splitStyleProps(
      STACK__RECIPE_CONFIGS,
      { ...STACK__PRESETS[preset], ...props },
    );

    return React.createElement(
      stkAs || 'div',
      { className: cnx(className, classNames), style, ...restProps },
      children,
    );
  }

  StackComponent.displayName = displayName;

  return StackComponent;
}

/**
 * Vertical list with a gap (`layGapSize`, default `base`). Any Flex / Layout / Spacing prop
 * overrides the preset, e.g. `flxDirection={{ base: 'column', md: 'row' }}`.
 */
const Stack = createStack('stack', 'Stack');

/** A row of vertically centered items with a gap */
const HStack = createStack('hstack', 'HStack');

/** A wrapping row with a gap: tags, chips, action buttons */
const Cluster = createStack('cluster', 'Cluster');

export { Cluster, HStack, Stack };
export type { StackProps };
