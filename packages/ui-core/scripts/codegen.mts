/**
 * ui-core codegen: TS is the single source of truth, Sass consumes generated data.
 *
 * Inputs : `src/tokens/*`                  token values (palette, tones, spacing, layout, …)
 *          every `*__CLASS_NAME_CONFIG`    options, modifiers and responsiveness of each prop
 * Output : `src/styles/_generated.scss`    Sass maps consumed by `_variables.scss` / `_options.scss`
 *
 * Usage  : node --import ./scripts/ts-hooks.register.mjs ./scripts/codegen.mts [--check]
 *          `--check` fails (exit 1) when the committed file is out of date, e.g. in CI.
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as prettier from 'prettier';

import * as elements from '../src/elements/index.mjs';
import {
  deriveToneRoles,
  deriveTransparentHover,
  paletteColor,
} from '../src/theme/derive.mjs';
import * as tokens from '../src/tokens/index.mjs';
import type { ClassNameFromPropConfig } from '../src/utils/index.mjs';

const OUTPUT_PATH = path.join(
  import.meta.dirname,
  '../src/styles/_generated.scss',
);

// ----- Sass serialisation -----
type SassData =
  | string
  | number
  | boolean
  | Raw
  | SassData[]
  | SassMap
  // NOTE: a `Map` keeps insertion order (objects move integer-like keys such as `'4'` first)
  | Map<string, SassData>;
type SassMap = { [key: string]: SassData };

/** A CSS value emitted as-is (unquoted), e.g. `0.25rem`, `rgb(0 0 0)` */
// NOTE: no TS parameter properties — Node's type stripping only supports erasable syntax
class Raw {
  readonly value: string | number;

  constructor(value: string | number) {
    this.value = value;
  }
}

const quote = (value: string) => `'${value.replace(/'/g, "\\'")}'`;

function toSass(value: SassData): string {
  if (value instanceof Raw) return String(value.value);
  if (typeof value === 'string') return quote(value);
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (Array.isArray(value)) {
    // NOTE: the trailing comma keeps single-item lists as lists
    return `(${value.map(toSass).join(', ')},)`;
  }

  const entries = (
    value instanceof Map ? [...value] : Object.entries(value)
  ).map(([key, entry]) => `${quote(key)}: ${toSass(entry)}`);
  return entries.length ? `(${entries.join(', ')})` : '()';
}

const rawValues = (record: Record<string, string | number>): SassMap =>
  Object.fromEntries(
    Object.entries(record).map(([key, value]) => [key, new Raw(value)]),
  );

// ----- Class-name configs -----
function collectClassNameConfigs(): SassMap {
  const configMap: SassMap = {};

  for (const [exportName, exported] of Object.entries(elements)) {
    if (!exportName.endsWith('__CLASS_NAME_CONFIG')) continue;

    const { baseClass, isSingleClassComposed, classNameDefinitionByPropName } =
      exported as ClassNameFromPropConfig;
    const propMap: SassMap = {};

    for (const [propName, definition] of Object.entries(
      classNameDefinitionByPropName,
    )) {
      propMap[propName] = {
        modifier: definition.modifier ?? '',
        options: [...definition.options],
        // `false` | `'class'` | `'css-var'`
        responsive: definition.responsive ?? false,
        ...(definition.cssValue && { 'css-value': definition.cssValue }),
      };
    }

    configMap[baseClass] = {
      composed: Boolean(isSingleClassComposed),
      props: propMap,
    };
  }

  return configMap;
}

// ----- Color scheme values -----
// NOTE: derived roles come from the same `deriveToneRoles()` that `createTheme()` runs in the
// browser, so a runtime theme and the shipped CSS can't drift apart
const paletteVar = (name: tokens.PaletteColor) =>
  new Raw(`var(--ms-palette-${name})`);

