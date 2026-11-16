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

type ListItemWithIconProps = ListItemProps & {
  /** A leading icon (decorative: give it `aria-hidden`), set on the first line of the text */
  lstIcon?: React.ReactNode;
};

/**
 * An item with a leading icon: a check mark, a feature icon. The icon stays on the first line
 * and takes the tone; the text wraps beside it. Works in any list (`ListBasic`, `Stack stkAs="ul"`).
 *
 * @example
 * <Stack stkAs="ul" layGapSize="sm">
 *   <ListBasic.Item lstIcon={<Check aria-hidden />}>Works offline</ListBasic.Item>
 * </Stack>
 */
const ListItem: React.FC<ListItemWithIconProps> = ({
  lstIcon,

  children,
  className,

  ...props
}) => {
  const hasIcon =
    lstIcon !== undefined && lstIcon !== null && lstIcon !== false;

  return React.createElement(
    'li',
    {
      className: cnx(className, hasIcon && 'ms-list__item') || undefined,
      ...props,
    },
    hasIcon &&
      React.createElement('span', { className: 'ms-list__item-icon' }, lstIcon),
    hasIcon ? React.createElement('span', null, children) : children,
  );
};

const ListBasic = Object.assign(ListWrapper, {
  Item: ListItem,
  SpaceBetween: ListSpaceBetween,
});

export { ListBasic };
