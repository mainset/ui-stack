import type { ButtonStyleProps } from '@mainset/ui-core';
import {
  BUTTON__CLASS_NAME_CONFIG,
  SURFACE__RECIPE_CONFIGS,
} from '@mainset/ui-core';
import type React from 'react';

import { renderButton } from './render-button.mjs';

type AllowedAs = 'button' | 'div' | 'a';
type ButtonElementType = AllowedAs | React.JSXElementConstructor<any>;

// 1. Better Types: Separate our own props from the element's props
type ButtonBasicOwnProps<C extends ButtonElementType> = Pick<
  ButtonStyleProps,
  'btnIsDisabled'
> & {
  as?: C;
};

// 2. Omit our own keys from the inherited props to prevent collision
type ButtonBasicProps<C extends ButtonElementType = 'button'> =
  ButtonBasicOwnProps<C> &
    Omit<React.ComponentPropsWithoutRef<C>, keyof ButtonBasicOwnProps<C>>;

// Surface (tone × variant) + button behaviour, without the control sizing
const BUTTON_BASIC__CONFIGS = [
  ...SURFACE__RECIPE_CONFIGS,
  BUTTON__CLASS_NAME_CONFIG,
];

/**
 * Unsized button: surface styling + button behaviour (native `disabled` / `type` on a `button`,
 * ARIA-simulated on other tags). Renders the element directly, no wrapper components.
 */
function ButtonBasic<C extends ButtonElementType = 'button'>(
  props: ButtonBasicProps<C>,
) {
  return renderButton(BUTTON_BASIC__CONFIGS, props);
}

export { ButtonBasic };
export type { ButtonBasicProps };
