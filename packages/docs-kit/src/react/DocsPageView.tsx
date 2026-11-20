'use client';

import { Alert, Breadcrumb } from '@mainset/react/components';
import {
  CardBasic,
  Flex,
  Grid,
  Heading,
  Hr,
  Stack,
  Text,
  Link as TextLink,
} from '@mainset/react/elements';
import { spacingRecipe } from '@mainset/ui-core';
import React from 'react';
import { Link, useHref } from 'react-router';

import { resolveLocalized, sectionPagePath } from '../core/locale-path.mjs';
import { findNavTrail, findSiblingPages } from '../core/nav-tree.mjs';
import { readPageContent, resolvePageLinks } from '../core/page-content.mjs';
import { DocsArticleContent } from './DocsArticleContent.js';
import { useDocs } from './docs-context.js';
import { DocsHead } from './docs-head.js';
import { useDocsPage } from './docs-routes.js';
import { PencilIcon } from './icons.js';

interface PagerCardProps {
  to: string;
  rel: 'prev' | 'next';
  direction: React.ReactNode;
  title: string;
}

/** Previous / next: a card that is a link as a whole (one real link inside, its title) */
function PagerCard({ to, rel, direction, title }: PagerCardProps) {
  const isNext = rel === 'next';

  return (
    <CardBasic
      srfTheme="muted"
      srfVariant="outlined"
      srfHover="border"
      crdIsInteractive
    >
      <Stack layGapSize="xs" layAlign={isNext ? 'flex-end' : 'flex-start'}>
        <Text txtSize="sm" txtColor="muted">
          {direction}
        </Text>
        <TextLink
          lnkAs={Link}
          to={to}
          rel={rel}
          lnkIsStretched
          lnkUnderline="none"
          txtColor="primary"
          txtWeight="semibold"
          // NOTE: a flex item is a block, so a long title wraps aligned to its side
          txtAlign={isNext ? 'end' : undefined}
        >
          {title}
        </TextLink>
      </Stack>
    </CardBasic>
  );
}

/** A docs page: breadcrumb, title, the compiled content, edit link, previous / next */
function DocsPageView() {
  const page = useDocsPage();
  const { site, locale, ui, siteTitle } = useDocs();
  const section = site.sections.find(({ id }) => id === page?.sectionId);
  const sectionPath = section ? sectionPagePath(site, section, locale) : '/';
  const sectionHref = useHref(sectionPath);
  const content = page ? readPageContent(page) : undefined;
  const html = React.useMemo(
    () => (content ? resolvePageLinks(content.html, sectionHref) : ''),
    [content, sectionHref],
  );

  if (!page || !section) return null;

  const index = section.getLocaleIndex(locale);
  const sectionLabel = resolveLocalized(
    section.label,
    locale,
    site.defaultLocale,
  );
  const trail = findNavTrail(index.nav, page.key);
  const { previous, next } = findSiblingPages(index, page);
  const pagePath = (key: string) => sectionPagePath(site, section, locale, key);
  const { title, description, frontmatter } = page.meta;

  return (
    <article className="msd-article">
      <DocsHead
        title={`${title} | ${sectionLabel} | ${siteTitle}`}
        description={description}
      />

      <Breadcrumb
        brcLabel={ui.breadcrumb}
        className={spacingRecipe({
          spcType: 'mb',
          spcScale: 'component',
          spcSize: 'sm',
        })}
      >
        <Breadcrumb.Item brcAs={Link} to={sectionPath}>
          {sectionLabel}
        </Breadcrumb.Item>
        {trail.map((category) =>
          index.pageByKey.has(category.key) && category.key !== page.key ? (
            <Breadcrumb.Item
              key={category.key}
              brcAs={Link}
              to={pagePath(category.key)}
            >
              {category.label}
            </Breadcrumb.Item>
          ) : (
            <Breadcrumb.Item key={category.key}>
              {category.label}
            </Breadcrumb.Item>
          ),
        )}
        <Breadcrumb.Item brcIsCurrent>{page.label}</Breadcrumb.Item>
      </Breadcrumb>

      <Stack
        stkAs="header"
        layGapSize="xs"
        spcType="mb"
        spcScale="block"
        spcSize="xs"
      >
        <Heading hAs="h1" txtSize="display-sm" txtWrap="balance">
          {title}
        </Heading>
        {frontmatter.description && (
          <Text txtAs="p" txtVariant="lead" txtColor="muted" txtWrap="pretty">
            {frontmatter.description}
          </Text>
        )}
      </Stack>

      {page.isFallback && (
        <Alert
          srfTheme="info"
          className={spacingRecipe({
            spcType: 'mb',
            spcScale: 'component',
            spcSize: 'lg',
          })}
        >
          {ui.notTranslated}
        </Alert>
      )}

      {content ? (
        <DocsArticleContent
          html={html}
          lang={
            page.isFallback ? site.locales[page.contentLocale]?.lang : undefined
          }
        />
      ) : (
        <p role="status">{ui.loading}</p>
      )}

      <Stack
        stkAs="footer"
        layGapSize="base"
        spcType="mt"
        spcScale="block"
        spcSize="base"
      >
        <Hr className="msd-divider" />

        {section.editUrl && (
          <TextLink
            href={`${section.editUrl}${page.filePath}`}
            lnkUnderline="hover"
            txtColor="muted"
            className="msd-article__edit"
          >
            <PencilIcon /> {ui.editPage}
          </TextLink>
        )}

        {(previous || next) && (
          <nav aria-label={ui.pageNavigation}>
            <Grid grdColumns={{ base: 1, sm: 2 }} layGapSize="sm">
              {previous ? (
                <PagerCard
                  to={pagePath(previous.key)}
                  rel="prev"
                  // NOTE: ‹ › are mirrored by the bidi algorithm, so they point the right way
                  // in right-to-left sections too
                  direction={
                    <>
                      <span aria-hidden="true">‹</span> {ui.previousPage}
                    </>
                  }
                  title={previous.meta.title}
                />
              ) : (
                // NOTE: holds the first column, so "next" stays on the end side
                <Flex flxDisplay={{ base: 'none', sm: 'flex' }} aria-hidden />
              )}
              {next && (
                <PagerCard
                  to={pagePath(next.key)}
                  rel="next"
                  direction={
                    <>
                      {ui.nextPage} <span aria-hidden="true">›</span>
                    </>
                  }
                  title={next.meta.title}
                />
              )}
            </Grid>
          </nav>
        )}
      </Stack>
    </article>
  );
}

export { DocsPageView };
