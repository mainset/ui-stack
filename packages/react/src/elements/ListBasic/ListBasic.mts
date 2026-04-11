import type { ListStyleProps } from '@mainset/ui-core';
import {
  LIST__CLASS_NAME_CONFIG,
  cnx,
  extractClassNamesFromProps,
  stylesList,
} from '@mainset/ui-core';
import React from 'react';

interface ListWrapperProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    React.ComponentPropsWithRef<React.ElementType>,
    ListStyleProps {}

const ListWrapper: React.FC<ListWrapperProps> = ({
  children,
  className,

  ...props
}) => {
  const [classNames, restProps] = extractClassNamesFromProps(
    [LIST__CLASS_NAME_CONFIG],
    props,
    stylesList,
  );

  const ListTag = React.useMemo(
    () => (props.ordered ? 'ol' : 'ul'),
    [props.ordered],
  );

  return React.createElement(
    ListTag,
    {
      className: cnx(className, classNames, stylesList['ms-list']),
      ...restProps,
    },
    children,
  );
};

interface ListItemProps extends React.HTMLAttributes<HTMLDivElement> {}

const ListSpaceBetween: React.FC<ListItemProps> = ({
  children,
  className,

  ...props
}) => {
  return React.createElement(
    'li',
    {
      className: cnx(className, stylesList['ms-list__space-between']),
      ...props,
    },
    children,
  );
};

const ListBasic = Object.assign(ListWrapper, {
  SpaceBetween: ListSpaceBetween,
});

export { ListBasic };
