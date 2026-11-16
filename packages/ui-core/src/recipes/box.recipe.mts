import type { BackgroundStyleProps } from '../elements/background/index.mjs';
import { BACKGROUND__CLASS_NAME_CONFIG } from '../elements/background/index.mjs';
import type { BorderStyleProps } from '../elements/border/index.mjs';
import { BORDER__CLASS_NAME_CONFIG } from '../elements/border/index.mjs';
import type { SpacingStyleProps } from '../elements/spacing/index.mjs';
import { spacingStyleProps } from '../elements/spacing/index.mjs';
import type { ResponsiveStyle } from '../utils/index.mjs';
import { cnx, composeStyleProps } from '../utils/index.mjs';

/** Box = spacing + background + border utilities; no styles of its own */
type BoxRecipeProps = BackgroundStyleProps &
  BorderStyleProps &
  Partial<SpacingStyleProps>;

const BOX__RECIPE_CONFIGS = [
  BACKGROUND__CLASS_NAME_CONFIG,
  BORDER__CLASS_NAME_CONFIG,
];

/**
 * Box props → `{ className, style }` (`style` holds responsive spacing variables).
 *
 * @example
 * boxStyleProps({ spcType: 'p', spcScale: 'block', spcSize: { base: 'sm', md: 'lg' }, bgColor: 'muted' })
 * // → { className: 'ms-background ms-background--color-muted ms-border ms-spacing--p-block-sm ms-spacing--p@md',
 * //     style: { '--ms-spacing-p-at-md': 'var(--ms-spacing-scale-block-lg)' } }
 */
function boxStyleProps(props: BoxRecipeProps = {}): {
  className: string;
  style: ResponsiveStyle;
} {
  const utilities = composeStyleProps(BOX__RECIPE_CONFIGS, props);
  const spacing = spacingStyleProps(props);

  return {
    className: cnx(utilities.className, spacing.className),
    style: { ...utilities.style, ...spacing.style },
  };
}

export { BOX__RECIPE_CONFIGS, boxStyleProps };
export type { BoxRecipeProps };
