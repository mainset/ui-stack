import { cnx } from '@mainset/ui-core';
import type {
  ComponentPropsWithRef,
  ElementType,
  ForwardRefExoticComponent,
} from 'react';
import React from 'react';

function createClassNamedRC<TTag extends ElementType>(
  Tag: TTag,
  defaultClassName: string,
) {
  const ExtendedComponent = React.forwardRef<any, ComponentPropsWithRef<TTag>>(
    ({ className, children, ...props }, ref) =>
      React.createElement(
        Tag,
        {
          ref,
          className: cnx(defaultClassName, className),
          ...props,
        },
        children,
      ),
  );

  // Set displayName so React DevTools shows "Segment" instead of "Anonymous"
  // ExtendedComponent.displayName = `extended(${typeof Tag === 'string' ? Tag : 'Component'})`;

  // We cast it back to the exact component type to preserve strict HTML typings
  return ExtendedComponent as unknown as ForwardRefExoticComponent<
    ComponentPropsWithRef<TTag>
  >;
}

export { createClassNamedRC };
