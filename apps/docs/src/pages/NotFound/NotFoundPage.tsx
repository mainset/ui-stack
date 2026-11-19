import {
  DOCS_MAIN__ID,
  DocsHead,
  DocsShell,
  localeHomePath,
  useDocs,
} from '@mainset/docs-kit';
import { Button } from '@mainset/react/components';
import { Container, Heading, Stack, Text } from '@mainset/react/elements';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import '../Home/home-page.scss';

// NOTE: rendered by `createNotFoundRoute`, which answers with a real 404 status (and the
// static export writes it to `404.html`, which static hosts serve for unknown URLs)
const NotFoundPage = () => {
  const { t } = useTranslation();
  const { site, locale, siteTitle } = useDocs();

  return (
    <DocsShell>
      <DocsHead title={`${t('page.notFound.title')} | ${siteTitle}`} />

      <main id={DOCS_MAIN__ID} className="docs-home">
        <Container ctnSize="sm">
          <Stack layAlign="center" layGapSize="base">
            <Text txtAs="p" txtVariant="overline" txtColor="primary">
              404
            </Text>
            <Heading hAs="h1" txtSize="display-sm" txtAlign="center">
              {t('page.notFound.title')}
            </Heading>
            <Text txtAs="p" txtColor="muted" txtAlign="center">
              {t('page.notFound.text')}
            </Text>
            <Button
              btnAs={Link}
              to={localeHomePath(site, locale)}
              srfVariant="soft"
            >
              {t('page.notFound.backHome')}
            </Button>
          </Stack>
        </Container>
      </main>
    </DocsShell>
  );
};

export { NotFoundPage };
