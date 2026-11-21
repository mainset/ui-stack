'use client';

import React from 'react';

import { DOCS_MAIN__ID } from './DocsShell.js';
import './docs-centered-main.scss';

/**
 * The page's `<main>`, its content centered in the screen below the header: a home page, the
 * not-found page. Inside `<DocsShell>`.
 */
function DocsCenteredMain({ children }: { children: React.ReactNode }) {
  return (
    <main id={DOCS_MAIN__ID} className="msd-centered-main">
      {children}
    </main>
  );
}

export { DocsCenteredMain };
