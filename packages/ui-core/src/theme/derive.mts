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

const LIGHT_ON_SOLID = paletteColor('gray-50');
const DARK_ON_SOLID = paletteColor('gray-900');

/** The built-in page background of a scheme, which `subtle` roles are mixed against */
const defaultCanvas = (scheme: ColorScheme) =>
  paletteColor(SCHEME__TOKENS[scheme]['bg-canvas']);

/** The scheme's least contrasting surface (`bg-subtle`), which `text` / `border` are checked on */
const defaultContrastSurface = (scheme: ColorScheme) =>
  paletteColor(SCHEME__TOKENS[scheme]['bg-subtle']);

/** As shipped: rounded to `#rrggbb`, so a contrast check sees the color the CSS will have */
const rounded = (color: RgbaColor) => parseColorOrThrow(formatHex(color));

// Halvings of the search: 2^-16 of a mix is far below one 8-bit channel step
const CONTRAST_SEARCH__STEPS = 16;

/**
 * The mix of `color` toward `target` closest to `color` (the most of it) with at least `minContrast`
 * on every one of `surfaces`; `color` itself when it already has it.
 */
function reachContrast(
  color: RgbaColor,
  target: RgbaColor,
  surfaces: readonly RgbaColor[],
  minContrast: number,
): RgbaColor {
  const passes = (candidate: RgbaColor) =>
    surfaces.every(
      (surface) => contrastRatio(candidate, surface) >= minContrast,
    );
  if (passes(rounded(color))) return color;

  // NOTE: contrast grows steadily as `color` moves toward `target` (white on dark, black on light)
  let low = 0; // amount of `color` known to pass (all `target`)
  let high = 1; // amount known to fail
  for (let step = 0; step < CONTRAST_SEARCH__STEPS; step += 1) {
    const amount = (low + high) / 2;
    if (passes(rounded(mixOklab(color, amount, target)))) low = amount;
    else high = amount;
  }

  return mixOklab(color, low, target);
}

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
  /** the surface `text` / `border` must contrast with; default: the scheme's built-in `bg-subtle` */
  contrastSurface?: RgbaColor;
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
    contrastSurface = defaultContrastSurface(scheme),
  }: DeriveToneRolesInput,
): Record<ToneRole, string> {
  const derive = TONE_DERIVATION__TOKENS[scheme];
  const subtle = mixOklab(solid, derive.subtleAmount, canvas);
  // NOTE: the surfaces tinted text / borders sit on at rest: the scheme's quiet fill and the tone's
  // own `subtle` fill (a subtle badge / alert)
  const tintSurfaces = [contrastSurface, rounded(subtle)];
  const tint = (explicit: RgbaColor | undefined, minContrast: number) =>
    formatHex(
      explicit ??
        reachContrast(
          solid,
          paletteColor(derive.tintTarget),
          tintSurfaces,
          minContrast,
        ),
    );

  return {
    solid: formatHex(solid),
    'solid-hover': formatHex(
      mixOklab(solid, derive.hoverAmount, paletteColor(derive.hoverTarget)),
    ),
    'on-solid': formatHex(onSolid),
    subtle: formatHex(subtle),
    'subtle-hover': formatHex(
      mixOklab(solid, derive.subtleHoverAmount, canvas),
    ),
    border: tint(border, derive.borderContrast),
    text: tint(text, derive.textContrast),
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
  defaultContrastSurface,
  deriveToneRoles,
  deriveTransparentHover,
  paletteColor,
  pickOnSolid,
  reachContrast,
};
export type { DeriveToneRolesInput };
