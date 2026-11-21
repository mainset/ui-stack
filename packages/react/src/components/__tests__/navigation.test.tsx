// @vitest-environment jsdom
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { click, render } from '../../../test/dom.js';
import { Breadcrumb } from '../Breadcrumb/index.mjs';
import { Disclosure } from '../Disclosure/index.mjs';
import { NavList } from '../NavList/index.mjs';
import { Pagination } from '../Pagination/index.mjs';

const html = (element: React.ReactElement) => renderToStaticMarkup(element);

let unmount: () => void = () => undefined;

afterEach(() => unmount());

const labels = () =>
  Array.from(document.querySelectorAll('.ms-pagination__list > li')).map(
    (item) =>
      item.querySelector('[aria-current="page"]')
        ? `[${item.textContent}]`
        : item.textContent,
  );

describe('Pagination', () => {
  it('shows previous, the pages around the current one and next', () => {
    ({ unmount } = render(<Pagination pgnPage={6} pgnPageCount={20} />));

    const nav = document.querySelector('nav')!;
    expect(nav.getAttribute('aria-label')).toBe('Pagination');
    expect(nav.className).toBe('ms-pagination ms-pagination--size-base');
    expect(labels()).toEqual(['‹', '1', '…', '5', '[6]', '7', '…', '20', '›']);

    const current = document.querySelector('[aria-current="page"]')!;
    expect(current.getAttribute('aria-label')).toBe('Page 6');
    expect(current.className).toContain('ms-surface--variant-solid');
    expect(
      document
        .querySelector('.ms-pagination__ellipsis')!
        .getAttribute('aria-hidden'),
    ).toBe('true');
  });

  it('calls pgnOnPageChange; previous is disabled on the first page', () => {
    const onPageChange = vi.fn();
    ({ unmount } = render(
      <Pagination
        pgnPage={1}
        pgnPageCount={3}
        pgnOnPageChange={onPageChange}
      />,
    ));

    const previous = document.querySelector<HTMLButtonElement>(
      '[aria-label="Previous page"]',
    )!;
    expect(previous.disabled).toBe(true);

    click(document.querySelector('[aria-label="Next page"]')!);
    click(document.querySelector('[aria-label="Page 3"]')!);
    expect(onPageChange.mock.calls).toEqual([[2], [3]]);
  });

  it('renders links with pgnGetHref; the disabled one has no href', () => {
    const markup = html(
      <Pagination
        pgnPage={3}
        pgnPageCount={3}
        pgnGetHref={(page) => `?page=${page}`}
      />,
    );

    expect(markup).toContain('href="?page=2"');
    expect(markup).toMatch(
      /<a[^>]*aria-disabled="true"[^>]*aria-label="Next page"/,
    );
    expect(markup).not.toContain('href="?page=4"');
  });
});

describe('Breadcrumb', () => {
  it('is a nav list of links with hidden separators, the last one current', () => {
    expect(
      html(
        <Breadcrumb brcSeparator="›">
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item brcIsCurrent>Docs</Breadcrumb.Item>
        </Breadcrumb>,
      ),
    ).toBe(
      '<nav aria-label="Breadcrumb" class="ms-breadcrumb"><ol class="ms-breadcrumb__list">' +
        '<li class="ms-breadcrumb__item"><a class="ms-breadcrumb__link" href="/">Home</a>' +
        '<span class="ms-breadcrumb__separator" aria-hidden="true">›</span></li>' +
        '<li class="ms-breadcrumb__item"><span aria-current="page" class="ms-breadcrumb__link">Docs</span></li>' +
        '</ol></nav>',
    );
  });

  it('keeps a router link and its props', () => {
    const RouterLink = ({
      to,
      ...props
    }: { to: string } & React.ComponentProps<'a'>) => (
      <a href={to} data-router="" {...props} />
    );

    expect(
      html(
        <Breadcrumb>
          <Breadcrumb.Item brcAs={RouterLink} to="/docs">
            Docs
          </Breadcrumb.Item>
        </Breadcrumb>,
      ),
    ).toContain(
      '<a href="/docs" data-router="" class="ms-breadcrumb__link">Docs</a>',
    );
  });
});

describe('NavList', () => {
  it('renders a list of whole-row links, soft by default', () => {
    expect(
      html(
        <NavList>
          <NavList.Item>
            <NavList.Link href="/a" aria-current="page">
              A
            </NavList.Link>
          </NavList.Item>
        </NavList>,
      ),
    ).toBe(
      '<ul class="ms-nav-list ms-nav-list--variant-soft"><li class="ms-nav-list__item">' +
        '<a class="ms-nav-list__link" href="/a" aria-current="page">A</a></li></ul>',
    );
  });

  it('keeps a router link and its props, and takes the line variant', () => {
    const RouterLink = ({
      to,
      ...props
    }: { to: string } & React.ComponentProps<'a'>) => (
      <a href={to} data-router="" {...props} />
    );

    const markup = html(
      <NavList navVariant="line">
        <NavList.Item>
          <NavList.Link navAs={RouterLink} to="/b">
            B
          </NavList.Link>
        </NavList.Item>
      </NavList>,
    );

    expect(markup).toContain('class="ms-nav-list ms-nav-list--variant-line"');
    expect(markup).toContain(
      '<a href="/b" data-router="" class="ms-nav-list__link">B</a>',
    );
  });

  it('groups a nested list in a native details with a chevron', () => {
    expect(
      html(
        <NavList.Group navLabel="Elements" open>
          <NavList />
        </NavList.Group>,
      ),
    ).toBe(
      '<details class="ms-nav-list__group" open=""><summary class="ms-nav-list__group-label">' +
        '<span>Elements</span><span class="ms-disclosure__icon" aria-hidden="true"></span></summary>' +
        '<ul class="ms-nav-list ms-nav-list--variant-soft"></ul></details>',
    );
  });
});

describe('Disclosure', () => {
  it('is a native details: summary trigger with the icon, then the content', () => {
    expect(
      html(
        <Disclosure dscSummary="Shipping" dscSummaryProps={{ id: 's' }}>
          Free over 50 €.
        </Disclosure>,
      ),
    ).toBe(
      '<details class="ms-disclosure"><summary id="s" class="ms-disclosure__trigger">Shipping' +
        '<span class="ms-disclosure__icon" aria-hidden="true"></span></summary>' +
        '<div class="ms-disclosure__panel-content">Free over 50 €.</div></details>',
    );
  });
});
