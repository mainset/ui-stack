import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import { PAGINATION__CLASS_NAME_CONFIG } from './pagination.constants.mjs';

interface PaginationStyleProps {
  // value-mapped
  pgnSize?: ExtractClassNameFromPropOptions<
    typeof PAGINATION__CLASS_NAME_CONFIG,
    'pgnSize'
  > | null;
}

/** A page number, or a gap of hidden pages */
type PaginationRangeItem = number | 'ellipsis';

export type { PaginationRangeItem, PaginationStyleProps };
