import { cnx } from '@mainset/ui-core';
import React from 'react';

function createClassNamedRC<TTag extends React.ElementType>(
  Tag: TTag,
  defaultClassName: string,
  extraProps?: Partial<React.ComponentPropsWithRef<TTag>>,
) {
  const ExtendedComponent = ({
    className,
    children,
    ...props
  }: React.ComponentPropsWithRef<TTag>) =>
    React.createElement(
      Tag,
      {
        className: cnx(className, defaultClassName),
        ...extraProps,
        ...props,
      },
      children,
    );

  // Set displayName so React DevTools shows "Segment" instead of "Anonymous"
  // ExtendedComponent.displayName = `extended(${typeof Tag === 'string' ? Tag : 'Component'})`;

  // We cast it back to the exact component type to preserve strict HTML typings
  return ExtendedComponent as unknown as React.ForwardRefExoticComponent<
    React.ComponentPropsWithRef<TTag>
  >;
}

export { createClassNamedRC };
