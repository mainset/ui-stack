/**
 * Spacing tokens — one 4px-grid primitive scale; everything else aliases into it.
 *
 * Tier 1: {SPACE__TOKENS}           `--ms-space-{key}`, key × 4px (Tailwind convention: `4` → 16px)
 * Tier 2: {SPACING_SCALE__TOKENS}   `--ms-spacing-scale-{scale}-{size}` (element / component / block / section)
 *         {LAYOUT_GAP__TOKENS}      `--ms-space-layout-{column|row}-{size}`
 */

const SPACE_UNIT_REM = 0.25; // 4px

// NOTE: half steps use `_` (`0_5` → 2px), since `.` isn't valid in a custom property name
const SPACE__KEYS = [
  '0',
  '0_5',
  '1',
  '1_5',
  '2',
  '2_5',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '10',
  '12',
  '14',
  '16',
  '18',
  '20',
  '24',
  '28',
  '32',
] as const;
type SpaceKey = (typeof SPACE__KEYS)[number];

// NOTE: `reduce` instead of `Object.fromEntries`, which the type-only build `lib` doesn't include
const SPACE__TOKENS = SPACE__KEYS.reduce(
  (tokens, key) => {
    tokens[key] = `${Number(key.replace('_', '.')) * SPACE_UNIT_REM}rem`;
    return tokens;
  },
  {} as Record<SpaceKey, string>,
);

const SPACING_SCALE__OPTIONS = [
  'element',
  'component',
  'block',
  'section',
] as const;
const SPACING_SIZE__OPTIONS = ['xs', 'sm', 'base', 'lg', 'xl'] as const;
type SpacingScale = (typeof SPACING_SCALE__OPTIONS)[number];
type SpacingSize = (typeof SPACING_SIZE__OPTIONS)[number];

const SPACING_SCALE__TOKENS = {
  element: { xs: '0_5', sm: '1', base: '1_5', lg: '2', xl: '2_5' }, // 2 4 6 8 10
  component: { xs: '3', sm: '4', base: '5', lg: '6', xl: '7' }, // 12 16 20 24 28
  block: { xs: '8', sm: '10', base: '12', lg: '14', xl: '16' }, // 32 40 48 56 64
  section: { xs: '18', sm: '20', base: '24', lg: '28', xl: '32' }, // 72 80 96 112 128
} as const satisfies Record<SpacingScale, Record<SpacingSize, SpaceKey>>;

const LAYOUT_GAP__TOKENS = {
  xs: '2', // 8
  sm: '4', // 16
  base: '6', // 24
  lg: '8', // 32
  xl: '12', // 48
} as const satisfies Record<SpacingSize, SpaceKey>;

export {
  LAYOUT_GAP__TOKENS,
  SPACE__KEYS,
  SPACE__TOKENS,
  SPACING_SCALE__OPTIONS,
  SPACING_SCALE__TOKENS,
  SPACING_SIZE__OPTIONS,
};
export type { SpaceKey, SpacingScale, SpacingSize };
