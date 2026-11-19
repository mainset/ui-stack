'use client';

import { useActiveSectionId } from '@mainset/react/hooks';
import React from 'react';
import { Outlet } from 'react-router';

import type { DocsPage } from '../core/docs.types.mjs';
import { sectionPagePath } from '../core/locale-path.mjs';
import { DOCS_MAIN__ID, DocsShell } from './DocsShell.js';
import { DocsSidebar } from './DocsSidebar.js';
import { DocsToc, DocsTocDisclosure } from './DocsToc.js';
import { useDocs } from './docs-context.js';
import './docs-layout.scss';
import { useDocsPage } from './docs-routes.js';

const NO_HEADINGS: never[] = [];

/**
 * The frame of a section's pages: the sidebar (start), the page (`<Outlet />`), "On this page"
 * (end). One scroll-spy feeds both the sidebar's anchors and "On this page".
 */
function DocsSectionLayout({ sectionId }: { sectionId: string }) {
  const { site, locale, ui } = useDocs();
  const section = site.sections.find(({ id }) => id === sectionId);

  if (!section) {
    throw new Error(`[docs-kit] no section "${sectionId}" in the site`);
  }

  const { nav } = section.getLocaleIndex(locale);
  const page = useDocsPage();
  const headings =
    page && page.meta.frontmatter.toc !== false
      ? page.meta.headings
      : NO_HEADINGS;
  const headingIds = React.useMemo(
    () => headings.map(({ id }) => id),
    [headings],
  );
  const activeHeadingId = useActiveSectionId(headingIds);

  const getPagePath = React.useCallback(
    (navPage: DocsPage) => sectionPagePath(site, section, locale, navPage.key),
    [site, section, locale],
  );

  const sidebar = (
    <DocsSidebar
      items={nav}
      currentPageKey={page?.key}
      activeHeadingId={activeHeadingId}
      getPagePath={getPagePath}
      label={ui.pageNavigation}
    />
  );

  return (
    <DocsShell navigation={sidebar}>
      <div className="msd-layout">
        <aside className="msd-layout__sidebar">{sidebar}</aside>

        <main id={DOCS_MAIN__ID} className="msd-layout__main" tabIndex={-1}>
          {headings.length > 0 && (
            <DocsTocDisclosure
              headings={headings}
              activeHeadingId={activeHeadingId}
              label={ui.onThisPage}
            />
          )}
          <Outlet />
        </main>

        <aside className="msd-layout__toc">
          {headings.length > 0 && (
            <DocsToc
              headings={headings}
              activeHeadingId={activeHeadingId}
              label={ui.onThisPage}
            />
          )}
        </aside>
      </div>
    </DocsShell>
  );
}

export { DocsSectionLayout };
