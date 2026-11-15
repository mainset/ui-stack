import { cnx, extractClassNamesFromProps, toneRecipe } from '@mainset/ui-core';
import React from 'react';

type ClassNameConfigs = Parameters<typeof extractClassNamesFromProps>[0];

type ButtonRenderProps = Record<string, unknown> & {
  as?: React.ElementType;
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
  { as, srfTheme, className, children, ...props }: ButtonRenderProps,
) {
  const Component = as || 'button';
  const [classNames, restProps] = extractClassNamesFromProps(configs, props);

  const elementProps: Record<string, unknown> = {
    className: cnx(className, classNames, toneRecipe(srfTheme)),
    ...tagProps(Component, props.btnIsDisabled),
    ...restProps,
  };

  // NOTE: after the spread, so an explicit `type={undefined}` can't turn it into a submit button
  if (Component === 'button' && !elementProps.type)
    elementProps.type = 'button';

  return React.createElement(Component, elementProps, children);
}

export { renderButton };
