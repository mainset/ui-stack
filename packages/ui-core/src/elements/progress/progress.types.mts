import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import { PROGRESS__CLASS_NAME_CONFIG } from './progress.constants.mjs';

interface ProgressStyleProps {
  // boolean
  /** The amount of work is unknown: a bar runs across */
  prgIsIndeterminate?: ExtractClassNameFromPropOptions<
    typeof PROGRESS__CLASS_NAME_CONFIG,
    'prgIsIndeterminate'
  > | null;
  // value-mapped
  prgSize?: ExtractClassNameFromPropOptions<
    typeof PROGRESS__CLASS_NAME_CONFIG,
    'prgSize'
  > | null;
}

export type { ProgressStyleProps };
