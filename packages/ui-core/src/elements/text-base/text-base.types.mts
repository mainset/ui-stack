import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import type { ElementColor, ResponsiveValue } from '../elements.types.mjs';
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
  txtColorHover?: ElementColor | null;
  txtFamily?: ExtractClassNameFromPropOptions<
    typeof TEXT_BASE__CLASS_NAME_CONFIG,
    'txtFamily'
  > | null;
  txtLeading?: ExtractClassNameFromPropOptions<
    typeof TEXT_BASE__CLASS_NAME_CONFIG,
    'txtLeading'
  > | null;
  // responsive, e.g. `{ base: 'base', md: 'lg' }`
  txtSize?: ResponsiveValue<
    ExtractClassNameFromPropOptions<
      typeof TEXT_BASE__CLASS_NAME_CONFIG,
      'txtSize'
    >
  > | null;
  txtTransform?: ExtractClassNameFromPropOptions<
    typeof TEXT_BASE__CLASS_NAME_CONFIG,
    'txtTransform'
  > | null;
  txtWeight?: ExtractClassNameFromPropOptions<
    typeof TEXT_BASE__CLASS_NAME_CONFIG,
    'txtWeight'
  > | null;
  txtVariant?: ExtractClassNameFromPropOptions<
    typeof TEXT_BASE__CLASS_NAME_CONFIG,
    'txtVariant'
  > | null;
  txtWrap?: ExtractClassNameFromPropOptions<
    typeof TEXT_BASE__CLASS_NAME_CONFIG,
    'txtWrap'
  > | null;
  // boolean
  txtIsTruncated?: ExtractClassNameFromPropOptions<
    typeof TEXT_BASE__CLASS_NAME_CONFIG,
    'txtIsTruncated'
  > | null;
}

export type { TextStyleProps };
