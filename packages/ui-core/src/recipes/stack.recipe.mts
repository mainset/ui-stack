import type {
  FlexContainerStyleProps,
  LayoutStyleProps,
  SpacingStyleProps,
} from '../elements/index.mjs';
import {
  FLEX_CONTAINER__CLASS_NAME_CONFIG,
  LAYOUT__CLASS_NAME_CONFIG,
  spacingStyleProps,
} from '../elements/index.mjs';
import type { ResponsiveStyle } from '../utils/index.mjs';
import { cnx, composeStyleProps } from '../utils/index.mjs';

type StackRecipeProps = FlexContainerStyleProps &
  LayoutStyleProps &
  Partial<SpacingStyleProps>;

/**
 * Flex presets; any prop overrides its preset value.
 * `stack` vertical list, `hstack` a row of centered items, `cluster` a wrapping row (tags, actions).
 */
const STACK__PRESETS = {
  stack: { flxDirection: 'column', layGapSize: 'base' },
  hstack: { flxDirection: 'row', layAlign: 'center', layGapSize: 'base' },
  cluster: {
    flxDirection: 'row',
    flxWrap: 'wrap',
    layAlign: 'center',
    layGapSize: 'base',
  },
} as const satisfies Record<string, StackRecipeProps>;

type StackPreset = keyof typeof STACK__PRESETS;

const STACK__RECIPE_CONFIGS = [
  FLEX_CONTAINER__CLASS_NAME_CONFIG,
  LAYOUT__CLASS_NAME_CONFIG,
];

/**
 * Stack props → `{ className, style }`, starting from a {preset}.
 *
 * @example
 * stackStyleProps({ flxDirection: { base: 'column', md: 'row' } }) // a stack that turns into a row
 * stackStyleProps({ layGapSize: 'sm' }, 'cluster')
 */
function stackStyleProps(
  props: StackRecipeProps = {},
  preset: StackPreset = 'stack',
): { className: string; style: ResponsiveStyle } {
  const layout = composeStyleProps(STACK__RECIPE_CONFIGS, {
    ...STACK__PRESETS[preset],
    ...props,
  });
  const spacing = spacingStyleProps(props);

  return {
    className: cnx(layout.className, spacing.className),
    style: { ...layout.style, ...spacing.style },
  };
}

export { STACK__PRESETS, STACK__RECIPE_CONFIGS, stackStyleProps };
export type { StackPreset, StackRecipeProps };
