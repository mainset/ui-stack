// NOTE: CSS is imported directly (not via `./spacing.constants.mjs`): a side-effect-free JS module
// whose exports are unused gets dropped by bundlers together with its CSS imports.
import '../../styles/foundation.scss';
import { cnx } from '../../utils/index.mjs';
import type { ResponsiveStyle } from '../../utils/responsive.mjs';
import {
  RESPONSIVE_BASE_BREAKPOINT,
  isDeclaredOption,
  isResponsiveObject,
  responsiveVarClassName,
  responsiveVarName,
  warnDroppedResponsiveStyle,
} from '../../utils/responsive.mjs';
import { SPACING__CLASS_NAME_CONFIG } from './spacing.constants.mjs';
import './spacing.scss';
import type { SpacingSize, SpacingStyleProps } from './spacing.types.mjs';

type SpacingPropName = 'spcType' | 'spcScale' | 'spcSize' | 'spcSizes';
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- props are interfaces (no index signature), which `Record<string, unknown>` rejects
type SpacingPropsInput = Partial<SpacingStyleProps> & Record<string, any>;

const BASE_CLASS = 'ms-spacing';
const { spcScale: SCALE_DEFINITION, spcSize: SIZE_DEFINITION } =
  SPACING__CLASS_NAME_CONFIG.classNameDefinitionByPropName;

// One spacing type (`ph`, `mt`, …): a plain size is a class; in a per-breakpoint map the `base`
// size is that class too, every other breakpoint adds `ms-spacing--ph@md` + its CSS variable
function pushSpacingSize(
  type: string,
  scale: string,
  size: SpacingSize | null | undefined,
  classNames: string[],
  style: ResponsiveStyle,
) {
  if (size === null || size === undefined) return;

  if (!isResponsiveObject(size)) {
    classNames.push(`${BASE_CLASS}--${type}-${scale}-${size}`);
    return;
  }

  const sizeByBreakpoint = size as Record<string, string | null | undefined>;

  for (const breakpoint of Object.keys(sizeByBreakpoint)) {
    const breakpointSize = sizeByBreakpoint[breakpoint];
    if (breakpointSize === null || breakpointSize === undefined) continue;

    if (breakpoint === RESPONSIVE_BASE_BREAKPOINT) {
      classNames.push(`${BASE_CLASS}--${type}-${scale}-${breakpointSize}`);
    } else {
      // NOTE: only declared options reach the inline style (no arbitrary CSS through a prop)
      if (
        !isDeclaredOption(SCALE_DEFINITION.options, scale) ||
        !isDeclaredOption(SIZE_DEFINITION.options, breakpointSize)
      )
        continue;

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
 * Spacing props → class string, like every other `*Recipe()`.
 * For per-breakpoint sizes use {spacingStyleProps}, which also returns the inline style.
 * @example spacingRecipe({ spcType: 'mt', spcScale: 'block', spcSize: 'lg' }) // → "ms-spacing--mt-block-lg"
 */
function spacingRecipe(props: SpacingPropsInput = {}): string {
  const [classNames, , style] = extractSpacingClassNamesFromProps(props);
  warnDroppedResponsiveStyle('spacingRecipe', style);

  return cnx(classNames);
}

/**
 * Like {spacingRecipe}, plus the inline CSS variables of per-breakpoint sizes.
 * @example
 * spacingStyleProps({ spcType: 'pv', spcScale: 'section', spcSize: { base: 'xs', md: 'lg' } })
 * // → { className: 'ms-spacing--pv-section-xs ms-spacing--pv@md',
 * //     style: { '--ms-spacing-pv-at-md': 'var(--ms-spacing-scale-section-lg)' } }
 */
function spacingStyleProps(props: SpacingPropsInput = {}): {
  className: string;
  style: ResponsiveStyle;
} {
  const [classNames, , style] = extractSpacingClassNamesFromProps(props);

  return { className: cnx(classNames), style };
}

export { extractSpacingClassNamesFromProps, spacingRecipe, spacingStyleProps };
