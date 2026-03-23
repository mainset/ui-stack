import {
  POPPER_WRAPPER__CLASS_NAME_CONFIG,
  PopperWrapperBaseProps,
  cnx,
  extractClassNamesFromProps,
  stylesPopper,
} from '@mainset/ui-core';
import React from 'react';

import { FloatingBox } from '../FloatingBox/FloatingBox.mjs';
import type { FloatingBoxWrapperProps } from '../FloatingBox/FloatingBox.mts';

// Wrapper
interface PopoverWrapperProps
  extends FloatingBoxWrapperProps, PopperWrapperBaseProps {}

const PopoverWrapper: React.FC<PopoverWrapperProps> = ({
  children,
  className,

  ...props
}) => {
  const [classNames, restProps] = extractClassNamesFromProps(
    [POPPER_WRAPPER__CLASS_NAME_CONFIG],
    props,
    stylesPopper,
  );

  const isVisibleOnHover = React.useMemo(
    () => typeof props.popIsOpened !== 'boolean',
    [],
  );

  return React.createElement(
    FloatingBox,
    {
      className: cnx(className, classNames, {
        [stylesPopper['ms-popper--visible-on-hover']]: isVisibleOnHover,
      }),
      ...restProps,
    },
    children,
  );
};

// Content
interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const PopoverContent: React.FC<PopoverContentProps> = ({
  children,
  className,

  ...props
}) => {
  return React.createElement(
    FloatingBox.Content,
    {
      className: cnx(className, stylesPopper['ms-popper__content']),
      ...props,
    },
    children,
  );
};

const Popover = Object.assign(PopoverWrapper, {
  Content: PopoverContent,
});

export { Popover };
