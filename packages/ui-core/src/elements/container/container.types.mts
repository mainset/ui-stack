import type { ExtractClassNameFromPropOptions } from '../../utils/index.mjs';
import { CONTAINER__CLASS_NAME_CONFIG } from './container.constants.mjs';

interface ContainerStyleProps {
  // value-mapped
  ctnSize?: ExtractClassNameFromPropOptions<
    typeof CONTAINER__CLASS_NAME_CONFIG,
    'ctnSize'
  > | null;
  // boolean
  ctnIsGutterless?: boolean | null;
}

export type { ContainerStyleProps };
