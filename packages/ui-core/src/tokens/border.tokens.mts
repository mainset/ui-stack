const BORDER_RADIUS__TOKENS = {
  pill: '624.9375rem', // 9999px (Capsule shaped buttons, badges)
  circle: '50%', // Perfect circles for avatars
  xxs: '0.125rem', // 2px (Subtle rounding for small elements)
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px (Moderate rounding for small elements)
  base: '0.75rem', // 12px (Standard rounding for medium elements)
  lg: '1rem', // 16px
  xl: '1.25rem', // 20px
  xxl: '1.5rem', // 24px
} as const;

const BORDER_WIDTH__TOKENS = {
  xs: '0.015rem', // ~0.25px (Ultra-hairline for high-DPR displays)
  sm: '0.031rem', // ~0.5px (Hairline for retina displays)
  base: '0.063rem', // 1px (Standard border)
  lg: '0.125rem', // 2px (Thick border)
  xl: '0.25rem', // 4px (Extra thick border)
} as const;

export { BORDER_RADIUS__TOKENS, BORDER_WIDTH__TOKENS };
