'use client';

import { Button } from '@mainset/react/components';
import { Container, Heading, Stack, Text } from '@mainset/react/elements';
import React from 'react';
import { Link } from 'react-router';

import { localeHomePath } from '../core/locale-path.mjs';
import { DOCS_MAIN__ID, DocsShell } from '../react/DocsShell.js';
import { useDocs } from '../react/docs-context.js';
import { DocsHead } from '../react/docs-head.js';
import './docs-pages.scss';

/**
 * The default not-found page. Rendered by the not-found route, which answers with a real 404
 * status (and the static export writes it to `404.html`, which static hosts serve for unknown
 * URLs).
 */
function DocsNotFoundPage() {
  const { site, locale, ui, siteTitle } = useDocs();

  return (
    <DocsShell>
      <DocsHead title={`${ui.notFoundTitle} | ${siteTitle}`} />

      <main id={DOCS_MAIN__ID} className="msd-centered-page">
        <Container ctnSize="sm">
          <Stack layAlign="center" layGapSize="base">
            <Text txtAs="p" txtVariant="overline" txtColor="primary">
              404
            </Text>
            <Heading hAs="h1" txtSize="display-sm" txtAlign="center">
              {ui.notFoundTitle}
            </Heading>
            <Text txtAs="p" txtColor="muted" txtAlign="center">
              {ui.notFoundText}
            </Text>
            <Button
              btnAs={Link}
              to={localeHomePath(site, locale)}
              srfVariant="soft"
            >
              {ui.backHome}
            </Button>
          </Stack>
        </Container>
      </main>
    </DocsShell>
  );
}

export { DocsNotFoundPage };
