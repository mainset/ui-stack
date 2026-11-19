'use client';

import { Alert, Breadcrumb } from '@mainset/react/components';
import { Heading, Text, Link as TextLink } from '@mainset/react/elements';
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

      <Breadcrumb brcLabel={ui.breadcrumb} className="msd-article__breadcrumb">
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

      <header className="msd-article__header">
        <Heading hAs="h1" txtSize="display-sm" txtWrap="balance">
          {title}
        </Heading>
        {frontmatter.description && (
          <Text txtAs="p" txtVariant="lead" txtColor="muted" txtWrap="pretty">
            {frontmatter.description}
          </Text>
        )}
      </header>

      {page.isFallback && (
        <Alert srfTheme="info" className="msd-article__notice">
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

      <footer className="msd-article__footer">
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
          <nav aria-label={ui.pageNavigation} className="msd-pager">
            {previous && (
              <Link
                to={pagePath(previous.key)}
                rel="prev"
                className="msd-pager__link msd-pager__link--previous"
              >
                <span className="msd-pager__direction">
                  {/* NOTE: ‹ › are mirrored by the bidi algorithm, so they point the right
                      way in right-to-left sections too */}
                  <span aria-hidden="true">‹</span> {ui.previousPage}
                </span>
                <span className="msd-pager__title">{previous.meta.title}</span>
              </Link>
            )}
            {next && (
              <Link
                to={pagePath(next.key)}
                rel="next"
                className="msd-pager__link msd-pager__link--next"
              >
                <span className="msd-pager__direction">
                  {ui.nextPage} <span aria-hidden="true">›</span>
                </span>
                <span className="msd-pager__title">{next.meta.title}</span>
              </Link>
            )}
          </nav>
        )}
      </footer>
    </article>
  );
}

export { DocsPageView };
