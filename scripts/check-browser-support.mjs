/**
 * Fails when built CSS / JS uses a feature newer than the supported browsers (`.browserslistrc`).
 * A deny-list of the features that are easy to slip in and fail *hard* in old browsers
 * (a whole rule or script dropped), not a full caniuse audit.
 *
 * Usage: node ../../scripts/check-browser-support.mjs <dist dir>...
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

/** CSS features that drop the whole rule / block when unsupported */
const CSS_RULES = [
  { pattern: /@layer\b/, feature: '@layer', since: 'Chrome 99, Safari 15.4' },
  {
    pattern: /@container\b/,
    feature: '@container',
    since: 'Chrome 105, Safari 16',
  },
  { pattern: /@scope\b/, feature: '@scope', since: 'Chrome 118, Safari 17.4' },
  {
    pattern: /@property\b/,
    feature: '@property',
    since: 'Chrome 85, Safari 16.4, Firefox 128',
  },
  {
    pattern: /:has\(/,
    feature: ':has()',
    since: 'Chrome 105, Safari 15.4, Firefox 121',
  },
  {
    pattern: /\bcolor-mix\(/,
    feature: 'color-mix()',
    since: 'Chrome 111, Safari 16.2',
  },
  {
    pattern: /\blight-dark\(/,
    feature: 'light-dark()',
    since: 'Chrome 123, Safari 17.5',
  },
  {
    pattern: /\b(?:oklab|oklch|lab|lch)\(/,
    feature: 'oklab() / lab() colors',
    since: 'Chrome 111, Safari 15',
  },
  {
    pattern: /\((?:min-|max-)?(?:width|height)\s*[<>]=?/,
    feature: 'media range syntax',
    since: 'Chrome 104, Safari 16.4',
  },
  {
    pattern: /(?:^|[\s{;])&[\s.:#[>+~-]/m,
    feature: 'native CSS nesting',
    since: 'Chrome 120, Safari 17.2',
  },
];

/** Selectors that invalidate a whole selector list (outside a forgiving `:where()` / `:is()`) */
const NEW_PSEUDOS = [
  ':user-invalid',
  ':user-valid',
  ':focus-visible',
  ':popover-open',
  ':modal',
];

/** JS APIs that throw when missing */
const JS_RULES = [
  {
    pattern: /\bstructuredClone\(/,
    feature: 'structuredClone()',
    since: 'Chrome 98, Safari 15.4',
  },
  {
    pattern: /\.at\(-?\d/,
    feature: 'Array.prototype.at()',
    since: 'Chrome 92, Safari 15.4',
  },
  {
    pattern: /\bObject\.hasOwn\(/,
    feature: 'Object.hasOwn()',
    since: 'Chrome 93, Safari 15.4',
  },
  {
    pattern: /\.findLast(?:Index)?\(/,
    feature: 'findLast()',
    since: 'Chrome 97, Safari 15.4',
  },
  {
    pattern: /\.to(?:Sorted|Reversed|Spliced)\(/,
    feature: 'change-array-by-copy',
    since: 'Chrome 110, Safari 16',
  },
  {
    pattern: /\bObject\.groupBy\(/,
    feature: 'Object.groupBy()',
    since: 'Chrome 117, Safari 17.4',
  },
  {
    pattern: /\bPromise\.withResolvers\(/,
    feature: 'Promise.withResolvers()',
    since: 'Chrome 119, Safari 17.4',
  },
  {
    pattern: /\bcrypto\.randomUUID\(/,
    feature: 'crypto.randomUUID()',
    since: 'Chrome 92, Safari 15.4',
  },
  {
    pattern: /\bAbortSignal\.timeout\(/,
    feature: 'AbortSignal.timeout()',
    since: 'Chrome 103, Safari 16',
  },
  {
    pattern: /\.showModal\(/,
    feature: '<dialog>.showModal()',
    since: 'Chrome 37, Safari 15.4',
  },
  {
    pattern: /\.(?:show|hide|toggle)Popover\(/,
    feature: 'Popover API',
    since: 'Chrome 114, Safari 17',
  },
  {
    pattern: /\brequestIdleCallback\(/,
    feature: 'requestIdleCallback()',
    since: 'not in Safari',
  },
];

function listFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const file = path.join(dir, name);
    return statSync(file).isDirectory() ? listFiles(file) : [file];
  });
}

// Comments may mention features freely (blanked out, so line numbers stay correct)
const blank = (text) => text.replace(/[^\n]/g, ' ');
const stripComments = (source, isJs) => {
  const withoutBlocks = source.replace(/\/\*[\s\S]*?\*\//g, blank);
  // NOTE: only whole-line `//` comments, so URLs inside strings are never touched
  return isJs ? withoutBlocks.replace(/^\s*\/\/.*$/gm, blank) : withoutBlocks;
};

const lineOf = (source, index) => source.slice(0, index).split('\n').length;

// Top-level selector lists (`a, b {`) that mix a new pseudo-class with other selectors
function* unsafeSelectorLists(css) {
  for (const match of css.matchAll(/([^{};]+)\{/g)) {
    const selector = match[1].trim();
    if (selector.startsWith('@')) continue;

    // commas inside :where() / :is() / :not() don't split the list
    let depth = 0;
    let topLevelCommas = 0;
    for (const char of selector) {
      if (char === '(') depth++;
      else if (char === ')') depth--;
      else if (char === ',' && depth === 0) topLevelCommas++;
    }
    if (!topLevelCommas) continue;

    const pseudo = NEW_PSEUDOS.find((p) => {
      const at = selector.indexOf(p);
      // inside a forgiving :where() / :is() it can't invalidate the outer list
      return at !== -1 && !/:(?:where|is)\([^)]*$/.test(selector.slice(0, at));
    });
    if (pseudo) yield { index: match.index, pseudo };
  }
}

const problems = [];

for (const dir of process.argv.slice(2)) {
  for (const file of listFiles(dir)) {
    const ext = path.extname(file);
    if (!['.css', '.js', '.mjs', '.cjs'].includes(ext)) continue;

    const source = stripComments(readFileSync(file, 'utf8'), ext !== '.css');
    const rules = ext === '.css' ? CSS_RULES : JS_RULES;

    for (const { pattern, feature, since } of rules) {
      const global = new RegExp(
        pattern.source,
        pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g',
      );
      for (const match of source.matchAll(global)) {
        problems.push(
          `${file}:${lineOf(source, match.index)}  ${feature} (needs ${since})`,
        );
      }
    }

    if (ext === '.css') {
      for (const { index, pseudo } of unsafeSelectorLists(source)) {
        problems.push(
          `${file}:${lineOf(source, index)}  ${pseudo} in a selector list (drops the whole rule in older browsers; give it its own rule)`,
        );
      }
    }
  }
}

if (problems.length) {
  console.error(
    `✖ ${problems.length} feature(s) newer than .browserslistrc:\n  ${problems.join('\n  ')}`,
  );
  process.exit(1);
}

console.log('✔ built CSS / JS fits the supported browsers (.browserslistrc)');
