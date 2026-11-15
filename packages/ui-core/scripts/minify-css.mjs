/**
 * Writes `dist/esm/styles/index.min.css` for apps without a bundler (`<link>`, CDN, server templates).
 * Every other built stylesheet stays unminified on purpose: an app's bundler minifies those itself,
 * and readable package CSS is easier to debug.
 * Targets the supported browsers (root `.browserslistrc`), so no newer syntax is introduced.
 *
 * Usage: node ./scripts/minify-css.mjs
 */
import browserslist from 'browserslist';
import { browserslistToTargets, transform } from 'lightningcss';
import { readFileSync, writeFileSync } from 'node:fs';

import { BROWSERSLIST } from '../../../scripts/browserslist.mjs';

const source = new URL('../dist/esm/styles/index.css', import.meta.url);
const target = new URL('../dist/esm/styles/index.min.css', import.meta.url);

const { code } = transform({
  filename: 'index.css',
  code: readFileSync(source),
  minify: true,
  targets: browserslistToTargets(browserslist(BROWSERSLIST)),
});

writeFileSync(target, code);

console.log(
  `✔ styles/index.min.css: ${(code.length / 1024).toFixed(1)} KiB (from ${(readFileSync(source).length / 1024).toFixed(1)} KiB)`,
);
