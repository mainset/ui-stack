'use client';

import { Disclosure, NavList } from '@mainset/react/components';
import { HStack, Heading, Stack, Text } from '@mainset/react/elements';
import React from 'react';

import type { DocsHeading } from '../core/docs.types.mjs';

interface DocsTocProps {
  headings: DocsHeading[];
  /** Id of the heading being read (scroll-spy) */
  activeHeadingId: string | null;
  label: string;
}

interface TocEntry {
  heading: DocsHeading;
  children: DocsHeading[];
}

// `###` headings under the `##` before them (a page starting with `###` keeps them on top)
function toTocEntries(headings: DocsHeading[]): TocEntry[] {
  const entries: TocEntry[] = [];

  for (const heading of headings) {
    const parent = entries[entries.length - 1];

    if (heading.depth > 2 && parent && parent.heading.depth === 2) {
      parent.children.push(heading);
    } else {
      entries.push({ heading, children: [] });
    }
  }

  return entries;
}

function TocLink({
  heading,
  activeHeadingId,
}: {
  heading: DocsHeading;
  activeHeadingId: string | null;
}) {
  return (
    <NavList.Link
      href={`#${heading.id}`}
      aria-current={heading.id === activeHeadingId ? 'location' : undefined}
    >
      {heading.text}
    </NavList.Link>
  );
}

function TocList({
  headings,
  activeHeadingId,
  className,
}: Omit<DocsTocProps, 'label'> & { className?: string }) {
  return (
    <NavList navVariant="line" className={className}>
      {toTocEntries(headings).map(({ heading, children }) => (
        <NavList.Item key={heading.id}>
          <TocLink heading={heading} activeHeadingId={activeHeadingId} />
          {children.length > 0 && (
            <NavList navVariant="line">
              {children.map((child) => (
                <NavList.Item key={child.id}>
                  <TocLink heading={child} activeHeadingId={activeHeadingId} />
                </NavList.Item>
              ))}
            </NavList>
          )}
        </NavList.Item>
      ))}
    </NavList>
  );
}

/** "On this page": the page's `##` / `###` headings, the one being read marked as you scroll */
function DocsToc({ headings, activeHeadingId, label }: DocsTocProps) {
  const titleId = React.useId();

  return (
    <Stack stkAs="nav" aria-labelledby={titleId} layGapSize="xs">
      <Heading hAs="h2" id={titleId} txtVariant="overline" txtColor="subtle">
        {label}
      </Heading>
      <TocList headings={headings} activeHeadingId={activeHeadingId} />
    </Stack>
  );
}

/** The same list, folded into a bar at the top of the page, for screens without the side panel */
function DocsTocDisclosure({ headings, activeHeadingId, label }: DocsTocProps) {
  const detailsRef = React.useRef<HTMLDetailsElement>(null);
  const activeHeading = headings.find(({ id }) => id === activeHeadingId);

  return (
    <nav aria-label={label} className="msd-toc-disclosure">
      <Disclosure
        ref={detailsRef}
        dscSummary={
          <HStack
            stkAs="span"
            layGapSize="xs"
            className="msd-toc-disclosure__summary"
          >
            <Text txtWeight="semibold">{label}</Text>
            {activeHeading && (
              <Text txtColor="muted" txtIsTruncated>
                {activeHeading.text}
              </Text>
            )}
          </HStack>
        }
        // NOTE: a jump to a heading closes it, so it doesn't cover what was jumped to
        onClick={(event) => {
          if ((event.target as Element).closest('a') && detailsRef.current) {
            detailsRef.current.open = false;
          }
        }}
      >
        <TocList
          headings={headings}
          activeHeadingId={activeHeadingId}
          className="msd-toc-disclosure__list"
        />
      </Disclosure>
    </nav>
  );
}

export { DocsToc, DocsTocDisclosure };
export type { DocsTocProps };
