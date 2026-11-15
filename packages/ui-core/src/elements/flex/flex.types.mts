import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import type { ResponsiveValue } from '../elements.types.mjs';
import {
  FLEX_CONTAINER__CLASS_NAME_CONFIG,
  FLEX_ITEM__CLASS_NAME_CONFIG,
} from './flex.constants.mjs';

type FlexContainerOption<
  TPropName extends
    keyof (typeof FLEX_CONTAINER__CLASS_NAME_CONFIG)['classNameDefinitionByPropName'],
> = ExtractClassNameFromPropOptions<
  typeof FLEX_CONTAINER__CLASS_NAME_CONFIG,
  TPropName
>;

interface FlexContainerStyleProps {
  // css-based (responsive)
  flxDisplay?: ResponsiveValue<FlexContainerOption<'flxDisplay'>> | null;
  flxDirection?: ResponsiveValue<FlexContainerOption<'flxDirection'>> | null;
  flxWrap?: ResponsiveValue<FlexContainerOption<'flxWrap'>> | null;
}

interface FlexItemStyleProps {
  // value-mapped
  flxGrow?: ExtractClassNameFromPropOptions<
    typeof FLEX_ITEM__CLASS_NAME_CONFIG,
    'flxGrow'
  > | null;
}

export type { FlexContainerStyleProps, FlexItemStyleProps };
