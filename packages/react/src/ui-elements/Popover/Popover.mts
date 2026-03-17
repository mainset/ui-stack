import { cnx } from '@mainset/ui-core';
import React from 'react';

// Container
interface PopoverContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  setVisibleOnHover?: boolean;
}

const PopoverContainer: React.FC<PopoverContainerProps> = ({
  children,
  className,

  setVisibleOnHover,

  ...props
}) =>
  React.createElement(
    'div',
    {
      className: cnx(className, 'ms-popover__container', {
        'ms-popover__container--visible-on-hover': setVisibleOnHover,
      }),
      ...props,
    },
    children,
  );

// Placeholder
interface PopoverPlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
  hAlign?: 'left' | 'center' | 'right';
  vAlign?: 'top' | 'middle' | 'bottom';
  isVisible?: boolean;
  position?: 'absolute' | 'static';
  setWidthInherit?: boolean;
}

const PopoverPlaceholder: React.FC<PopoverPlaceholderProps> = ({
  children,
  className,

  hAlign,
  vAlign,
  isVisible,
  position = 'absolute',
  setWidthInherit,

  ...props
}) =>
  React.createElement(
    'div',
    {
      className: cnx(
        className,
        'ms-popover__placeholder',
        `ms-popover__placeholder--position-${position}`,
        {
          'ms-popover__placeholder--visible': isVisible,
          [`ms-popover__placeholder--horizontally-${hAlign}`]: hAlign,
          [`ms-popover__placeholder--vertically-${vAlign}`]: vAlign,
          'ms-popover__placeholder--width-inherit': setWidthInherit,
        },
      ),
      ...props,
    },
    children,
  );

const Popover = {
  Container: PopoverContainer,
  Placeholder: PopoverPlaceholder,
};

export { Popover };
