import {
  type ColorScheme,
  PALETTE__TOKENS,
  type PaletteColor,
  SCHEME__TOKENS,
  TONE_DERIVATION__TOKENS,
  type ToneRole,
} from '../tokens/color.tokens.mjs';
import {
  type RgbaColor,
  contrastRatio,
  formatHex,
  mixOklab,
  parseColorOrThrow,
} from './color.mjs';

const paletteColor = (name: PaletteColor): RgbaColor =>
  parseColorOrThrow(PALETTE__TOKENS[name], `palette color ${name}`);

const WHITE = paletteColor('white');
const LIGHT_ON_SOLID = paletteColor('gray-50');
const DARK_ON_SOLID = paletteColor('gray-900');

/** The built-in page background of a scheme, which `subtle` roles are mixed against */
const defaultCanvas = (scheme: ColorScheme) =>
  paletteColor(SCHEME__TOKENS[scheme]['bg-canvas']);

/** Light text on `solid` (`gray-50`), unless dark text (`gray-900`) has more WCAG contrast */
function pickOnSolid(solid: RgbaColor): RgbaColor {
  return contrastRatio(solid, LIGHT_ON_SOLID) >=
    contrastRatio(solid, DARK_ON_SOLID)
    ? LIGHT_ON_SOLID
    : DARK_ON_SOLID;
}

type DeriveToneRolesInput = {
  solid: RgbaColor;
  /** default: the better-contrast of `gray-50` / `gray-900` */
  onSolid?: RgbaColor;
  /** explicit roles skip derivation (neutral tones keep text / border = solid) */
  text?: RgbaColor;
  border?: RgbaColor;
  /** default: the scheme's built-in `bg-canvas` */
  canvas?: RgbaColor;
};

/**
 * Every tone role for one scheme, as `#rrggbb` (`TONE_DERIVATION__TOKENS` holds the recipe).
 * The single implementation behind the shipped CSS (codegen) and `createTheme()` (runtime).
 */
function deriveToneRoles(
  scheme: ColorScheme,
  {
    solid,
    onSolid = pickOnSolid(solid),
    text,
    border,
    canvas = defaultCanvas(scheme),
  }: DeriveToneRolesInput,
): Record<ToneRole, string> {
  const derive = TONE_DERIVATION__TOKENS[scheme];
  const tint = (explicit: RgbaColor | undefined, amount: number | null) =>
    formatHex(
      explicit ?? (amount === null ? solid : mixOklab(solid, amount, WHITE)),
    );

  return {
    solid: formatHex(solid),
    'solid-hover': formatHex(
      mixOklab(solid, derive.hoverAmount, paletteColor(derive.hoverTarget)),
    ),
    'on-solid': formatHex(onSolid),
    subtle: formatHex(mixOklab(solid, derive.subtleAmount, canvas)),
    'subtle-hover': formatHex(
      mixOklab(solid, derive.subtleHoverAmount, canvas),
    ),
    border: tint(border, derive.borderAmount),
    text: tint(text, derive.textAmount),
  };
}

/** `transparent` tone hover: the scheme's text color at a low alpha */
function deriveTransparentHover(scheme: ColorScheme, textBase: RgbaColor) {
  return formatHex({
    ...textBase,
    alpha: TONE_DERIVATION__TOKENS[scheme].transparentHoverAlpha,
  });
}

export {
  defaultCanvas,
  deriveToneRoles,
  deriveTransparentHover,
  paletteColor,
  pickOnSolid,
};
export type { DeriveToneRolesInput };
