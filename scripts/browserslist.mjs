// The browser targets from the root `.browserslistrc`, as an array for build configs
// (rslib ignores `.browserslistrc` and builds for `esnext` unless told otherwise).
import { readFileSync } from 'node:fs';

const BROWSERSLIST = readFileSync(
  new URL('../.browserslistrc', import.meta.url),
  'utf8',
)
  .split('\n')
  .map((line) => line.replace(/#.*/, '').trim())
  .filter(Boolean);

export { BROWSERSLIST };
