import { generateReactRslibConfig } from '@mainset/builder-rslib';

import { BROWSERSLIST } from '../../scripts/browserslist.mjs';

const reactRslibConfig = generateReactRslibConfig({
  output: {
    // Oldest supported browsers (root `.browserslistrc`): lowers syntax and prefixes CSS
    overrideBrowserslist: BROWSERSLIST,
  },
  source: {
    // TODO: exclude .md files from build
    assetsInclude: /\.md$/,
  },
});

export default reactRslibConfig;
