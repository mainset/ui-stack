import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const stylesDir = path.join(import.meta.dirname, '..');
const elementsDir = path.join(stylesDir, '../elements');
const reactDir = path.join(stylesDir, '../../../react/src');

// Every non-partial stylesheet of every element, as `dir/name` (no extension)
const elementStylesheets = readdirSync(elementsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .flatMap((dir) =>
    readdirSync(path.join(elementsDir, dir.name))
      .filter((file) => file.endsWith('.scss') && !file.startsWith('_'))
      .map((file) => `${dir.name}/${file.replace('.scss', '')}`),
  );

const isNormalize = (stylesheet: string) => stylesheet.endsWith('-normalize');
const hasNormalize = (stylesheet: string) =>
  elementStylesheets.includes(`${stylesheet}-normalize`);
// Theme layers: the look of a component that has a normalize layer, or `surface` (look only)
const isTheme = (stylesheet: string) =>
  !isNormalize(stylesheet) &&
  (hasNormalize(stylesheet) || stylesheet === 'surface/surface');

const readBundle = (name: string) =>
  readFileSync(path.join(stylesDir, `${name}.scss`), 'utf8');
const missingFrom = (bundle: string, stylesheets: string[]) =>
  stylesheets.filter(
    (stylesheet) => !bundle.includes(`@use '../elements/${stylesheet}'`),
  );

// All `.scss` sources of both packages (partials included), relative paths
const allSources = [elementsDir, stylesDir, reactDir].flatMap((dir) =>
  readdirSync(dir, { recursive: true })
    .map(String)
    .filter(
      (file) => file.endsWith('.scss') && !file.endsWith('_generated.scss'),
    )
    .map((file) => path.join(dir, file)),
);

describe('bundles', () => {
  it('index.scss includes every element stylesheet', () => {
    expect(missingFrom(readBundle('index'), elementStylesheets)).toEqual([]);
  });

  it('normalize.scss includes every normalize layer and utility, no theme layer', () => {
    const bundle = readBundle('normalize');

    expect(
      missingFrom(
        bundle,
        elementStylesheets.filter((stylesheet) => !isTheme(stylesheet)),
      ),
    ).toEqual([]);
    expect(
      elementStylesheets
        .filter(isTheme)
        .filter((stylesheet) =>
          bundle.includes(`@use '../elements/${stylesheet}'`),
        ),
    ).toEqual([]);
  });
});

describe('layers', () => {
  // The normalize layer is mechanics only; anything that is the mainset look belongs to the theme
  const LOOK =
    /var\(--ms-(color|tone|palette)-|#[\da-f]{3,8}\b|rgba?\(|font-(size|weight)|letter-spacing|line-height|box-shadow|border-radius:\s*var|transition/i;

  it('normalize layers contain no colors, typography, radius, shadows or motion', () => {
    const offenders = allSources
      .filter((file) => file.endsWith('-normalize.scss'))
      .flatMap((file) =>
        readFileSync(file, 'utf8')
          .split('\n')
          .map((line, index) => ({ line: line.replace(/\/\/.*$/, ''), index }))
          .filter(({ line }) => LOOK.test(line))
          .map(
            ({ line, index }) =>
              `${path.basename(file)}:${index + 1} ${line.trim()}`,
          ),
      );

    expect(offenders).toEqual([]);
  });
});

describe('direction (LTR / RTL)', () => {
  // Direction comes from the nearest `dir` ancestor, so a single section can be RTL:
  // only logical properties and flex / grid alignment, never physical sides or `[dir]` selectors
  const PHYSICAL =
    /(^|[^-\w])(left|right)\s*:|(margin|padding|border|inset)-(left|right)\b|translateX|text-align:\s*(left|right)|float:\s*(left|right)|(left|right) (center|top|bottom)|\[dir\b|:dir\(/;

  it('stylesheets use logical properties only', () => {
    const offenders = allSources.flatMap((file) => {
      const lines = readFileSync(file, 'utf8').split('\n');

      return lines
        .map((line, index) => ({ line, index }))
        .filter(
          ({ line, index }) =>
            PHYSICAL.test(line.replace(/\/\/.*$/, '')) &&
            // a symmetric glyph may use physical sides, marked on the line above
            !/rtl-safe:/.test(lines[index - 1] ?? ''),
        )
        .map(
          ({ line, index }) =>
            `${path.basename(file)}:${index + 1} ${line.trim()}`,
        );
    });

    expect(offenders).toEqual([]);
  });
});

it('tokens pointing at scheme colors are declared on every theme root', () => {
  // A `var()` inside a custom property resolves where it's declared: on `:root` only, a scheme
  // color would keep its light value inside `[data-theme="dark"]`
  const offenders = allSources.flatMap((file) => {
    const source = readFileSync(file, 'utf8');
    const rootOnlyBlocks = source.match(/:where\(:root\)\s*\{[^}]*\}/g) ?? [];

    return rootOnlyBlocks
      .filter((block) => /var\(--ms-(color|tone)-/.test(block))
      .map(() => path.basename(file));
  });

  expect(offenders).toEqual([]);
});
