import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { Box } from './Box/index.mjs';
import { Cluster, HStack, Stack } from './Stack/index.mjs';

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

describe('Stack / HStack / Cluster', () => {
  it('Stack is a vertical flex list with the base gap', () => {
    expect(html(<Stack />)).toBe(
      '<div class="ms-flex ms-flex--display-flex ms-flex--flex-direction-column ms-layout ms-layout--gap-size-base"></div>',
    );
  });

  it('props override the preset, responsive values included', () => {
    const markup = html(
      <Stack
        stkAs="ul"
        flxDirection={{ base: 'column', md: 'row' }}
        layGapSize="sm"
      />,
    );

    expect(markup).toMatch(/^<ul /);
    expect(markup).toContain('ms-flex--flex-direction-column');
    expect(markup).toContain('ms-flex--flex-direction-row@md');
    expect(markup).toContain('ms-layout--gap-size-sm');
    expect(markup).not.toContain('gap-size-base');
  });

  it('HStack centers a row, Cluster wraps it', () => {
    expect(html(<HStack />)).toContain('ms-layout--align-items-center');
    expect(html(<Cluster />)).toContain('ms-flex--flex-wrap-wrap');
  });
});
