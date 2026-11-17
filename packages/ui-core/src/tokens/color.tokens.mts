/**
 * Color tokens — the single source for `styles/_generated.scss` and the TS color options.
 *
 * Tier 1: {PALETTE__TOKENS} literal colors (never used by elements directly)
 * Tier 2: {TONE__TOKENS} / {SCHEME__TOKENS} semantic intent per color scheme
 */
import {
  type ScaleRamp,
  type ScaleSource,
  generatePalette,
} from '../theme/palette.mjs';

/**
 * The lightness ramp every generated scale shares (OKLCH L per step), so step N has about the same
 * contrast in every hue, and the share of each scale's peak chroma per step (low at the ends).
 * The neutral steps keep the lightness of the cool grays they replaced, so contrast held.
 */
const SCALE_RAMP__TOKENS = {
  lightness: {
    25: 0.994,
    50: 0.985,
    100: 0.967,
    200: 0.928,
    300: 0.872,
    400: 0.714,
    450: 0.655,
    500: 0.551,
    600: 0.446,
    700: 0.373,
    800: 0.278,
    900: 0.21,
    950: 0.13,
  },
  chromaShare: {
    25: 0.2,
    50: 0.27,
    100: 0.36,
    200: 0.55,
    300: 0.73,
    400: 0.91,
    450: 1,
    500: 1,
    600: 1,
    700: 0.91,
    800: 0.82,
    900: 0.64,
    950: 0.45,
  },
} as const satisfies ScaleRamp;

/**
 * Generated scales (`{name}-{25…950}`), from a hue + peak chroma or from one exact color.
 * Generated in OKLCH and emitted as `rgb()` (the 2021 browser baseline has no `oklch()`).
 */
const SCALE__SOURCES = {
  // neutrals: warm paper → warm charcoal, a faint hue so surfaces never read cold
  gray: { hue: 75, chroma: 0.011 },
  // violet-tinted neutral: the `secondary` tone's calm ink
  ink: { hue: 300, chroma: 0.07 },
  // brand: #8b14fd exactly at step 500, its hue and chroma carried across the scale
  violet: { anchor: 'rgb(139 20 253)', step: 500 },
  // warm accent: the `tertiary` tone, the human highlight next to the brand violet
  orange: { hue: 52, chroma: 0.17 },
} as const satisfies Record<string, ScaleSource>;

const PALETTE__TOKENS = {
  white: 'rgb(255 255 255)',
  black: 'rgb(0 0 0)',
  ...generatePalette(SCALE__SOURCES, SCALE_RAMP__TOKENS),
  // feedback (hand-picked for now; to be regenerated with on-solid contrast in mind)
  'red-600': 'rgb(215 34 38)',
  'blue-600': 'rgb(37 99 235)',
  'green-600': 'rgb(22 163 74)',
  'yellow-500': 'rgb(234 179 8)',
};

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
  // the brand: #8b14fd, the one accent (calls to action)
  primary: {
    light: { solid: 'violet-500', 'on-solid': 'gray-50' },
    dark: { solid: 'violet-500', 'on-solid': 'gray-50' },
  },
  // calm emphasis in the brand's family: deep ink on light, pale ink on dark
  secondary: {
    light: { solid: 'ink-800', 'on-solid': 'gray-50' },
    dark: { solid: 'ink-200', 'on-solid': 'ink-900' },
  },
  // the warm accent, for human highlights ("new", notes), never a second call to action
  tertiary: {
    light: { solid: 'orange-400', 'on-solid': 'gray-950' },
    dark: { solid: 'orange-400', 'on-solid': 'gray-950' },
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
    // warm paper, as close to white as a tint can be; cards and popovers stay white on it
    'bg-canvas': 'gray-25',
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
    'focus-ring': 'violet-500',
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
  /**
   * `text` / `border` = the mix of `solid` toward `tintTarget` closest to `solid` that still has
   * this WCAG contrast on the scheme's `bg-subtle` (its least contrasting surface) and on the tone's
   * own `subtle` fill. A `solid` that already has it stays itself, so a brand color is only tinted
   * where contrast needs it.
   */
  tintTarget: PaletteColor;
  textContrast: number;
  borderContrast: number;
  /** `transparent` tone: a hint of the text color on hover */
  transparentHoverAlpha: number;
  shadowColor: string;
};

/**
 * How derived tone roles are mixed (in `oklab`), per color scheme. Amounts are 0..1 of `solid`;
 * contrasts are WCAG ratios.
 * Shared by the build (codegen) and the runtime (`createTheme()`), so both always agree.
 */
const TONE_DERIVATION__TOKENS = {
  light: {
    hoverTarget: 'black',
    hoverAmount: 0.85,
    subtleAmount: 0.12,
    subtleHoverAmount: 0.2,
    tintTarget: 'black',
    textContrast: 4.5, // WCAG AA, normal text
    borderContrast: 3, // WCAG non-text contrast (UI components)
    transparentHoverAlpha: 0.1,
    shadowColor: 'rgb(8 7 6 / 10%)', // gray-950
  },
  dark: {
    hoverTarget: 'white',
    hoverAmount: 0.85,
    subtleAmount: 0.18,
    subtleHoverAmount: 0.28,
    // lighten toward white, so tinted text / borders keep contrast on dark surfaces
    tintTarget: 'white',
    textContrast: 4.5,
    borderContrast: 3,
    transparentHoverAlpha: 0.1,
    shadowColor: 'rgb(0 0 0 / 50%)',
  },
} as const satisfies Record<ColorScheme, ToneDerivation>;

export {
  COLOR_SCHEME__OPTIONS,
  PALETTE__TOKENS,
  SCALE__SOURCES,
  SCALE_RAMP__TOKENS,
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
