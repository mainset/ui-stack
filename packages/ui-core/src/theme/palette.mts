import {
  type Oklch,
  formatRgb,
  oklchToSrgb,
  parseColorOrThrow,
  toOklch,
} from './color.mjs';

/** Steps of every generated scale: light → dark */
const SCALE_STEP__OPTIONS = [
  25, 50, 100, 200, 300, 400, 450, 500, 600, 700, 800, 900, 950,
] as const;
type ScaleStep = (typeof SCALE_STEP__OPTIONS)[number];

/** What every scale shares: the lightness of each step and how much of the peak chroma it gets */
type ScaleRamp = {
  /** OKLCH lightness 0..1 per step: the same for every hue, so step N contrasts alike everywhere */
  lightness: Record<ScaleStep, number>;
  /** 0..1 of the scale's peak chroma per step (low at the ends, where color reads as tinted gray) */
  chromaShare: Record<ScaleStep, number>;
};

/**
 * One scale: a hue and a peak chroma, or a color it must contain exactly (`anchor` at `step`;
 * hue and peak chroma are read from it, the other steps follow the ramp).
 */
type ScaleSource =
  { hue: number; chroma: number } | { anchor: string; step: ScaleStep };

/** Every step as `rgb(r g b)`, out-of-gamut chroma reduced to the most vivid sRGB color */
function generateScale(
  source: ScaleSource,
  ramp: ScaleRamp,
): Record<ScaleStep, string> {
  let hue: number;
  let peakChroma: number;
  let anchor: { step: ScaleStep; value: string } | null = null;

  if ('anchor' in source) {
    const color = parseColorOrThrow(source.anchor, 'scale anchor');
    const { c, h }: Oklch = toOklch(color);
    hue = h;
    peakChroma = c / ramp.chromaShare[source.step];
    anchor = { step: source.step, value: formatRgb(color) };
  } else {
    hue = source.hue;
    peakChroma = source.chroma;
  }

  return Object.fromEntries(
    SCALE_STEP__OPTIONS.map((step) => [
      step,
      step === anchor?.step
        ? anchor.value
        : formatRgb(
            oklchToSrgb({
              l: ramp.lightness[step],
              c: peakChroma * ramp.chromaShare[step],
              h: hue,
            }),
          ),
    ]),
  ) as Record<ScaleStep, string>;
}

/** `{ 'gray-25': 'rgb(…)', …, 'violet-950': 'rgb(…)' }` for every source */
function generatePalette<Name extends string>(
  sources: Record<Name, ScaleSource>,
  ramp: ScaleRamp,
): Record<`${Name}-${ScaleStep}`, string> {
  const palette: Record<string, string> = {};

  for (const [name, source] of Object.entries(sources) as [
    Name,
    ScaleSource,
  ][]) {
    for (const [step, value] of Object.entries(generateScale(source, ramp))) {
      palette[`${name}-${step}`] = value;
    }
  }

  return palette as Record<`${Name}-${ScaleStep}`, string>;
}

export { SCALE_STEP__OPTIONS, generatePalette, generateScale };
export type { ScaleRamp, ScaleSource, ScaleStep };
