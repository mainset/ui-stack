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
  stylesFlex,
  stylesLayout,
} from '@mainset/ui-core';
import React from 'react';

interface FlexContainerProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    React.ComponentPropsWithRef<React.ElementType>,
    FlexContainerStyleProps,
    LayoutStyleProps {}

const FlexContainer: React.FC<FlexContainerProps> = ({
  children,
  className,

  ...props
}) => {
  const [classNames, restProps] = extractClassNamesFromProps(
    [FLEX_CONTAINER__CLASS_NAME_CONFIG, LAYOUT__CLASS_NAME_CONFIG],
    props,
    Object.assign({}, stylesFlex, stylesLayout),
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

interface FlexItemProps
  extends React.HTMLAttributes<HTMLDivElement>, FlexItemStyleProps {}

const FlexItem: React.FC<FlexItemProps> = ({
  children,
  className,

  ...props
}) => {
  const [classNames, restProps] = extractClassNamesFromProps(
    [FLEX_ITEM__CLASS_NAME_CONFIG],
    props,
    stylesFlex,
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
