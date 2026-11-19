import type { HoverStyleProps } from '../elements/hover/index.mjs';
import { HOVER__CLASS_NAME_CONFIG } from '../elements/hover/index.mjs';
import { cnx } from '../utils/index.mjs';

const { baseClass: HOVER } = HOVER__CLASS_NAME_CONFIG;
const HOVER_EFFECTS: readonly unknown[] =
  HOVER__CLASS_NAME_CONFIG.classNameDefinitionByPropName.hvrEffect.options;

/**
 * The hover classes of {hvrEffect} / {hvrIsGroup}, and nothing else (no base class), so it can
 * be added to any element, or to an icon's `className`.
 *
 * @example
 * hoverRecipe({ hvrIsGroup: true, hvrEffect: 'lift' }) // → "ms-hover--lift ms-hover--group"
 * <ArrowUpRight className={hoverRecipe({ hvrEffect: 'nudge-up-end' })} />
 */
function hoverRecipe({ hvrEffect, hvrIsGroup }: HoverStyleProps = {}) {
  return cnx(
    // only a declared effect becomes a class (the prop may come from untyped code)
    HOVER_EFFECTS.includes(hvrEffect) && `${HOVER}--${hvrEffect}`,
    hvrIsGroup && `${HOVER}--group`,
  );
}

/**
 * Splits the hover props off {props}: their classes, and the props left for the element.
 */
function extractHoverClassNamesFromProps<T extends HoverStyleProps>(
  props: T,
): [className: string, restProps: Omit<T, keyof HoverStyleProps>] {
  const { hvrEffect, hvrIsGroup, ...restProps } = props;

  return [hoverRecipe({ hvrEffect, hvrIsGroup }), restProps];
}

export { extractHoverClassNamesFromProps, hoverRecipe };