/** `(token name: value)` of one scheme; plain values, no references to other semantic tokens */
function schemeTokenMap(scheme: tokens.ColorScheme): Map<string, SassData> {
  const derivation = tokens.TONE_DERIVATION__TOKENS[scheme];
  const neutrals: Record<string, tokens.PaletteColor> =
    tokens.SCHEME__TOKENS[scheme];
  const map = new Map<string, SassData>();

  for (const [name, ref] of Object.entries(neutrals)) {
    map.set(`color-${name}`, paletteVar(ref));
  }

  for (const tone of tokens.TONE__OPTIONS) {
    const definition: tokens.ToneDefinition = tokens.TONE__TOKENS[tone][scheme];
    const derived = deriveToneRoles(scheme, {
      solid: paletteColor(definition.solid),
      onSolid: paletteColor(definition['on-solid']),
      canvas: paletteColor(neutrals['bg-canvas']),
    });
    // NOTE: a role that isn't mixed stays a palette reference, so palette overrides reach it
    const roleValue = (role: 'border' | 'text') => {
      const explicit = definition[role];
      if (explicit) return paletteVar(explicit);
      return derivation[`${role}Amount`] === null
        ? paletteVar(definition.solid)
        : new Raw(derived[role]);
    };

    const prefix = `color-${tone}`;

    map.set(`${prefix}-solid`, paletteVar(definition.solid));
    map.set(`${prefix}-solid-hover`, new Raw(derived['solid-hover']));
    map.set(`${prefix}-on-solid`, paletteVar(definition['on-solid']));
    map.set(`${prefix}-subtle`, new Raw(derived.subtle));
    map.set(`${prefix}-subtle-hover`, new Raw(derived['subtle-hover']));
    map.set(`${prefix}-border`, roleValue('border'));
    map.set(`${prefix}-text`, roleValue('text'));
  }

  map.set(
    'color-transparent-solid-hover',
    new Raw(
      deriveTransparentHover(scheme, paletteColor(neutrals['text-base'])),
    ),
  );
  map.set('shadow-color', new Raw(derivation.shadowColor));

  return map;
}

// ----- Output -----
const variables: [string, SassData][] = [
  ['palette-map', rawValues(tokens.PALETTE__TOKENS)],
  ['tone-map', tokens.TONE__TOKENS],
  ['scheme-map', tokens.SCHEME__TOKENS],
  [
    'scheme-token-map',
    new Map(
      tokens.COLOR_SCHEME__OPTIONS.map((scheme) => [
        scheme,
        schemeTokenMap(scheme),
      ]),
    ),
  ],
  [
    'space-map',
    new Map(
      tokens.SPACE__KEYS.map((key) => [
        key,
        new Raw(tokens.SPACE__TOKENS[key]),
      ]),
    ),
  ],
  ['spacing-scale-map', tokens.SPACING_SCALE__TOKENS],
  ['layout-gap-map', tokens.LAYOUT_GAP__TOKENS],
  ['breakpoint-map', rawValues(tokens.BREAKPOINT__TOKENS)],
  ['container-map', rawValues(tokens.CONTAINER__TOKENS)],
  ['border-radius-map', rawValues(tokens.BORDER_RADIUS__TOKENS)],
  ['border-width-map', rawValues(tokens.BORDER_WIDTH__TOKENS)],
  ['z-index-map', rawValues(tokens.Z_INDEX__TOKENS)],
  ['class-name-config-map', collectClassNameConfigs()],
];

const source = [
  '// AUTO-GENERATED by `scripts/codegen.mts` — DO NOT EDIT.',
  '// Source of truth: `src/tokens/*` and every `*__CLASS_NAME_CONFIG`. Run `pnpm codegen` to update.',
  '/* stylelint-disable */',
  '',
  ...variables.map(([name, value]) => `$${name}: ${toSass(value)};\n`),
].join('\n');

async function main() {
  const prettierConfig = (await prettier.resolveConfig(OUTPUT_PATH)) ?? {};
  const output = await prettier.format(source, {
    ...prettierConfig,
    filepath: OUTPUT_PATH,
  });

  if (process.argv.includes('--check')) {
    const current = await readFile(OUTPUT_PATH, 'utf8').catch(() => '');
    if (current !== output) {
      console.error(
        `✖ ${path.relative(process.cwd(), OUTPUT_PATH)} is out of date, run \`pnpm codegen\``,
      );
      process.exit(1);
    }

    console.log('✔ generated Sass is up to date');
  } else {
    await writeFile(OUTPUT_PATH, output);
    console.log(`✔ generated ${path.relative(process.cwd(), OUTPUT_PATH)}`);
  }
}

// NOTE: no top-level await, so the script typechecks under any `module` setting
main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
