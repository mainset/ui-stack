import { generateReactRslibConfig } from '@mainset/builder-rslib';
import { runtimePathById } from '@mainset/cli/runtime';
import path from 'path';

const reactRslibConfig = generateReactRslibConfig({
  source: {
    // entry: {
    //   index: path.join(runtimePathById.src, 'ui-elements/index.mts'),
    // },
    // TODO: exclude .md files from build
    assetsInclude: /\.md$/,
  },
});

export default reactRslibConfig;
