'use client';

import { Button } from '@mainset/react/components';
import { Drawer } from '@mainset/react/containers';
import { VisuallyHidden } from '@mainset/react/elements';
import React from 'react';
import { Link, useLocation } from 'react-router';

import {
  localeHomePath,
  resolveLocalized,
  sectionPagePath,
} from '../core/locale-path.mjs';
import { DocsColorSchemeMenu } from './DocsColorSchemeMenu.js';
import { DocsLocaleMenu } from './DocsLocaleMenu.js';
import { DocsSearch } from './DocsSearch.js';
import { useDocs } from './docs-context.js';
import './docs-shell.scss';
import { GitHubIcon, MenuIcon } from './icons.js';

/** The `id` of the page's `<main>`: the skip link's target */
const DOCS_MAIN__ID = 'msd-main';

/** Links to every section, the current one marked */
function DocsSectionLinks({ className }: { className?: string }) {
  const { site, locale, ui } = useDocs();
  const { pathname } = useLocation();

  return (
    <nav aria-label={ui.sectionNavigation} className={className}>
      <ul className="msd-section-links">
        {site.sections.map((section) => {
          const sectionPath = sectionPagePath(site, section, locale);
          const isCurrent =
            pathname === sectionPath || pathname.startsWith(`${sectionPath}/`);

          return (
            <li key={section.id}>
              <Link
                to={sectionPath}
                className="msd-section-links__link"
                aria-current={isCurrent ? 'true' : undefined}
              >
                {resolveLocalized(section.label, locale, site.defaultLocale)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

interface DocsHeaderProps {
  /** Shows the menu button (below the sidebar breakpoint) */
  onOpenNavigation?: () => void;
}

function DocsHeader({ onOpenNavigation }: DocsHeaderProps) {
  const { site, locale, ui, siteTitle, chrome } = useDocs();

  return (
    <header className="msd-header">
      <div className="msd-header__inner">
        {onOpenNavigation && (
          <Button
            className="msd-header__menu"
            btnIsIcon
            srfTheme="muted"
            srfVariant="ghost"
            aria-label={ui.openMenu}
            onClick={onOpenNavigation}
          >
            <MenuIcon />
          </Button>
        )}

        <Link to={localeHomePath(site, locale)} className="msd-header__brand">
          {chrome.logo ?? siteTitle}
        </Link>

        <DocsSectionLinks className="msd-header__sections" />

        <div className="msd-header__actions">
          <DocsSearch />
          <DocsLocaleMenu />
          <DocsColorSchemeMenu />
          {site.repositoryUrl && (
            <Button
              btnAs="a"
              href={site.repositoryUrl}
              btnIsIcon
              srfTheme="muted"
              srfVariant="ghost"
              aria-label={ui.repository}
            >
              <GitHubIcon />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

interface DocsShellProps {
  /** Shown in the menu drawer on small screens, under the section links: the sidebar */
  navigation?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * The frame of every page: skip link, header (search, language, color scheme) and the menu
 * drawer for small screens. Render your own pages in it too, with a `<main id={DOCS_MAIN__ID}>`.
 */
function DocsShell({ navigation, children }: DocsShellProps) {
  const { ui } = useDocs();
  const { pathname } = useLocation();
  const [isNavigationOpen, setIsNavigationOpen] = React.useState(false);

  // NOTE: a link in the drawer navigates, the drawer then has done its job
  React.useEffect(() => {
    setIsNavigationOpen(false);
  }, [pathname]);

  return (
    <div className="msd-shell">
      <VisuallyHidden
        vhAs="a"
        vhIsFocusable
        href={`#${DOCS_MAIN__ID}`}
        className="msd-shell__skip-link"
      >
        {ui.skipToContent}
      </VisuallyHidden>

      <DocsHeader onOpenNavigation={() => setIsNavigationOpen(true)} />

      {children}

      <Drawer
        drwIsOpen={isNavigationOpen}
        drwOnOpenChange={setIsNavigationOpen}
        drwPlacement="start"
        drwSize="sm"
      >
        <Drawer.Header>
          <Drawer.Title>{ui.menuTitle}</Drawer.Title>
          <Drawer.CloseButton />
        </Drawer.Header>
        <Drawer.Body>
          <DocsSectionLinks className="msd-shell__drawer-sections" />
          {navigation}
        </Drawer.Body>
      </Drawer>
    </div>
  );
}

export { DOCS_MAIN__ID, DocsHeader, DocsSectionLinks, DocsShell };
export type { DocsHeaderProps, DocsShellProps };
