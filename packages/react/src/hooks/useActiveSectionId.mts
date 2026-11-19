'use client';

import React from 'react';

// Below the scroll offset (where an anchor jump lands a section), the room a heading may scroll
// before its section counts as the one being read
const READING_LINE__MARGIN_PX = 64;

interface UseActiveSectionIdOptions {
  /**
   * How far below the viewport's top a section's top must pass to be the one being read.
   * Default: the root's `scroll-padding-top` (`--ms-scroll-offset`, e.g. a fixed header) + 64px.
   */
  readingLinePx?: number;
}

/**
 * Scroll-spy for a table of contents: the id of the section being read — the last one whose top
 * has passed the reading line; at the end of the page, the last section (which may be too short
 * to ever reach the line). `null` on the server and in the first render (no scroll position
 * there), so server and client render the same. Mark its link `aria-current="location"`.
 *
 * @example
 * const activeId = useActiveSectionId(SECTION_IDS);
 * <a href={`#${id}`} aria-current={id === activeId ? 'location' : undefined}>…</a>
 */
function useActiveSectionId(
  sectionIds: readonly string[],
  { readingLinePx }: UseActiveSectionIdOptions = {},
): string | null {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  // NOTE: by value, so a new array with the same ids doesn't restart the listeners
  const idsKey = sectionIds.join('\n');

  React.useEffect(() => {
    const ids = idsKey ? idsKey.split('\n') : [];
    const root = document.documentElement;
    let frameId = 0;

    const readingLine = () =>
      readingLinePx ??
      (parseFloat(getComputedStyle(root).scrollPaddingTop) || 0) +
        READING_LINE__MARGIN_PX;

    const update = () => {
      frameId = 0;
      const sections = ids
        .map((id) => document.getElementById(id))
        .filter((section): section is HTMLElement => section !== null);
      const line = readingLine();
      const isAtEnd =
        window.innerHeight + window.scrollY >= root.scrollHeight - 2;

      let nextId = sections[0]?.id ?? null;
      for (const section of sections) {
        if (section.getBoundingClientRect().top > line) break;
        nextId = section.id;
      }

      if (isAtEnd && sections.length > 0) {
        nextId = sections[sections.length - 1].id;
      }

      setActiveId(nextId);
    };

    // At most once a frame, however often the browser reports scrolling
    const schedule = () => {
      frameId ||= requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [idsKey, readingLinePx]);

  return activeId;
}

export { useActiveSectionId };
export type { UseActiveSectionIdOptions };
