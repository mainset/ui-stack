import {
  COLOR_SCHEME__OPTIONS,
  type ColorScheme,
  TONE__OPTIONS,
  type Tone,
} from '../tokens/color.tokens.mjs';
import { parseColor, parseColorOrThrow } from './color.mjs';
import { deriveToneRoles } from './derive.mjs';

/** A `--ms-*` custom property, e.g. `--ms-color-bg-canvas` or `--ms-border-radius-sm` */
type ThemeCustomPropertyName = `--ms-${string}`;
type ThemeCustomProperties = Partial<Record<ThemeCustomPropertyName, string>>;

/** One color (`#rrggbb` / `rgb()`); the other roles are derived. Explicit roles skip derivation. */
type ToneColorDefinition = {
  solid: string;
  /** default: light or dark text, whichever has more WCAG contrast on `solid` */
  onSolid?: string;
  text?: string;
  border?: string;
};
type ToneColorInput = string | ToneColorDefinition;
/** The same color for both schemes, or one per scheme */
type ThemeToneInput =
  ToneColorInput | { light: ToneColorInput; dark: ToneColorInput };

interface CreateThemeOptions {
  /** Brand colors per tone, e.g. `{ primary: '#0f766e' }` */
  tones?: Partial<Record<Tone, ThemeToneInput | null>>;
  /**
   * Any other `--ms-*` values per scheme (canvas, text, borders, focus ring…). They are applied
   * after the tones, so they win. A `--ms-color-bg-canvas` color here is also used as the
   * background the tone's `subtle` roles are mixed against, and a `--ms-color-bg-subtle` one as
   * the surface their `text` / `border` keep WCAG contrast on.
   */
  light?: ThemeCustomProperties;
  dark?: ThemeCustomProperties;
}

type ThemeTokens = Record<ColorScheme, ThemeCustomProperties>;

const THEME_STYLE_ID = 'ms-theme';

// NOTE: values end up inside a `<style>` element, so anything that could close a declaration,
// a rule or the element itself is rejected
const UNSAFE_VALUE_RE = /[;{}<>]/;
const PROPERTY_NAME_RE = /^--ms-[\w-]+$/;

function assertCustomProperties(
  properties: ThemeCustomProperties,
  label: string,
) {
  for (const [name, value] of Object.entries(properties)) {
    if (!PROPERTY_NAME_RE.test(name)) {
      throw new TypeError(
        `@mainset/ui-core: ${label} "${name}" is not a --ms-* custom property`,
      );
    }

    if (typeof value !== 'string' || UNSAFE_VALUE_RE.test(value)) {
      throw new TypeError(
        `@mainset/ui-core: ${label} "${name}" has an invalid value "${String(value)}"`,
      );
    }
  }
}

function isPerScheme(
  input: ThemeToneInput,
): input is { light: ToneColorInput; dark: ToneColorInput } {
  return typeof input === 'object' && 'light' in input && 'dark' in input;
}

function toneTokensForScheme(
  tone: Tone,
  input: ToneColorInput,
  scheme: ColorScheme,
  surfaces: { canvas?: string; subtle?: string },
): ThemeCustomProperties {
  const definition = typeof input === 'string' ? { solid: input } : input;
  const parse = (value: string | undefined, role: string) =>
    value === undefined
      ? undefined
      : parseColorOrThrow(value, `${tone} ${role} color`);
  // NOTE: an override that isn't a parseable color (e.g. a `var()`) keeps the built-in surface
  const surface = (value: string | undefined) =>
    (value === undefined ? null : parseColor(value)) ?? undefined;

  const roles = deriveToneRoles(scheme, {
    solid: parseColorOrThrow(definition.solid, `${tone} color`),
    onSolid: parse(definition.onSolid, 'onSolid'),
    text: parse(definition.text, 'text'),
    border: parse(definition.border, 'border'),
    canvas: surface(surfaces.canvas),
    contrastSurface: surface(surfaces.subtle),
  });

  return Object.fromEntries(
    Object.entries(roles).map(([role, value]) => [
      `--ms-color-${tone}-${role}`,
      value,
    ]),
  );
}

/**
 * Every custom property of a theme, per scheme: each tone's 7 roles (derived exactly like the
 * shipped CSS) followed by the `light` / `dark` overrides.
 * When `primary` is set and no `--ms-color-focus-ring` is given, the focus ring follows it.
 *
 * @example createThemeTokens({ tones: { primary: '#0f766e' } }).dark['--ms-color-primary-text']
 */
