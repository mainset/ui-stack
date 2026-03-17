import { MainSetProvider } from '@mainset/react/containers';
import React from 'react';

import { HomePage } from './pages';

const BrowserReactApp = (
  <MainSetProvider>
    <HomePage />
  </MainSetProvider>
);

export default BrowserReactApp;
