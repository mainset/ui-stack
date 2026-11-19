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
    // NOTE: the OFL requires the licence to travel with the fonts, beside the emitted files
    copy: [
      { from: 'src/styles/fonts/OFL-*.txt', to: 'static/font/[name][ext]' },
    ],
  },
  source: {
    entry: {
      // NOTE: Sass partials ({_*.scss}) are inlined by the stylesheets that `@use` them,
      // so compiling them standalone would only ship orphan CSS files
      // NOTE: tests run from source (vitest), they don't ship
      // NOTE: font files ship as the assets `fonts.scss` points at, not as modules of their own
      index: [
        srcGlob('/**/*'),
        `!${srcGlob('/**/_*.scss')}`,
        `!${srcGlob('/**/*.test.*')}`,
        `!${srcGlob('/styles/fonts/*')}`,
      ],
    },
  },
});

export default webPackageRslibConfig;
