import type { RslibConfig } from '@mainset/builder-rslib';
import { generateReactRslibConfig } from '@mainset/builder-rslib';
import { runtimePathById } from '@mainset/cli/runtime';
import path from 'path';

import { BROWSERSLIST } from '../../scripts/browserslist.mjs';

const srcGlob = (pattern: string) =>
  // NOTE: the {.replace} is required to make the path work on Windows OS
  path.join(runtimePathById.src, pattern).replace(/\\/g, '/');

const generatedConfig = generateReactRslibConfig({
  output: {
    // Oldest supported browsers (root `.browserslistrc`): lowers syntax and prefixes CSS.
    // NOTE: `src/node` runs in Node only (the markdown compiler, the static export), Node 24
    // handles everything the 2021 browsers do, so one target fits both halves
    overrideBrowserslist: BROWSERSLIST,
  },
  source: {
    entry: {
      // NOTE: tests run from source (vitest), they don't ship
      // NOTE: the engine's HTML template ships as a source file, html-webpack-plugin reads it
      index: [
        srcGlob('/**/*'),
        `!${srcGlob('/**/*.test.*')}`,
        `!${srcGlob('/**/*.html')}`,
      ],
    },
  },
}) as RslibConfig;

// NOTE: ESM only. The browser half is consumed by a bundler and the Node half by webpack /
// the `ms-docs` bin, all of which import ESM; a CJS copy would only double the package
const docsKitRslibConfig: RslibConfig = {
  ...generatedConfig,
  lib: generatedConfig.lib.filter((lib) => lib.format === 'esm'),
};

export default docsKitRslibConfig;
