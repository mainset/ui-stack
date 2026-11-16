import type {
  FlexContainerStyleProps,
  FlexItemStyleProps,
  LayoutStyleProps,
} from '@mainset/ui-core';
import {
  FLEX_CONTAINER__CLASS_NAME_CONFIG,
  FLEX_ITEM__CLASS_NAME_CONFIG,
  LAYOUT__CLASS_NAME_CONFIG,
  cnx,
  extractClassNamesFromProps,
} from '@mainset/ui-core';
import React from 'react';

import type { BlockElementType, PolymorphicProps } from '../utils/index.mjs';
import { mergeResponsiveStyle } from '../utils/index.mjs';

type FlexElementType = BlockElementType;

type FlexContainerProps<C extends FlexElementType = 'div'> = PolymorphicProps<
  'flxAs',
  C,
  FlexContainerStyleProps & LayoutStyleProps
>;

function FlexContainer<C extends FlexElementType = 'div'>({
  flxAs,

  children,
  className,
  style,

  ...props
}: FlexContainerProps<C>) {
  const [classNames, restProps, responsiveStyle] = extractClassNamesFromProps(
    [FLEX_CONTAINER__CLASS_NAME_CONFIG, LAYOUT__CLASS_NAME_CONFIG],
    props,
  );

  return React.createElement(
    flxAs || 'div',
    {
      className: cnx(className, classNames),
      style: mergeResponsiveStyle(responsiveStyle, style),
      ...restProps,
    },
    children,
  );
}

type FlexItemElementType = 'div' | 'span' | 'section' | 'article' | 'li';

type FlexItemProps<C extends FlexItemElementType = 'div'> = PolymorphicProps<
  'flxAs',
  C,
  FlexItemStyleProps
>;

function FlexItem<C extends FlexItemElementType = 'div'>({
  flxAs,

  children,
  className,

  ...props
}: FlexItemProps<C>) {
  const [classNames, restProps] = extractClassNamesFromProps(
    [FLEX_ITEM__CLASS_NAME_CONFIG],
    props,
  );

  return React.createElement(
    flxAs || 'div',
    {
      className: cnx(className, classNames),
      ...restProps,
    },
    children,
  );
}

const Flex = Object.assign(FlexContainer, {
  Item: FlexItem,
});

export { Flex };
export type {
  FlexContainerProps,
  FlexElementType,
  FlexItemElementType,
  FlexItemProps,
};
