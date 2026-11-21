import { generateReactRslibConfig } from '@mainset/builder-rslib';
import { runtimePathById } from '@mainset/cli/runtime';
import path from 'path';

import { BROWSERSLIST } from '../../scripts/browserslist.mjs';

const srcGlob = (pattern: string) =>
  // NOTE: the {.replace} is required to make the path work on Windows OS
  path.join(runtimePathById.src, pattern).replace(/\\/g, '/');

const reactRslibConfig = generateReactRslibConfig({
  output: {
    // Oldest supported browsers (root `.browserslistrc`): lowers syntax and prefixes CSS
    overrideBrowserslist: BROWSERSLIST,
  },
  source: {
    entry: {
      // NOTE: the preset's bundleless entry, minus tests (`__tests__/`, they run from source with vitest)
      index: [srcGlob('/**/*'), `!${srcGlob('/**/__tests__/**')}`],
    },
    // TODO: exclude .md files from build
    assetsInclude: /\.md$/,
  },
});

export default reactRslibConfig;
