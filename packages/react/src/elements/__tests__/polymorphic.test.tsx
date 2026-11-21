import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { Button } from '../../components/Button/index.mjs';
import { ButtonBasic } from '../ButtonBasic/index.mjs';
import { Flex } from '../Flex/index.mjs';
import { Grid } from '../Grid/index.mjs';
import { Section } from '../Section/index.mjs';
import { Spacing } from '../Spacing/index.mjs';
import { Surface } from '../Surface/index.mjs';
import { Heading } from '../Typography/index.mjs';

const html = (element: React.ReactElement) => renderToStaticMarkup(element);

// A router-like link: `btnAs={Link}` must keep its own props typed (`to`)
function Link({ to, ...props }: { to: string } & React.ComponentProps<'a'>) {
  return <a href={to} {...props} />;
}

describe('prefixed *As props', () => {
  it('Button renders a button by default, with type="button"', () => {
    expect(html(<Button>Save</Button>)).toMatch(/^<button [^>]*type="button"/);
  });

  it('btnAs renders a link or a component, keeping button styling', () => {
    expect(
      html(
        <Button btnAs="a" href="/x">
          Go
        </Button>,
      ),
    ).toMatch(/^<a class="[^"]*ms-button[^"]*" href="\/x"/);
    expect(
      html(
        <ButtonBasic btnAs={Link} to="/home">
          Home
        </ButtonBasic>,
      ),
    ).toMatch(/^<a href="\/home" class="[^"]*ms-button/);
  });

  it('srfAs, secAs, flxAs, grdAs, spcAs pick the tag', () => {
    expect(html(<Surface srfAs="article" />)).toMatch(/^<article /);
    expect(html(<Section />)).toMatch(/^<section /);
    expect(html(<Section secAs="footer" />)).toMatch(/^<footer /);
    expect(html(<Flex flxAs="nav" />)).toMatch(/^<nav /);
    expect(
      html(
        <Grid grdAs="ul">
          <Grid.Item grdAs="li" />
        </Grid>,
      ),
    ).toMatch(/^<ul [^>]*><li[ >].*<\/li><\/ul>$/);
    expect(
      html(<Spacing spcAs="span" spcType="p" spcScale="element" />),
    ).toMatch(/^<span/);
  });

  it('hAs sets the level; txtSize sets the looks', () => {
    expect(html(<Heading>Title</Heading>)).toBe(
      '<h1 class="ms-heading ms-text">Title</h1>',
    );
    expect(html(<Heading hAs="h3" txtSize="xxl" />)).toMatch(
      /^<h3 class="ms-heading ms-text ms-text--size-xxl"/,
    );
  });

  it('passes ref through (a regular prop in React 19)', () => {
    const ref = React.createRef<HTMLElement>();
    expect(() => html(<Flex flxAs="section" ref={ref} />)).not.toThrow();
  });
});
