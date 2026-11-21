/**
 * Dependency-free color math: parsing, `oklab` mixing (same space the CSS `color-mix()` default and
 * Sass `color.mix($method: oklab)` use), WCAG contrast. Runs in Node and every 2021 browser.
 */

/** sRGB channels 0..255 (unrounded) + alpha 0..1 */
type RgbaColor = { r: number; g: number; b: number; alpha: number };
type Oklab = [number, number, number];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

// ----- Parsing -----
const HEX_RE = /^#([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i;
const RGB_RE = /^rgba?\(\s*([^)]*?)\s*\)$/i;

function parseChannel(token: string): number {
  return token.endsWith('%')
    ? (parseFloat(token) / 100) * 255
    : parseFloat(token);
}

function parseAlpha(token: string | undefined): number {
  if (token === undefined) return 1;
  return token.endsWith('%') ? parseFloat(token) / 100 : parseFloat(token);
}

/**
 * Parses `#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`, `rgb(r g b / a)` and `rgb(r, g, b, a)`.
 * Returns `null` for anything else (named colors, `hsl()`, `var()`, …).
 */
function parseColor(input: string): RgbaColor | null {
  const value = input.trim();
  const hex = HEX_RE.exec(value);

  if (hex) {
    let digits = hex[1];
    if (digits.length <= 4) {
      digits = [...digits].map((digit) => digit + digit).join('');
    }

    const channel = (index: number) =>
      parseInt(digits.slice(index * 2, index * 2 + 2), 16);

    return {
      r: channel(0),
      g: channel(1),
      b: channel(2),
      alpha: digits.length === 8 ? channel(3) / 255 : 1,
    };
  }

  const rgb = RGB_RE.exec(value);
  if (!rgb) return null;

  // `r g b / a` (modern) or `r, g, b, a` (legacy)
  const [channelsPart, alphaPart] = rgb[1].includes('/')
    ? rgb[1].split('/')
    : [rgb[1], undefined];
  const tokens = channelsPart.split(/[\s,]+/).filter(Boolean);
  const alphaToken = alphaPart?.trim() ?? tokens[3];

  if (tokens.length < 3 || tokens.length > (alphaPart ? 3 : 4)) return null;

  const [r, g, b] = tokens.slice(0, 3).map(parseChannel);
  const alpha = parseAlpha(alphaToken);

  if ([r, g, b, alpha].some((number) => !Number.isFinite(number))) return null;

  return {
    r: clamp(r, 0, 255),
    g: clamp(g, 0, 255),
    b: clamp(b, 0, 255),
    alpha: clamp(alpha, 0, 1),
  };
}

function parseColorOrThrow(input: string, label = 'color'): RgbaColor {
  const color = parseColor(input);
  if (!color) {
    throw new TypeError(
      `@mainset/ui-core: invalid ${label} "${input}", expected #rrggbb or rgb()`,
    );
  }

  return color;
}

// ----- Formatting -----
const toHexPair = (value: number) =>
  Math.round(clamp(value, 0, 255))
    .toString(16)
    .padStart(2, '0');

/** `#rrggbb`, or `#rrggbbaa` when translucent (8-digit hex: Chrome 62, Safari 10, Firefox 49) */
function formatHex({ r, g, b, alpha }: RgbaColor): string {
  const hex = `#${toHexPair(r)}${toHexPair(g)}${toHexPair(b)}`;
  return alpha < 1 ? `${hex}${toHexPair(alpha * 255)}` : hex;
}

