'use client';

import { Button } from '@mainset/react/components';
import { Dialog } from '@mainset/react/containers';
import { Input, Text } from '@mainset/react/elements';
import { useIsClient } from '@mainset/react/hooks';
import React from 'react';
import { useNavigate } from 'react-router';

import type { DocsSite } from '../core/docs.types.mjs';
import { resolveLocalized, sectionPagePath } from '../core/locale-path.mjs';
import { findNavTrail } from '../core/nav-tree.mjs';
import { useDocs } from './docs-context.js';
import './docs-search.scss';
import { SearchIcon } from './icons.js';

// Quick navigation over every page title and heading of the locale. Page meta is eager (it
// feeds the sidebar), so the index needs no build step and no request. Full-text search of the
// page bodies is a job for a static index (e.g. Pagefind over the exported HTML).

interface SearchEntry {
  id: string;
  title: string;
  /** Where it is: the section and categories of a page, the page of a heading */
  context: string;
  href: string;
  isHeading: boolean;
  /** title + context, lowercased, without diacritics */
  haystack: string;
}

const RESULTS__MAX_COUNT = 30;

const normalize = (text: string) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function buildSearchEntries(site: DocsSite, locale: string): SearchEntry[] {
  return site.sections.flatMap((section) => {
    const { nav, pages } = section.getLocaleIndex(locale);
    const sectionLabel = resolveLocalized(
      section.label,
      locale,
      site.defaultLocale,
    );

    return pages
      .filter((page) => !page.isHidden)
      .flatMap((page) => {
        const href = sectionPagePath(site, section, locale, page.key);
        const trail = findNavTrail(nav, page.key).map(({ label }) => label);
        const pageContext = [sectionLabel, ...trail].join(' › ');
        const pageEntry: SearchEntry = {
          id: `${section.id}:${page.key}`,
          title: page.meta.title,
          context: pageContext,
          href,
          isHeading: false,
          haystack: normalize(`${page.meta.title} ${pageContext}`),
        };
        const headingEntries = page.meta.headings.map(
          (heading): SearchEntry => ({
            id: `${section.id}:${page.key}#${heading.id}`,
            title: heading.text,
            context: `${pageContext} › ${page.meta.title}`,
            href: `${href}#${heading.id}`,
            isHeading: true,
            haystack: normalize(`${heading.text} ${page.meta.title}`),
          }),
        );

        return [pageEntry, ...headingEntries];
      });
  });
}

function searchEntries(entries: SearchEntry[], query: string): SearchEntry[] {
  const words = normalize(query).split(/\s+/).filter(Boolean);

  if (words.length === 0) return [];

  const phrase = words.join(' ');

  return entries
    .filter(({ haystack }) => words.every((word) => haystack.includes(word)))
    .map((entry) => {
      const title = normalize(entry.title);
      // A title that starts with the query, then one that holds it, then a match elsewhere
      const rank = title.startsWith(phrase)
        ? 0
        : title.includes(phrase)
          ? 1
          : 2;

      return { entry, rank: rank * 2 + (entry.isHeading ? 1 : 0) };
    })
    .sort((a, b) => a.rank - b.rank)
    .slice(0, RESULTS__MAX_COUNT)
    .map(({ entry }) => entry);
}

const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));

function DocsSearch() {
  const { site, locale, ui } = useDocs();
  const navigate = useNavigate();
  const isClient = useIsClient();
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(0);
  const listId = React.useId();

  const entries = React.useMemo(
    () => (isOpen ? buildSearchEntries(site, locale) : []),
    [isOpen, site, locale],
  );
  const results = React.useMemo(
    () => searchEntries(entries, query),
    [entries, query],
  );

  // ⌘K / Ctrl+K anywhere, `/` outside text fields
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isShortcut =
        (event.key === 'k' && (event.metaKey || event.ctrlKey)) ||
        (event.key === '/' && !isTypingTarget(event.target));

      if (isShortcut) {
        event.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const changeOpen = (nextIsOpen: boolean) => {
    setIsOpen(nextIsOpen);
    if (!nextIsOpen) {
      setQuery('');
      setActiveIndex(0);
    }
  };

  const openResult = (entry: SearchEntry) => {
    changeOpen(false);
    navigate(entry.href);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;

      setActiveIndex((index) =>
        results.length ? (index + step + results.length) % results.length : 0,
      );
    } else if (event.key === 'Enter' && results[activeIndex]) {
      event.preventDefault();
      openResult(results[activeIndex]);
    }
  };

  // NOTE: the platform is only known in the browser; the server renders no hint
  const isApple = isClient && /Mac|iPhone|iPad/.test(navigator.userAgent);
  const optionId = (index: number) => `${listId}-option-${index}`;

  return (
    <>
      <Button
        className="msd-search__trigger"
        srfTheme="muted"
        srfVariant="outlined"
        btnIconStart={<SearchIcon />}
        aria-keyshortcuts="Control+K Meta+K"
        onClick={() => setIsOpen(true)}
      >
        <span className="msd-search__trigger-label">{ui.search}</span>
        {isClient && (
          <kbd className="msd-search__shortcut" aria-hidden="true">
            {isApple ? '⌘K' : 'Ctrl K'}
          </kbd>
        )}
      </Button>

      <Dialog
        dlgIsOpen={isOpen}
        dlgOnOpenChange={changeOpen}
        dlgSize="base"
        aria-label={ui.search}
        className="msd-search"
      >
        <Dialog.Body>
          <Input
            type="search"
            ctlSize="lg"
            autoFocus
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={
              results[activeIndex] ? optionId(activeIndex) : undefined
            }
            aria-label={ui.search}
            placeholder={ui.searchPlaceholder}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
          />

          <ul id={listId} role="listbox" className="msd-search__results">
            {results.map((entry, index) => (
              // NOTE: the focus stays in the input (combobox), options are picked by pointer
              // or by Enter on the active one
              <li
                key={entry.id}
                id={optionId(index)}
                role="option"
                aria-selected={index === activeIndex}
                className="msd-search__result"
                onClick={() => openResult(entry)}
                onMouseMove={() => setActiveIndex(index)}
              >
                <Text txtColor="base" txtWeight="medium">
                  {entry.isHeading && (
                    <Text
                      txtColor="subtle"
                      spcType="me"
                      spcScale="element"
                      spcSize="sm"
                      aria-hidden="true"
                    >
                      #
                    </Text>
                  )}
                  {entry.title}
                </Text>
                <Text txtSize="xs" txtColor="muted">
                  {entry.context}
                </Text>
              </li>
            ))}
          </ul>

          {query.trim() && results.length === 0 && (
            <Text
              txtAs="p"
              txtSize="sm"
              txtColor="muted"
              txtAlign="center"
              spcType="pv"
              spcScale="component"
              spcSize="lg"
              role="status"
            >
              {ui.searchNoResults}
            </Text>
          )}
          {!query.trim() && (
            <Text
              txtAs="p"
              txtSize="sm"
              txtColor="muted"
              txtAlign="center"
              spcType="pv"
              spcScale="component"
              spcSize="lg"
            >
              {ui.searchHint}
            </Text>
          )}
        </Dialog.Body>
      </Dialog>
    </>
  );
}

export { DocsSearch, buildSearchEntries, searchEntries };
export type { SearchEntry };
