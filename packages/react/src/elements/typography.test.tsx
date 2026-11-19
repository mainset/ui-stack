import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { Link } from './Link/index.mjs';
import { Text, TextSection } from './Typography/index.mjs';

const html = (element: React.ReactElement) => renderToStaticMarkup(element);

function RouterLink({
  to,
  ...props
}: { to: string } & React.ComponentProps<'a'>) {
  return <a href={to} {...props} />;
}

describe('Text', () => {
  it('renders a span by default, any text tag with txtAs', () => {
    expect(html(<Text>hi</Text>)).toBe('<span class="ms-text">hi</span>');
    expect(html(<Text txtAs="small" txtSize="xs" txtColor="muted" />)).toBe(
      '<small class="ms-text ms-text--color-muted ms-text--size-xs"></small>',
    );
  });

  it('takes a size per breakpoint', () => {
    expect(html(<Text txtSize={{ base: 'base', md: 'lg' }} />)).toBe(
      '<span class="ms-text ms-text--size-base ms-text--size-lg@md"></span>',
    );
  });

  it('TextSection is the same component', () => {
    expect(TextSection).toBe(Text);
  });
});

describe('Link', () => {
  it('underlines by default', () => {
    expect(html(<Link href="/a">A</Link>)).toBe(
      '<a class="ms-link ms-link--underline-always ms-text" href="/a">A</a>',
    );
  });

  it('lnkAs keeps a router link and its props', () => {
    expect(
      html(
        <Link lnkAs={RouterLink} to="/pricing" lnkUnderline="hover">
          Pricing
        </Link>,
      ),
    ).toBe(
      '<a href="/pricing" class="ms-link ms-link--underline-hover ms-text">Pricing</a>',
    );
  });
});
