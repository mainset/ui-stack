import {
  DocsCenteredMain,
  DocsHead,
  DocsShell,
  sectionPagePath,
  useDocs,
  useTranslation,
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
import { Link } from 'react-router';

/**
 * The home page: a centered welcome with "Read the docs". Its texts are the `home` keys of
 * `src/i18n/locales/<locale>/translation.json`.
 */
function HomePage() {
  const { t } = useTranslation();
  const { site, locale, ui } = useDocs();
  const [firstSection] = site.sections;

  return (
    <DocsShell>
      <DocsHead description={t('home.description')} />

      <DocsCenteredMain>
        <Container ctnSize="base">
          <Stack layAlign="center" layGapSize="lg">
            <Text txtAs="p" txtVariant="overline" txtColor="primary">
              {t('home.overline')}
            </Text>
            <Heading
              hAs="h1"
              txtSize="display-base"
              txtAlign="center"
              txtWrap="balance"
            >
              {t('home.title')}
            </Heading>
            <Text
              txtAs="p"
              txtVariant="lead"
              txtColor="muted"
              txtAlign="center"
              txtWrap="pretty"
            >
              {t('home.lead')}
            </Text>

            <HStack layGapSize="sm" flxWrap="wrap" layJustify="center">
              {firstSection && (
                <Button
                  btnAs={Link}
                  to={sectionPagePath(site, firstSection, locale)}
                  srfVariant="solid"
                  btnSize="lg"
                >
                  {ui.readTheDocs}
                </Button>
              )}
              {site.repositoryUrl && (
                <Button
                  btnAs="a"
                  href={site.repositoryUrl}
                  srfTheme="base"
                  srfVariant="outlined"
                  btnSize="lg"
                >
                  {ui.viewSource}
                </Button>
              )}
            </HStack>
          </Stack>
        </Container>
      </DocsCenteredMain>
    </DocsShell>
  );
}

export { HomePage };
