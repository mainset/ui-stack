import {
  POPPER_WRAPPER__CLASS_NAME_CONFIG,
  PopperWrapperStyleProps,
  cnx,
  extractClassNamesFromProps,
} from '@mainset/ui-core';
import React from 'react';

import { FloatingBox } from '../FloatingBox/FloatingBox.mjs';
import type { FloatingBoxWrapperProps } from '../FloatingBox/FloatingBox.mts';

// Wrapper
interface PopperWrapperProps
  extends FloatingBoxWrapperProps, PopperWrapperStyleProps {}

const PopperWrapper: React.FC<PopperWrapperProps> = ({
  children,
  className,

  ...props
}) => {
  const [classNames, restProps] = extractClassNamesFromProps(
    [POPPER_WRAPPER__CLASS_NAME_CONFIG],
    props,
  );

  // NOTE: derived on every render, so switching between controlled/uncontrolled isn't frozen at mount
  const isVisibleOnHover = typeof props.popIsOpen !== 'boolean';

  return React.createElement(
    FloatingBox,
    {
      className: cnx(className, classNames, {
        'ms-popper--visible-on-hover': isVisibleOnHover,
      }),
      ...restProps,
    },
    children,
  );
};

// Content
type PopperContentProps = React.HTMLAttributes<HTMLDivElement>;

const PopperContent: React.FC<PopperContentProps> = ({
  children,
  className,

  ...props
}) => {
  return React.createElement(
    FloatingBox.Content,
    {
      className: cnx(className, 'ms-popper__content'),
      ...props,
    },
    children,
  );
};

/**
 * CSS-only popper: the content shows while the wrapper is hovered or has focus inside
 * (`popIsOpen` controls it instead). No script, so it works server-rendered too; for a
 * click-opened panel with focus handling and collision-aware positioning, use the `Popover`
 * container.
 */
const Popper = Object.assign(PopperWrapper, {
  Content: PopperContent,
});

export { Popper };
