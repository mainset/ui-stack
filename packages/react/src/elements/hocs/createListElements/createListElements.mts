import { cnx } from '@mainset/ui-core';
import React from 'react';

const Spacer = () =>
  React.createElement('div', { className: 'ms-list__spacer' });

interface CreateListElementsParams {
  baseClassName: string;
}

interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  direction?: 'horizontal' | 'vertical';
  justify?: 'center' | 'end';
  type?: 'unstyled' | 'oredered' /* 'unordered' | */;
}

const createListElements = ({ baseClassName }: CreateListElementsParams) => {
  const List: React.FC<ListProps> = ({
    children,
    className,

    direction = 'horizontal',
    justify,
    type = 'unstyled',

    ...props
  }) =>
    React.createElement(
      'ul',
      {
        className: cnx(
          className,
          baseClassName,
          `ms-list ms-list--direction-${direction}`,
          `ms-list--type-${type}`,
          {
            [`ms-list--justify-${justify}`]: justify,
          },
        ),
        ...props,
      },
      children,
    );

  return { List, Spacer };
};

export { createListElements };
