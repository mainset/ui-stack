import type {
  BREAKPOINT__ELEMENT_OPTIONS,
  COLOR__ELEMENT_OPTIONS,
  SIZE_EXTENDED__ELEMENT_OPTIONS,
  SIZE_PLAIN__ELEMENT_OPTIONS,
} from './elements.constants.mjs';

type ElementColor = (typeof COLOR__ELEMENT_OPTIONS)[number];
type ElementPlainSize = (typeof SIZE_PLAIN__ELEMENT_OPTIONS)[number];
type ElementExtendedSize = (typeof SIZE_EXTENDED__ELEMENT_OPTIONS)[number];

type ElementBreakpoint = (typeof BREAKPOINT__ELEMENT_OPTIONS)[number];

/**
 * A value, or a mobile-first map of values per breakpoint.
 * @example flxDirection={{ base: 'column', md: 'row' }} // column, row from 768px
 */
type ResponsiveValue<T> = T | Partial<Record<ElementBreakpoint, T>>;

export type {
  ElementBreakpoint,
  ElementColor,
  ElementExtendedSize,
  ElementPlainSize,
  ResponsiveValue,
};
