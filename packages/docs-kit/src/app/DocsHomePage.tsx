'use client';

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

import { resolveLocalized, sectionPagePath } from '../core/locale-path.mjs';
import { DOCS_MAIN__ID, DocsShell } from '../react/DocsShell.js';
import { useDocs } from '../react/docs-context.js';
import { DocsHead } from '../react/docs-head.js';
import './docs-pages.scss';

/**
 * The default home page: a centered welcome with "Read the docs". Its texts are the keys
 * `home.overline`, `home.title` (default: the site title), `home.lead` and `home.description`
 * (the page's `<meta>`, default: the lead) of `src/i18n/locales/<locale>/translation.json`.
 */
function DocsHomePage() {
  const { t, i18n } = useTranslation();
  const { site, locale, ui } = useDocs();
  const [firstSection] = site.sections;
  const text = (key: string) => (i18n.exists(key) ? t(key) : undefined);
  const lead = text('home.lead');

  return (
    <DocsShell>
      <DocsHead description={text('home.description') ?? lead} />

      <main id={DOCS_MAIN__ID} className="msd-centered-page">
        <Container ctnSize="base">
          <Stack layAlign="center" layGapSize="lg">
            {text('home.overline') && (
              <Text txtAs="p" txtVariant="overline" txtColor="primary">
                {text('home.overline')}
              </Text>
            )}
            <Heading
              hAs="h1"
              txtSize="display-base"
              txtAlign="center"
              txtWrap="balance"
            >
              {text('home.title') ??
                resolveLocalized(site.title, locale, site.defaultLocale)}
            </Heading>
            {lead && (
              <Text
                txtAs="p"
                txtVariant="lead"
                txtColor="muted"
                txtAlign="center"
                txtWrap="pretty"
              >
                {lead}
              </Text>
            )}

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
      </main>
    </DocsShell>
  );
}

export { DocsHomePage };
