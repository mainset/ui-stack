import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import { TEXT_BASE__CLASS_NAME_CONFIG } from './text-base.constants.mjs';

interface TextStyleProps {
  // value-mapped
  txtAlign?: ExtractClassNameFromPropOptions<
    typeof TEXT_BASE__CLASS_NAME_CONFIG,
    'txtAlign'
  > | null;
  txtColor?: ExtractClassNameFromPropOptions<
    typeof TEXT_BASE__CLASS_NAME_CONFIG,
    'txtColor'
  > | null;
  txtFamily?: ExtractClassNameFromPropOptions<
    typeof TEXT_BASE__CLASS_NAME_CONFIG,
    'txtFamily'
  > | null;
  txtSize?: ExtractClassNameFromPropOptions<
    typeof TEXT_BASE__CLASS_NAME_CONFIG,
    'txtSize'
  > | null;
  txtTransform?: ExtractClassNameFromPropOptions<
    typeof TEXT_BASE__CLASS_NAME_CONFIG,
    'txtTransform'
  > | null;
  txtWeight?: ExtractClassNameFromPropOptions<
    typeof TEXT_BASE__CLASS_NAME_CONFIG,
    'txtWeight'
  > | null;
  // boolean
  txtIsTruncated?: ExtractClassNameFromPropOptions<
    typeof TEXT_BASE__CLASS_NAME_CONFIG,
    'txtIsTruncated'
  > | null;
}

export type { TextStyleProps };
