import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import type { ElementPlainSize, ResponsiveValue } from '../elements.types.mjs';
import { SPACING__CLASS_NAME_CONFIG } from './spacing.constants.mjs';

/**
 * A size, or a mobile-first map of sizes per breakpoint (the scale stays the same).
 * @example spcSize={{ base: 'xs', md: 'lg' }}
 */
type SpacingSize = ResponsiveValue<ElementPlainSize>;

type SpacingStyleProps = {
  spcScale: ExtractClassNameFromPropOptions<
    typeof SPACING__CLASS_NAME_CONFIG,
    'spcScale'
  >;
} & (
  | {
      spcType: 'm' | 'p';
      spcSize?: SpacingSize | null;
      spcSizes?: {
        v?: SpacingSize;
        h?: SpacingSize;
      } | null;
    }
  | {
      spcType:
        | 'mt'
        | 'mb'
        | 'ms'
        | 'me'
        | 'mv'
        | 'mh'
        | 'pt'
        | 'pb'
        | 'ps'
        | 'pe'
        | 'pv'
        | 'ph';
      spcSize?: SpacingSize | null;
      spcSizes?: never;
    }
);

export type { SpacingSize, SpacingStyleProps };
