import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { Box } from './Box/index.mjs';
import { Container } from './Container/index.mjs';
import { Grid } from './Grid/index.mjs';
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

describe('Container', () => {
  it('defaults to the xl size', () => {
    expect(html(<Container />)).toBe(
      '<div class="ms-container ms-container--size-xl"></div>',
    );
  });

  it('takes a size, gutterless, a tag and spacing', () => {
    expect(
      html(
        <Container
          ctnAs="main"
          ctnSize="full"
          ctnIsGutterless
          spcType="pv"
          spcScale="section"
          spcSize="sm"
        />,
      ),
    ).toBe(
      '<main class="ms-container ms-container--size-full ms-container--gutterless ms-spacing--pv-section-sm"></main>',
    );
  });
});

describe('Grid', () => {
  it('maps responsive columns and spans to classes + CSS variables', () => {
    const markup = html(
      <Grid grdColumns={{ base: 1, md: 3 }}>
        <Grid.Item grdColSpan={{ base: 1, md: 2 }} />
        <Grid.Item grdIsFullRow />
      </Grid>,
    );

    expect(markup).toContain('ms-grid--columns-1 ms-grid--columns@md');
    expect(markup).toContain(
      'style="--ms-grid-columns-at-md:repeat(3, minmax(0, 1fr))"',
    );
    expect(markup).toContain(
      '<div class="ms-grid__item ms-grid__item--col-span-1 ms-grid__item--col-span@md" style="--ms-grid__item-col-span-at-md:span 2 / span 2">',
    );
    expect(markup).toContain(
      '<div class="ms-grid__item ms-grid__item--full-row">',
    );
  });
});
