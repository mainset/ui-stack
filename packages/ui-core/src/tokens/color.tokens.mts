/**
 * Color tokens — the single source for `styles/_generated.scss` and the TS color options.
 *
 * Tier 1: {PALETTE__TOKENS} literal colors (never used by elements directly)
 * Tier 2: {TONE__TOKENS} / {SCHEME__TOKENS} semantic intent per color scheme
 */

const PALETTE__TOKENS = {
  white: 'rgb(255 255 255)',
  black: 'rgb(0 0 0)',
  // brand
  'violet-400': 'rgb(181 89 255)',
  'violet-600': 'rgb(139 20 253)', // #8b14fd: the mainset brand purple
  'violet-800': 'rgb(92 11 186)',
  // feedback
  'red-600': 'rgb(215 34 38)',
  'blue-600': 'rgb(37 99 235)',
  'green-600': 'rgb(22 163 74)',
  'yellow-500': 'rgb(234 179 8)',
  // neutrals
  'gray-50': 'rgb(249 250 251)',
  'gray-100': 'rgb(243 244 246)',
  'gray-200': 'rgb(229 231 235)',
  'gray-300': 'rgb(209 213 219)',
  'gray-400': 'rgb(156 163 175)',
  'gray-450': 'rgb(138 145 158)', // dark-scheme `text-subtle`: AA on gray-950 / -900 / -800
  'gray-500': 'rgb(107 114 128)',
  'gray-600': 'rgb(75 85 99)',
  'gray-700': 'rgb(55 65 81)',
  'gray-800': 'rgb(31 41 55)',
  'gray-900': 'rgb(17 24 39)',
  'gray-950': 'rgb(3 7 18)',
} as const;

type PaletteColor = keyof typeof PALETTE__TOKENS;

const COLOR_SCHEME__OPTIONS = ['light', 'dark'] as const;
type ColorScheme = (typeof COLOR_SCHEME__OPTIONS)[number];

const TONE__OPTIONS = [
  // semantic
  'primary',
  'secondary',
  'tertiary',
  // contextual
  'error',
  'info',
  'success',
  'warning',
  // neutral
  'base',
  'muted',
  'inverse',
] as const;
type Tone = (typeof TONE__OPTIONS)[number];

/**
 * Only `solid` + `on-solid` are required; `subtle`, `hover`, `border`, `text` are derived in `oklab`
 * by `deriveToneRoles()` (src/theme), at build time (codegen) and at runtime (`createTheme()`),
 * unless declared explicitly (e.g. neutrals keep text = solid).
 */
type ToneDefinition = {
  solid: PaletteColor;
  'on-solid': PaletteColor;
  text?: PaletteColor;
  border?: PaletteColor;
};

const TONE__TOKENS = {
  primary: {
    light: { solid: 'violet-600', 'on-solid': 'gray-50' },
    dark: { solid: 'violet-600', 'on-solid': 'gray-50' },
  },
  secondary: {
    light: { solid: 'violet-800', 'on-solid': 'gray-50' },
    dark: { solid: 'violet-800', 'on-solid': 'gray-50' },
  },
  tertiary: {
    light: { solid: 'violet-400', 'on-solid': 'gray-50' },
    dark: { solid: 'violet-400', 'on-solid': 'gray-950' },
  },
  error: {
    light: { solid: 'red-600', 'on-solid': 'gray-50' },
    dark: { solid: 'red-600', 'on-solid': 'gray-50' },
  },
  info: {
    light: { solid: 'blue-600', 'on-solid': 'gray-50' },
    dark: { solid: 'blue-600', 'on-solid': 'gray-50' },
  },
  success: {
    light: { solid: 'green-600', 'on-solid': 'gray-50' },
    dark: { solid: 'green-600', 'on-solid': 'gray-50' },
  },
  // NOTE: yellow is too light for light text (WCAG contrast), so it pairs with dark text
  warning: {
    light: { solid: 'yellow-500', 'on-solid': 'gray-900' },
    dark: { solid: 'yellow-500', 'on-solid': 'gray-900' },
  },
  // neutrals: text / border stay equal to `solid` (no tinting toward white / black)
  base: {
    light: {
      solid: 'gray-800',
      'on-solid': 'gray-50',
      text: 'gray-800',
      border: 'gray-800',
    },
    dark: {
      solid: 'gray-100',
      'on-solid': 'gray-900',
      text: 'gray-100',
      border: 'gray-100',
    },
  },
  muted: {
    light: {
      solid: 'gray-600',
      'on-solid': 'gray-50',
      text: 'gray-600',
      border: 'gray-600',
    },
    dark: {
      solid: 'gray-400',
      'on-solid': 'gray-950',
      text: 'gray-400',
      border: 'gray-400',
    },
  },
  inverse: {
    light: {
      solid: 'gray-50',
      'on-solid': 'gray-800',
      text: 'gray-50',
      border: 'gray-50',
    },
    dark: {
      solid: 'gray-900',
      'on-solid': 'gray-50',
      text: 'gray-900',
      border: 'gray-900',
    },
  },
} as const satisfies Record<Tone, Record<ColorScheme, ToneDefinition>>;

