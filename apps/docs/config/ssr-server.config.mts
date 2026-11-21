import { runtimePathById } from '@mainset/cli/runtime';
import type { SSRConfigParams } from '@mainset/cli/ssr-server';
import { applyDocumentHead } from '@mainset/docs-kit';
import fs from 'fs';
import path from 'path';
import ReactDOMServer from 'react-dom/server';

import provideServerReactApp from '../src/app.server';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import proxyConfigByPath from './proxy.config.mjs';

const APP_ROOT__PLACEHOLDER = '<div id="ui-stack--docs"></div>';

const ssrServerConfig: SSRConfigParams = {
  serveStatics: [
    {
      rootPath: path.join(runtimePathById.dist, 'public'),
    },
  ],
  proxyConfigByPath,
  renderSSRContentByPath: {
    // NOTE: also what `ms-docs export` calls for every page of the static site
    '/{*any}': async ({ fullUrl }) => {
      const template = await fs.promises.readFile(
        path.join(runtimePathById.dist, 'public', 'server.html'),
        'utf8',
      );
      const { element, head, status } = await provideServerReactApp({
        fullUrl,
      });
      // NOTE: rendered first: the page's <head> is collected while it renders
      const appHtml = ReactDOMServer.renderToString(element);

      return {
        html: applyDocumentHead(template, head).replace(
          APP_ROOT__PLACEHOLDER,
          `<div id="ui-stack--docs">${appHtml}</div>`,
        ),
        status,
      };
    },
  },
};

export default ssrServerConfig;