function createThemeTokens(options: CreateThemeOptions = {}): ThemeTokens {
  const { tones = {} } = options;
  const result = { light: {}, dark: {} } as ThemeTokens;

  for (const scheme of COLOR_SCHEME__OPTIONS) {
    const overrides = options[scheme] ?? {};
    assertCustomProperties(overrides, `${scheme} property`);

    for (const [tone, input] of Object.entries(tones) as [
      Tone,
      ThemeToneInput | null | undefined,
    ][]) {
      // NOTE: `null` / `undefined` = keep the built-in tone (handy for optional user settings)
      if (input === undefined || input === null) continue;
      if (!TONE__OPTIONS.includes(tone)) {
        throw new TypeError(
          `@mainset/ui-core: unknown tone "${tone}", expected one of ${TONE__OPTIONS.join(', ')}`,
        );
      }

      Object.assign(
        result[scheme],
        toneTokensForScheme(
          tone,
          isPerScheme(input) ? input[scheme] : input,
          scheme,
          {
            canvas: overrides['--ms-color-bg-canvas'],
            subtle: overrides['--ms-color-bg-subtle'],
          },
        ),
      );
    }

    // NOTE: same pairing as the built-in brand: the solid color in light, the lighter text tint in dark
    const tokens = result[scheme];
    const primaryRole =
      scheme === 'light'
        ? tokens['--ms-color-primary-solid']
        : tokens['--ms-color-primary-text'];
    if (primaryRole && !overrides['--ms-color-focus-ring']) {
      tokens['--ms-color-focus-ring'] = primaryRole;
    }

    Object.assign(result[scheme], overrides);
  }

  return result;
}

const declarationBlock = (
  selector: string,
  properties: ThemeCustomProperties,
) =>
  `${selector}{${Object.entries(properties)
    .map(([name, value]) => `${name}:${value}`)
    .join(';')}}`;

/**
 * CSS text for a theme, in the scheme-aware override pattern (light, dark, `system` and nested
 * `data-theme` subtrees). Its selectors outrank the built-in 0-specificity tokens, so it wins in
 * any load order. Returns `''` for an empty theme.
 *
 * @example
 * const css = createTheme({ tones: { primary: '#0f766e', error: '#be123c' } });
 * // server: `<style id="ms-theme">${css}</style>`, client: `applyTheme(options)`
 */
function createTheme(options: CreateThemeOptions = {}): string {
  const { light, dark } = createThemeTokens(options);
  const blocks: string[] = [];

  if (Object.keys(light).length) {
    blocks.push(
      declarationBlock(':root,[data-theme=light],[data-theme=system]', light),
    );
  }

  if (Object.keys(dark).length) {
    blocks.push(
      declarationBlock('[data-theme=dark]', dark),
      `@media (prefers-color-scheme:dark){${declarationBlock('[data-theme=system]', dark)}}`,
    );
  }

  return blocks.join('\n');
}

type ApplyThemeOptions = {
  /** id of the `<style>` element, reused when it already exists (e.g. server-rendered) */
  id?: string;
  /** CSP nonce for a newly created `<style>` element */
  nonce?: string;
  document?: Document;
};

/**
 * Browser only: writes the theme into one `<style>` element in `<head>`, creating it once.
 * `null` / an empty theme removes the element, restoring the built-in theme.
 */
function applyTheme(
  theme: CreateThemeOptions | null | undefined,
  {
    id = THEME_STYLE_ID,
    nonce,
    document: doc = document,
  }: ApplyThemeOptions = {},
): HTMLStyleElement | null {
  const css = theme ? createTheme(theme) : '';
  let style = doc.getElementById(id) as HTMLStyleElement | null;

  if (!css) {
    style?.remove();
    return null;
  }

  if (!style) {
    style = doc.createElement('style');
    style.id = id;
    if (nonce) style.nonce = nonce;
    doc.head.appendChild(style);
  }

  style.textContent = css;

  return style;
}

export { applyTheme, createTheme, createThemeTokens, THEME_STYLE_ID };
export type {
  ApplyThemeOptions,
  CreateThemeOptions,
  ThemeCustomProperties,
  ThemeCustomPropertyName,
  ThemeTokens,
  ThemeToneInput,
  ToneColorDefinition,
  ToneColorInput,
};
