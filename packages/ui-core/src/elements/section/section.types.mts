import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import { SECTION__CLASS_NAME_CONFIG } from './section.constants.mjs';

interface SectionBaseProps {
  // value-mapped
  secMaxWidth?: ExtractClassNameFromPropOptions<
    typeof SECTION__CLASS_NAME_CONFIG,
    'secMaxWidth'
  > | null;
}

export type { SectionBaseProps };
