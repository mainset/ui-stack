import type { ListStyleProps } from '@mainset/ui-core';
import {
  LIST__CLASS_NAME_CONFIG,
  cnx,
  extractClassNamesFromProps,
} from '@mainset/ui-core';
import React from 'react';

interface ListWrapperProps
  extends React.ComponentPropsWithRef<'ul'>, ListStyleProps {}

const ListWrapper: React.FC<ListWrapperProps> = ({
  children,
  className,

  ...props
}) => {
  const [classNames, restProps] = extractClassNamesFromProps(
    [LIST__CLASS_NAME_CONFIG],
    props,
  );

  // NOTE: the semantic tag follows {lstStyle}, so `ordered` lists are real <ol> for assistive tech
  const ListTag = props.lstStyle === 'ordered' ? 'ol' : 'ul';

  return React.createElement(
    ListTag,
    {
      className: cnx(className, classNames),
      ...restProps,
    },
    children,
  );
};

type ListItemProps = React.ComponentPropsWithRef<'li'>;

const ListSpaceBetween: React.FC<ListItemProps> = ({
  children,
  className,

  ...props
}) => {
  return React.createElement(
    'li',
    {
      className: cnx(className, 'ms-list__space-between'),
      ...props,
    },
    children,
  );
};

const ListBasic = Object.assign(ListWrapper, {
  SpaceBetween: ListSpaceBetween,
});

export { ListBasic };
