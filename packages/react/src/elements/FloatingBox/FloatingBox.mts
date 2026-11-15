import type { FloatingBoxWrapperStyleProps } from '@mainset/ui-core';
import {
  FLOATING_BOX__WRAPPER__CLASS_NAME_CONFIG,
  cnx,
  extractClassNamesFromProps,
} from '@mainset/ui-core';
import React from 'react';

interface FloatingBoxWrapperProps
  extends React.HTMLAttributes<HTMLDivElement>, FloatingBoxWrapperStyleProps {}

const FloatingBoxWrapper: React.FC<FloatingBoxWrapperProps> = ({
  children,
  className,

  ...props
}) => {
  const [classNames, restProps] = extractClassNamesFromProps(
    [FLOATING_BOX__WRAPPER__CLASS_NAME_CONFIG],
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

interface FloatingBoxContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const FloatingBoxContent: React.FC<FloatingBoxContentProps> = ({
  children,
  className,

  ...props
}) => {
  return React.createElement(
    'div',
    {
      className: 'ms-floating-box__content-positioner',
    },
    React.createElement(
      'div',
      {
        className: cnx(className, 'ms-floating-box__content'),
        ...props,
      },
      children,
    ),
  );
};

const FloatingBox = Object.assign(FloatingBoxWrapper, {
  Content: FloatingBoxContent,
});

export { FloatingBox };
export type { FloatingBoxWrapperProps };
