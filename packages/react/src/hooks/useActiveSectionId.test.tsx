// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import { nextFrame, render } from '../../test/dom.js';
import { useActiveSectionId } from './useActiveSectionId.mjs';

const SECTION_TOPS: Record<string, number> = {
  intro: -400,
  data: 40,
  rights: 900,
};

function Contents() {
  const activeId = useActiveSectionId(Object.keys(SECTION_TOPS));

  return (
    <>
      <output>{activeId ?? 'none'}</output>
      {Object.keys(SECTION_TOPS).map((id) => (
        <section
          key={id}
          id={id}
          ref={(section) => {
            if (section) {
              section.getBoundingClientRect = () =>
                ({ top: SECTION_TOPS[id] }) as DOMRect;
            }
          }}
        />
      ))}
    </>
  );
}

let unmount: () => void = () => undefined;
afterEach(() => unmount());

// jsdom lays nothing out: a long page, so the reader isn't at its end
Object.defineProperty(document.documentElement, 'scrollHeight', {
  configurable: true,
  value: 5000,
});

describe('useActiveSectionId', () => {
  it('is the last section whose top passed the reading line', async () => {
    ({ unmount } = render(<Contents />));
    await nextFrame();

    // `data` (40px) is above the default line (64px, no scroll offset); `rights` is below it
    expect(document.querySelector('output')!.textContent).toBe('data');
  });

  it('is the last section at the end of the page', async () => {
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 0,
    });
    ({ unmount } = render(<Contents />));
    await nextFrame();

    expect(document.querySelector('output')!.textContent).toBe('rights');
  });
});
