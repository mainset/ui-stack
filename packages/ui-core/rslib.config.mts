import { generateWebPackageRslibConfig } from '@mainset/builder-rslib';
import { runtimePathById } from '@mainset/cli/runtime';
import path from 'path';

import { BROWSERSLIST } from '../../scripts/browserslist.mjs';

const srcGlob = (pattern: string) =>
  // NOTE: the {.replace} is required to make the path work on Windows OS
  path.join(runtimePathById.src, pattern).replace(/\\/g, '/');

const webPackageRslibConfig = generateWebPackageRslibConfig({
  output: {
    // Oldest supported browsers (root `.browserslistrc`): lowers syntax and prefixes CSS
    overrideBrowserslist: BROWSERSLIST,
  },
  source: {
    entry: {
      // NOTE: Sass partials ({_*.scss}) are inlined by the stylesheets that `@use` them,
      // so compiling them standalone would only ship orphan CSS files
      index: [srcGlob('/**/*'), `!${srcGlob('/**/_*.scss')}`],
    },
  },
});

export default webPackageRslibConfig;