/** Neutral semantic tokens that are not tone-shaped (page, text, borders, focus) */
const SCHEME__TOKENS = {
  light: {
    'bg-canvas': 'white',
    'bg-surface': 'white',
    'bg-subtle': 'gray-50',
    'text-base': 'gray-800',
    'text-muted': 'gray-600',
    'text-subtle': 'gray-500',
    'text-disabled': 'gray-400',
    'text-inverse': 'gray-50',
    'border-subtle': 'gray-200',
    'border-default': 'gray-300',
    'border-strong': 'gray-500',
    'focus-ring': 'violet-600',
  },
  dark: {
    'bg-canvas': 'gray-950',
    'bg-surface': 'gray-900',
    'bg-subtle': 'gray-800',
    'text-base': 'gray-100',
    'text-muted': 'gray-400',
    'text-subtle': 'gray-450',
    'text-disabled': 'gray-600',
    'text-inverse': 'gray-900',
    'border-subtle': 'gray-800',
    'border-default': 'gray-700',
    'border-strong': 'gray-500',
    'focus-ring': 'violet-400',
  },
} as const satisfies Record<ColorScheme, Record<string, PaletteColor>>;

/** The 7 roles every tone provides as `--ms-color-{tone}-{role}` (and `--ms-tone-{role}`) */
const TONE_ROLE__OPTIONS = [
  'solid',
  'solid-hover',
  'on-solid',
  'subtle',
  'subtle-hover',
  'border',
  'text',
] as const;
type ToneRole = (typeof TONE_ROLE__OPTIONS)[number];

type ToneDerivation = {
  /** `solid-hover` = `hoverAmount` of `solid` mixed with `hoverTarget` */
  hoverTarget: PaletteColor;
  hoverAmount: number;
  /** `subtle` / `subtle-hover` = this amount of `solid` mixed with the page canvas */
  subtleAmount: number;
  subtleHoverAmount: number;
  /** amount of `solid` mixed with white; `null` keeps the role equal to `solid` */
  textAmount: number | null;
  borderAmount: number | null;
  /** `transparent` tone: a hint of the text color on hover */
  transparentHoverAlpha: number;
  shadowColor: string;
};

/**
 * How derived tone roles are mixed (in `oklab`), per color scheme. Amounts are 0..1 of `solid`.
 * Shared by the build (codegen) and the runtime (`createTheme()`), so both always agree.
 */
const TONE_DERIVATION__TOKENS = {
  light: {
    hoverTarget: 'black',
    hoverAmount: 0.85,
    subtleAmount: 0.12,
    subtleHoverAmount: 0.2,
    textAmount: null,
    borderAmount: null,
    transparentHoverAlpha: 0.1,
    shadowColor: 'rgb(3 7 18 / 10%)',
  },
  dark: {
    hoverTarget: 'white',
    hoverAmount: 0.85,
    subtleAmount: 0.18,
    subtleHoverAmount: 0.28,
    // lighten toward white, so tinted text / borders keep contrast on dark surfaces
    textAmount: 0.55,
    borderAmount: 0.7,
    transparentHoverAlpha: 0.1,
    shadowColor: 'rgb(0 0 0 / 50%)',
  },
} as const satisfies Record<ColorScheme, ToneDerivation>;

export {
  COLOR_SCHEME__OPTIONS,
  PALETTE__TOKENS,
  SCHEME__TOKENS,
  TONE__OPTIONS,
  TONE__TOKENS,
  TONE_DERIVATION__TOKENS,
  TONE_ROLE__OPTIONS,
};
export type {
  ColorScheme,
  PaletteColor,
  Tone,
  ToneDefinition,
  ToneDerivation,
  ToneRole,
};
