import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { Box } from './Box/index.mjs';

const html = (element: React.ReactElement) => renderToStaticMarkup(element);

describe('Box', () => {
  it('maps spacing, background and border props to classes', () => {
    expect(
      html(
        <Box
          boxAs="section"
          bgColor="muted"
          spcType="p"
          spcScale="block"
          spcSize="lg"
          id="intro"
        >
          …
        </Box>,
      ),
    ).toBe(
      '<section class="ms-background ms-background--color-muted ms-border ms-spacing--p-block-lg" id="intro">…</section>',
    );
  });

  it('merges responsive spacing variables with its own style', () => {
    expect(
      html(
        <Box
          spcType="pv"
          spcScale="section"
          spcSize={{ base: 'xs', md: 'lg' }}
          style={{ color: 'red' }}
        />,
      ),
    ).toContain(
      'style="--ms-spacing-pv-at-md:var(--ms-spacing-scale-section-lg);color:red"',
    );
  });
});
