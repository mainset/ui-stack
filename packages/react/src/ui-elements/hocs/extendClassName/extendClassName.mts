import React from 'react';

const extendClassName =
  (
    WrappedComponent: React.FC<React.HTMLAttributes<HTMLElement>>,
    extendedClassName: HTMLElement['className'],
  ) =>
  ({
    children,
    className,

    ...props
  }: React.HTMLAttributes<HTMLElement>) =>
    React.createElement(
      WrappedComponent,
      {
        className: `${className ? `${className} ` : ''}${extendedClassName}`,
        ...props,
      },
      children,
    );

export { extendClassName };
