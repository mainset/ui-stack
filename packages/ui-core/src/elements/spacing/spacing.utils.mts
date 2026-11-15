// NOTE: CSS is imported directly (not via `./spacing.constants.mjs`): a side-effect-free JS module
// whose exports are unused gets dropped by bundlers together with its CSS imports.
import '../../styles/foundation.scss';
import { cnx } from '../../utils/index.mjs';
import './spacing.scss';
import type { SpacingStyleProps } from './spacing.types.mjs';

type SpacingPropName = 'spcType' | 'spcScale' | 'spcSize' | 'spcSizes';
type SpacingPropsInput = Partial<SpacingStyleProps> & Record<string, any>;

/**
 * Maps spacing props to token-based utility classes and strips them from the rest props.
 * Nothing is emitted unless both `spcType` and `spcScale` are set.
 *
 * @example
 * extractSpacingClassNamesFromProps({ spcType: 'p', spcScale: 'element', spcSizes: { v: 'sm', h: 'xl' } })
 * // → [['ms-spacing--pv-element-sm', 'ms-spacing--ph-element-xl'], {}]
 */
function extractSpacingClassNamesFromProps<TProps extends SpacingPropsInput>(
  props: TProps,
): [string[], Omit<TProps, SpacingPropName>] {
  const { spcType, spcScale, spcSize, spcSizes, ...restProps } = props;
  const classNames: string[] = [];

  if (spcType && spcScale) {
    if (spcSizes && (spcType === 'm' || spcType === 'p')) {
      // `v` / `h` map to the block / inline axis classes (`mv`, `ph`, ...)
      if (spcSizes.v) {
        classNames.push(`ms-spacing--${spcType}v-${spcScale}-${spcSizes.v}`);
      }
      if (spcSizes.h) {
        classNames.push(`ms-spacing--${spcType}h-${spcScale}-${spcSizes.h}`);
      }
    } else {
      classNames.push(
        `ms-spacing--${spcType}-${spcScale}-${spcSize ?? 'base'}`,
      );
    }
  }

  return [classNames, restProps];
}

/**
 * @example spacingRecipe({ spcType: 'mt', spcScale: 'block', spcSize: 'lg' }) // → "ms-spacing--mt-block-lg"
 */
function spacingRecipe(props: SpacingPropsInput = {}): string {
  return cnx(extractSpacingClassNamesFromProps(props)[0]);
}

export { extractSpacingClassNamesFromProps, spacingRecipe };
