import { runtimePathById } from '@mainset/cli/runtime';
import type { SSRConfigParams } from '@mainset/cli/ssr-server';
import fs from 'fs';
import path from 'path';
import ReactDOMServer from 'react-dom/server';

import { applyDocumentHead } from '../../index.mjs';
import { APP_ROOT__ID } from './app.constants.js';
import provideServerReactApp from './app.server.js';

const APP_ROOT__PLACEHOLDER = `<div id="${APP_ROOT__ID}"></div>`;

const ssrServerConfig: SSRConfigParams = {
  serveStatics: [
    {
      rootPath: path.join(runtimePathById.dist, 'public'),
    },
  ],
  renderSSRContentByPath: {
    // NOTE: also what `ms-docs export` calls for every page of the static site
    async '/{*any}'({ fullUrl }) {
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
          `<div id="${APP_ROOT__ID}">${appHtml}</div>`,
        ),
        status,
      };
    },
  },
};

export default ssrServerConfig;
