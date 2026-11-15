import { generateReactRslibConfig } from '@mainset/builder-rslib';
import { runtimePathById } from '@mainset/cli/runtime';
import path from 'path';

import { BROWSERSLIST } from '../../scripts/browserslist.mjs';

const reactRslibConfig = generateReactRslibConfig({
  output: {
    // Oldest supported browsers (root `.browserslistrc`): lowers syntax and prefixes CSS
    overrideBrowserslist: BROWSERSLIST,
  },
  source: {
    // entry: {
    //   index: path.join(runtimePathById.src, 'elements/index.mts'),
    // },
    // TODO: exclude .md files from build
    assetsInclude: /\.md$/,
  },
});

export default reactRslibConfig;
