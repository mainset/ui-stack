import type { ButtonStyleProps } from '@mainset/ui-core';
import {
  BUTTON__CLASS_NAME_CONFIG,
  SURFACE__RECIPE_CONFIGS,
} from '@mainset/ui-core';

import type { AnyComponent, PolymorphicProps } from '../utils/index.mjs';
import { renderButton } from './render-button.mjs';

// `btnAs={Link}` renders a router link styled as a button
type ButtonElementType = 'button' | 'a' | 'div' | AnyComponent;

type ButtonBasicOwnProps = Pick<ButtonStyleProps, 'btnIsDisabled'>;

type ButtonBasicProps<C extends ButtonElementType = 'button'> =
  PolymorphicProps<'btnAs', C, ButtonBasicOwnProps>;

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
export type { ButtonBasicProps, ButtonElementType };
