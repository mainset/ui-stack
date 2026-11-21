import type { DocsAppRoutes } from '@mainset/docs-kit';
import React from 'react';

import { HomePage } from './pages/home/home.page';

// The site's own pages, in every locale (`/about`, `/uk/about`): the home page is the index
// route. The docs pages (`src/pages/<section>/content`) and the not-found page come after them.
const routes: DocsAppRoutes = [{ index: true, element: <HomePage /> }];

export default routes;
