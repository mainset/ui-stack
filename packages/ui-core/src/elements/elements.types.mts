import type {
  COLOR__ELEMENT_OPTIONS,
  SIZE_EXTENDED__ELEMENT_OPTIONS,
  SIZE_PLAIN__ELEMENT_OPTIONS,
} from './elements.constants.mjs';

type ElementColor = (typeof COLOR__ELEMENT_OPTIONS)[number];
type ElementPlainSize = (typeof SIZE_PLAIN__ELEMENT_OPTIONS)[number];
type ElementExtendedSize = (typeof SIZE_EXTENDED__ELEMENT_OPTIONS)[number];

export type { ElementColor, ElementExtendedSize, ElementPlainSize };
