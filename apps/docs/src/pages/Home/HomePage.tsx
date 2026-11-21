import {
  DOCS_MAIN__ID,
  DocsHead,
  DocsShell,
  sectionPagePath,
  useDocs,
} from '@mainset/docs-kit';
import { Button } from '@mainset/react/components';
import {
  Container,
  HStack,
  Heading,
  Stack,
  Text,
} from '@mainset/react/elements';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import './home-page.scss';

const HomePage = () => {
  const { t } = useTranslation();
  const { site, locale } = useDocs();
  const [firstSection] = site.sections;

  return (
    <DocsShell>
      <DocsHead description={t('page.home.meta.description')} />

      <main id={DOCS_MAIN__ID} className="docs-home">
        <Container ctnSize="base">
          <Stack layAlign="center" layGapSize="lg">
            <Text txtAs="p" txtVariant="overline" txtColor="primary">
              {t('page.home.overline')}
            </Text>
            <Heading
              hAs="h1"
              txtSize="display-base"
              txtAlign="center"
              txtWrap="balance"
            >
              {t('page.home.title')}
            </Heading>
            <Text
              txtAs="p"
              txtVariant="lead"
              txtColor="muted"
              txtAlign="center"
              txtWrap="pretty"
            >
              {t('page.home.lead')}
            </Text>

            <HStack layGapSize="sm" flxWrap="wrap" layJustify="center">
              <Button
                btnAs={Link}
                to={sectionPagePath(site, firstSection, locale)}
                srfVariant="solid"
                btnSize="lg"
              >
                {t('page.home.readTheDocs')}
              </Button>
              {site.repositoryUrl && (
                <Button
                  btnAs="a"
                  href={site.repositoryUrl}
                  srfTheme="base"
                  srfVariant="outlined"
                  btnSize="lg"
                >
                  {t('page.home.sourceCode')}
                </Button>
              )}
            </HStack>
          </Stack>
        </Container>
      </main>
    </DocsShell>
  );
};

export { HomePage };
