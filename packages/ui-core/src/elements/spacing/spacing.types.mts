import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import type { ElementPlainSize } from '../elements.types.mjs';
import { SPACING__CLASS_NAME_CONFIG } from './spacing.constants.mjs';

type SpacingStyleProps = {
  spcScale: ExtractClassNameFromPropOptions<
    typeof SPACING__CLASS_NAME_CONFIG,
    'spcScale'
  >;
} & (
  | {
      spcType: 'm' | 'p';
      spcSize?: ElementPlainSize | null;
      spcSizes?: {
        v?: ElementPlainSize;
        h?: ElementPlainSize;
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
      spcSize?: ElementPlainSize | null;
      spcSizes?: never;
    }
);

export type { SpacingStyleProps };
