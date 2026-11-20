'use client';

import { Heading, Stack, Text } from '@mainset/react/elements';
import React from 'react';

import type { DocsHeading } from '../core/docs.types.mjs';
import { ChevronIcon } from './icons.js';

interface DocsTocProps {
  headings: DocsHeading[];
  /** Id of the heading being read (scroll-spy) */
  activeHeadingId: string | null;
  label: string;
}

function TocList({ headings, activeHeadingId }: Omit<DocsTocProps, 'label'>) {
  return (
    <ul className="msd-toc__list">
      {headings.map((heading) => (
        <li
          key={heading.id}
          className={`msd-toc__item msd-toc__item--depth-${heading.depth}`}
        >
          <a
            href={`#${heading.id}`}
            className="msd-toc__link"
            aria-current={
              heading.id === activeHeadingId ? 'location' : undefined
            }
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
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
      <details
        ref={detailsRef}
        // NOTE: a jump to a heading closes it, so it doesn't cover what was jumped to
        onClick={(event) => {
          if ((event.target as Element).closest('a') && detailsRef.current) {
            detailsRef.current.open = false;
          }
        }}
      >
        <summary className="msd-toc-disclosure__summary">
          <Text txtWeight="semibold">{label}</Text>
          {activeHeading && (
            <Text txtColor="muted" txtIsTruncated>
              {activeHeading.text}
            </Text>
          )}
          <ChevronIcon className="msd-toc-disclosure__chevron" />
        </summary>
        <TocList headings={headings} activeHeadingId={activeHeadingId} />
      </details>
    </nav>
  );
}

export { DocsToc, DocsTocDisclosure };
export type { DocsTocProps };
