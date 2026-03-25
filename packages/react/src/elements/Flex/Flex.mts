import type {
  FlexContainerBaseProps,
  FlexItemBaseProps,
} from '@mainset/ui-core';
import {
  FLEX_CONTAINER__CLASS_NAME_CONFIG,
  cnx,
  extractClassNamesFromProps,
  stylesFlex,
} from '@mainset/ui-core';
import React from 'react';

interface FlexContainerProps
  extends React.HTMLAttributes<HTMLDivElement>, FlexContainerBaseProps {}

const FlexContainer: React.FC<FlexContainerProps> = ({
  children,
  className,

  ...props
}) => {
  const [classNames, restProps] = extractClassNamesFromProps(
    [FLEX_CONTAINER__CLASS_NAME_CONFIG],
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

interface FlexItemProps
  extends React.HTMLAttributes<HTMLDivElement>, FlexItemBaseProps {}

const FlexItem: React.FC<FlexItemProps> = ({
  children,
  className,

  ...props
}) => {
  return React.createElement(
    'div',
    {
      className: cnx(className, stylesFlex['ms-flex__item']),
      ...props,
    },
    children,
  );
};

const Flex = Object.assign(FlexContainer, {
  Item: FlexItem,
});

export { Flex };
