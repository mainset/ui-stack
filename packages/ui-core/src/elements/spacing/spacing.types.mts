import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import { SPACING__CLASS_NAME_CONFIG } from './spacing.constants.mjs';

type Size = ExtractClassNameFromPropOptions<
  typeof SPACING__CLASS_NAME_CONFIG,
  'spcSize'
>;

type SpacingStyleProps = {
  spcScale: ExtractClassNameFromPropOptions<
    typeof SPACING__CLASS_NAME_CONFIG,
    'spcScale'
  >;
} & (
  | {
      spcType: 'm' | 'p';
      spcSize?: Size | null;
      spcSizes?: {
        v?: Size;
        h?: Size;
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
      spcSize?: Size | null;
      spcSizes?: never;
    }
);

export type { SpacingStyleProps };
