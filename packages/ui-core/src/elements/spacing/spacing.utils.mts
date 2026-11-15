// NOTE: CSS is imported directly (not via `./spacing.constants.mjs`): a side-effect-free JS module
// whose exports are unused gets dropped by bundlers together with its CSS imports.
import '../../styles/foundation.scss';
import { cnx } from '../../utils/index.mjs';
import type { ResponsiveStyle } from '../../utils/responsive.mjs';
import {
  RESPONSIVE_BASE_BREAKPOINT,
  isResponsiveObject,
  responsiveVarClassName,
  responsiveVarName,
} from '../../utils/responsive.mjs';
import './spacing.scss';
import type { SpacingSize, SpacingStyleProps } from './spacing.types.mjs';

type SpacingPropName = 'spcType' | 'spcScale' | 'spcSize' | 'spcSizes';
type SpacingPropsInput = Partial<SpacingStyleProps> & Record<string, any>;

const BASE_CLASS = 'ms-spacing';

// One spacing type (`ph`, `mt`, …): a plain size is a class; in a per-breakpoint map the `base`
// size is that class too, every other breakpoint adds `ms-spacing--ph@md` + its CSS variable
function pushSpacingSize(
  type: string,
  scale: string,
  size: SpacingSize | null | undefined,
  classNames: string[],
  style: ResponsiveStyle,
) {
  if (size == null) return;

  if (!isResponsiveObject(size)) {
    classNames.push(`${BASE_CLASS}--${type}-${scale}-${size}`);
    return;
  }

  for (const breakpoint in size) {
    const breakpointSize = (size as Record<string, string | null | undefined>)[
      breakpoint
    ];
    if (breakpointSize == null) continue;

    if (breakpoint === RESPONSIVE_BASE_BREAKPOINT) {
      classNames.push(`${BASE_CLASS}--${type}-${scale}-${breakpointSize}`);
    } else {
      classNames.push(responsiveVarClassName(BASE_CLASS, type, breakpoint));
      style[responsiveVarName(BASE_CLASS, type, breakpoint)] =
        `var(--ms-spacing-scale-${scale}-${breakpointSize})`;
    }
  }
}

/**
 * Maps spacing props to token-based utility classes and strips them from the rest props.
 * Nothing is emitted unless both `spcType` and `spcScale` are set.
 * Sizes may be per-breakpoint maps: {style} then holds the CSS variables to set inline.
 *
 * @example
 * extractSpacingClassNamesFromProps({ spcType: 'p', spcScale: 'element', spcSizes: { v: 'sm', h: 'xl' } })
 * // → [['ms-spacing--pv-element-sm', 'ms-spacing--ph-element-xl'], {}, {}]
 * extractSpacingClassNamesFromProps({ spcType: 'pv', spcScale: 'section', spcSize: { base: 'xs', md: 'lg' } })
 * // → [['ms-spacing--pv-section-xs', 'ms-spacing--pv@md'], {},
 * //    { '--ms-spacing-pv-at-md': 'var(--ms-spacing-scale-section-lg)' }]
 */
function extractSpacingClassNamesFromProps<TProps extends SpacingPropsInput>(
  props: TProps,
): [string[], Omit<TProps, SpacingPropName>, ResponsiveStyle] {
  const { spcType, spcScale, spcSize, spcSizes, ...restProps } = props;
  const classNames: string[] = [];
  const style: ResponsiveStyle = {};

  if (spcType && spcScale) {
    if (spcSizes && (spcType === 'm' || spcType === 'p')) {
      // `v` / `h` map to the block / inline axis classes (`mv`, `ph`, ...)
      pushSpacingSize(`${spcType}v`, spcScale, spcSizes.v, classNames, style);
      pushSpacingSize(`${spcType}h`, spcScale, spcSizes.h, classNames, style);
    } else {
      // NOTE: the `base` default applies only without a size; a map sets every breakpoint itself
      pushSpacingSize(spcType, spcScale, spcSize ?? 'base', classNames, style);
    }
  }

  return [classNames, restProps, style];
}

/**
 * @example spacingRecipe({ spcType: 'mt', spcScale: 'block', spcSize: 'lg' })
 * // → { className: 'ms-spacing--mt-block-lg', style: {} }
 * spacingRecipe({ spcType: 'pv', spcScale: 'section', spcSize: { base: 'xs', md: 'lg' } })
 * // → { className: 'ms-spacing--pv-section-xs ms-spacing--pv@md',
 * //     style: { '--ms-spacing-pv-at-md': 'var(--ms-spacing-scale-section-lg)' } }
 */
function spacingRecipe(props: SpacingPropsInput = {}): {
  className: string;
  style: ResponsiveStyle;
} {
  const [classNames, , style] = extractSpacingClassNamesFromProps(props);

  return { className: cnx(classNames), style };
}

export { extractSpacingClassNamesFromProps, spacingRecipe };
