import type { HoverStyleProps } from '@mainset/ui-core';
import {
  BUTTON__CLASS_NAME_CONFIG,
  cnx,
  extractClassNamesFromProps,
  extractHoverClassNamesFromProps,
  toneRecipe,
} from '@mainset/ui-core';
import React from 'react';

type ClassNameConfigs = Parameters<typeof extractClassNamesFromProps>[0];

const { baseClass: BUTTON } = BUTTON__CLASS_NAME_CONFIG;

/** Icon slots of a button, before / after its label; they follow the text direction */
interface ButtonIconProps {
  /** An icon before the label (decorative: give it `aria-hidden`) */
  btnIconStart?: React.ReactNode;
  /** An icon after the label, e.g. an arrow; with `hvrIsGroup`, `hvrEffect` on it nudges it */
  btnIconEnd?: React.ReactNode;
}

type ButtonRenderProps = Record<string, unknown> &
  ButtonIconProps &
  HoverStyleProps & {
    btnAs?: React.ElementType;
    btnIsDisabled?: boolean | null;
    srfTheme?: Parameters<typeof toneRecipe>[0];
    className?: string;
    children?: React.ReactNode;
  };

// Tag-specific defaults: a native button gets `type` / `disabled`, others simulate them via ARIA
function tagProps(
  Component: React.ElementType,
  isDisabled: boolean | null | undefined,
): Record<string, unknown> {
  const simulatedDisabledProps = isDisabled
    ? { 'aria-disabled': true, tabIndex: -1 }
    : null;

  switch (Component) {
    case 'button':
      return { disabled: isDisabled };

    case 'div':
      return { role: 'button', ...simulatedDisabledProps };

    // `a` and custom components (like NavLink)
    default:
      return { ...simulatedDisabledProps };
  }
}

/**
 * Shared by {ButtonBasic} and {Button}: one class-name pass over all of the button's configs
 * (surface + optional control + button) and a single host element — no wrapper components.
 */
function renderButton(
  configs: ClassNameConfigs,
  {
    btnAs,
    btnIconStart,
    btnIconEnd,
    srfTheme,
    className,
    children,
    ...props
  }: ButtonRenderProps,
) {
  const Component = btnAs || 'button';
  const [hoverClassName, withoutHoverProps] =
    extractHoverClassNamesFromProps(props);
  const [classNames, restProps] = extractClassNamesFromProps(
    configs,
    withoutHoverProps,
  );

  const elementProps: Record<string, unknown> = {
    className: cnx(className, classNames, toneRecipe(srfTheme), hoverClassName),
    ...tagProps(Component, props.btnIsDisabled),
    ...restProps,
  };

  // NOTE: after the spread, so an explicit `type={undefined}` can't turn it into a submit button
  if (Component === 'button' && !elementProps.type)
    elementProps.type = 'button';

  const iconSlot = (icon: React.ReactNode) =>
    icon === undefined || icon === null || icon === false
      ? null
      : React.createElement('span', { className: `${BUTTON}__icon` }, icon);

  return React.createElement(
    Component,
    elementProps,
    iconSlot(btnIconStart),
    children,
    iconSlot(btnIconEnd),
  );
}

export { renderButton };
export type { ButtonIconProps };
