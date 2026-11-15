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

import { mergeResponsiveStyle } from '../utils/index.mjs';

interface FlexContainerProps
  extends
    React.ComponentPropsWithRef<'div'>,
    FlexContainerStyleProps,
    LayoutStyleProps {}

const FlexContainer: React.FC<FlexContainerProps> = ({
  children,
  className,
  style,

  ...props
}) => {
  const [classNames, restProps, responsiveStyle] = extractClassNamesFromProps(
    [FLEX_CONTAINER__CLASS_NAME_CONFIG, LAYOUT__CLASS_NAME_CONFIG],
    props,
  );

  return React.createElement(
    'div',
    {
      className: cnx(className, classNames),
      style: mergeResponsiveStyle(responsiveStyle, style),
      ...restProps,
    },
    children,
  );
};

interface FlexItemProps
  extends React.ComponentPropsWithRef<'div'>, FlexItemStyleProps {}

const FlexItem: React.FC<FlexItemProps> = ({
  children,
  className,

  ...props
}) => {
  const [classNames, restProps] = extractClassNamesFromProps(
    [FLEX_ITEM__CLASS_NAME_CONFIG],
    props,
  );

  return React.createElement(
    'div',
    {
      className: cnx(className, classNames),
      ...restProps,
    },
    children,
  );
};

const Flex = Object.assign(FlexContainer, {
  Item: FlexItem,
});

export { Flex };
