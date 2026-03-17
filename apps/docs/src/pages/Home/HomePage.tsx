import React from 'react';

import { Layout } from '../../components';
import { Hero } from './home-page.components';

const HomePage = () => {
  return (
    <div>
      <Layout.Header />
      <main>
        <Hero />
      </main>
    </div>
  );
};

export { HomePage };
