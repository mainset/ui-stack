/**
 * Every text / UI color of the built-in themes on every surface it sits on, at rest: what
 * `src/theme/contrast.test.mts` gates with WCAG 2 and `contrast-report.mts` prints with APCA too.
 */
import {
  type RgbaColor,
  apcaContrast,
  contrastRatio,
  parseColorOrThrow,
} from '../src/theme/color.mjs';
import { deriveToneRoles, paletteColor } from '../src/theme/derive.mjs';
import {
  COLOR_SCHEME__OPTIONS,
  type ColorScheme,
  SCHEME__TOKENS,
  TONE__OPTIONS,
  TONE__TOKENS,
  type Tone,
  type ToneDefinition,
} from '../src/tokens/color.tokens.mjs';

type ContrastKind = 'text' | 'ui';

type ContrastPair = {
  scheme: ColorScheme;
  /** e.g. `primary text`, `text-muted`, `focus-ring` */
  label: string;
  /** e.g. `bg-surface`, `primary subtle` */
  on: string;
  kind: ContrastKind;
  wcag: number;
  apca: number;
};

/** WCAG 2 minimums: AA text, and non-text contrast for UI parts (borders, focus rings) */
const MIN_CONTRAST__BY_KIND: Record<ContrastKind, number> = {
  text: 4.5,
  ui: 3,
};

// `inverse` is meant for inverted fills, never for text on the page surfaces
const PAGE_TONES = TONE__OPTIONS.filter((tone) => tone !== 'inverse');

function contrastPairs(): ContrastPair[] {
  const pairs: ContrastPair[] = [];

  for (const scheme of COLOR_SCHEME__OPTIONS) {
    const neutrals = SCHEME__TOKENS[scheme];
    const surfaces = {
      'bg-canvas': paletteColor(neutrals['bg-canvas']),
      'bg-surface': paletteColor(neutrals['bg-surface']),
      'bg-subtle': paletteColor(neutrals['bg-subtle']),
    };
    const add = (
      pair: Omit<ContrastPair, 'scheme' | 'wcag' | 'apca'> & {
        color: RgbaColor;
        background: RgbaColor;
      },
    ) => {
      const { color, background, ...rest } = pair;

      pairs.push({
        ...rest,
        scheme,
        wcag: contrastRatio(color, background),
        apca: apcaContrast(color, background),
      });
    };

    const addOnSurfaces = (
      label: string,
      color: RgbaColor,
      kind: ContrastKind,
    ) => {
      for (const [on, background] of Object.entries(surfaces)) {
        add({ label, color, on, background, kind });
      }
    };

    for (const name of ['text-base', 'text-muted', 'text-subtle'] as const) {
      addOnSurfaces(name, paletteColor(neutrals[name]), 'text');
    }

    addOnSurfaces(
      'border-strong',
      paletteColor(neutrals['border-strong']),
      'ui',
    );
    addOnSurfaces('focus-ring', paletteColor(neutrals['focus-ring']), 'ui');

    for (const tone of PAGE_TONES as Tone[]) {
      const definition: ToneDefinition = TONE__TOKENS[tone][scheme];
      const roles = deriveToneRoles(scheme, {
        solid: paletteColor(definition.solid),
        onSolid: paletteColor(definition['on-solid']),
        text: definition.text && paletteColor(definition.text),
        border: definition.border && paletteColor(definition.border),
      });
      const color = (role: keyof typeof roles) =>
        parseColorOrThrow(roles[role]);

      addOnSurfaces(`${tone} text`, color('text'), 'text');
      add({
        label: `${tone} text`,
        color: color('text'),
        on: `${tone} subtle`,
        background: color('subtle'),
        kind: 'text',
      });
      addOnSurfaces(`${tone} border`, color('border'), 'ui');
      add({
        label: `${tone} on-solid`,
        color: color('on-solid'),
        on: `${tone} solid`,
        background: color('solid'),
        kind: 'text',
      });
    }
  }

  return pairs;
}

const passesWcag = (pair: ContrastPair) =>
  pair.wcag >= MIN_CONTRAST__BY_KIND[pair.kind];

export { MIN_CONTRAST__BY_KIND, contrastPairs, passesWcag };
export type { ContrastKind, ContrastPair };