// ----- oklab (https://bottosson.github.io/posts/oklab/) -----
const toLinear = (channel: number) => {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

const toGamma = (c: number) =>
  (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055) * 255;

function toOklab({ r, g, b }: RgbaColor): Oklab {
  const [lr, lg, lb] = [r, g, b].map(toLinear);
  const l = Math.cbrt(
    0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb,
  );
  const m = Math.cbrt(
    0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb,
  );
  const s = Math.cbrt(
    0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb,
  );

  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function fromOklab([L, a, b]: Oklab): RgbaColor {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;

  // NOTE: mixing two sRGB colors can land a hair outside sRGB; channels are clamped (by `formatHex`)
  return {
    r: toGamma(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    g: toGamma(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    b: toGamma(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
    alpha: 1,
  };
}

/** `amount` (0..1) of `color`, the rest of `target`, mixed in `oklab`; both opaque */
function mixOklab(
  color: RgbaColor,
  amount: number,
  target: RgbaColor,
): RgbaColor {
  const from = toOklab(color);
  const to = toOklab(target);

  return fromOklab(
    from.map(
      (value, index) => value * amount + to[index] * (1 - amount),
    ) as Oklab,
  );
}

// ----- oklch -----
/** OKLCH: lightness 0..1, chroma 0..~0.4, hue in degrees */
type Oklch = { l: number; c: number; h: number };

function toOklch(color: RgbaColor): Oklch {
  const [l, a, b] = toOklab(color);
  const hue = (Math.atan2(b, a) * 180) / Math.PI;
  return { l, c: Math.hypot(a, b), h: hue < 0 ? hue + 360 : hue };
}

const oklchToRgb = ({ l, c, h }: Oklch): RgbaColor => {
  const radians = (h * Math.PI) / 180;
  return fromOklab([l, c * Math.cos(radians), c * Math.sin(radians)]);
};

// NOTE: half a channel step of slack, so rounding noise isn't read as out of gamut
const isInSrgb = ({ r, g, b }: RgbaColor) =>
  [r, g, b].every((channel) => channel >= -0.5 && channel <= 255.5);

// Halvings of the chroma search: far below one 8-bit channel step
const GAMUT_SEARCH__STEPS = 20;

/**
 * The sRGB color of an OKLCH one. Out of gamut, chroma is reduced (lightness and hue kept) until
 * it fits, so a too-vivid request becomes the most vivid sRGB color of that lightness and hue.
 */
function oklchToSrgb(color: Oklch): RgbaColor {
  const exact = oklchToRgb(color);
  if (isInSrgb(exact)) return exact;

  let low = 0; // chroma known to fit
  let high = color.c; // chroma known not to
  for (let step = 0; step < GAMUT_SEARCH__STEPS; step += 1) {
    const chroma = (low + high) / 2;
    if (isInSrgb(oklchToRgb({ ...color, c: chroma }))) low = chroma;
    else high = chroma;
  }

  return oklchToRgb({ ...color, c: low });
}

/** `rgb(r g b)`, channels rounded and clamped to 0..255 */
function formatRgb({ r, g, b }: RgbaColor): string {
  const channel = (value: number) => Math.round(clamp(value, 0, 255));
  return `rgb(${channel(r)} ${channel(g)} ${channel(b)})`;
}

// ----- Contrast -----
const relativeLuminance = ({ r, g, b }: RgbaColor) =>
  0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

/** WCAG 2 contrast ratio, 1..21 */
function contrastRatio(x: RgbaColor, y: RgbaColor): number {
  const [high, low] = [relativeLuminance(x), relativeLuminance(y)].sort(
    (p, q) => q - p,
  );
  return (high + 0.05) / (low + 0.05);
}

/**
 * APCA lightness contrast (Lc, APCA-W3 0.0.98G-4g): about 0..106 for dark text on light, about
 * 0..-108 for light text on dark (the sign tells the polarity). An advisory, perceptual check next
 * to WCAG 2, which stays the pass / fail gate. Rough reading: |Lc| 75 body text, 60 content text,
 * 45 large text, 30 the floor for anything readable.
 */
function apcaContrast(text: RgbaColor, background: RgbaColor): number {
  const screenLuminance = ({ r, g, b }: RgbaColor) =>
    0.2126729 * (r / 255) ** 2.4 +
    0.7151522 * (g / 255) ** 2.4 +
    0.072175 * (b / 255) ** 2.4;
  // soft clamp of near-black, as the APCA reference does
  const softClamp = (y: number) => (y > 0.022 ? y : y + (0.022 - y) ** 1.414);

  const textY = softClamp(screenLuminance(text));
  const backgroundY = softClamp(screenLuminance(background));
  if (Math.abs(backgroundY - textY) < 0.0005) return 0;

  if (backgroundY > textY) {
    const contrast = (backgroundY ** 0.56 - textY ** 0.57) * 1.14;
    return contrast < 0.1 ? 0 : (contrast - 0.027) * 100;
  }

  const contrast = (backgroundY ** 0.65 - textY ** 0.62) * 1.14;
  return contrast > -0.1 ? 0 : (contrast + 0.027) * 100;
}

export {
  apcaContrast,
  contrastRatio,
  formatHex,
  formatRgb,
  mixOklab,
  oklchToSrgb,
  parseColor,
  parseColorOrThrow,
  toOklch,
};
export type { Oklch, RgbaColor };
