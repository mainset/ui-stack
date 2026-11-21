// @vitest-environment jsdom
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { render } from '../../../test/dom.js';
import { Button } from '../../components/Button/index.mjs';
import { Animate } from '../../containers/Animate/index.mjs';
import { AspectRatio } from '../AspectRatio/index.mjs';
import { Badge } from '../Badge/index.mjs';
import { Box } from '../Box/index.mjs';
import { CardBasic } from '../CardBasic/index.mjs';
import { IconTile } from '../IconTile/index.mjs';
import { Link } from '../Link/index.mjs';
import { ListBasic } from '../ListBasic/index.mjs';
import { Heading, Text } from '../Typography/index.mjs';

const html = (element: React.ReactElement) => renderToStaticMarkup(element);
const classes = (markup: string) =>
  (/class="([^"]*)"/.exec(markup)?.[1] ?? '').split(' ').sort();

describe('typography', () => {
  it('display sizes, weights, leading, wrap and variants', () => {
    expect(
      classes(
        html(
          <Heading hAs="h1" txtSize="display-base" txtWrap="balance">
            Hi
          </Heading>,
        ),
      ),
    ).toEqual(
      [
        'ms-heading',
        'ms-text',
        'ms-text--size-display-base',
        'ms-text--wrap-balance',
      ].sort(),
    );
    expect(
      classes(
        html(
          <Text
            txtAs="p"
            txtVariant="overline"
            txtColor="primary"
            txtWeight="semibold"
            txtLeading="relaxed"
          />,
        ),
      ),
    ).toEqual(
      [
        'ms-text',
        'ms-text--variant-overline',
        'ms-text--color-primary',
        'ms-text--weight-semibold',
        'ms-text--leading-relaxed',
      ].sort(),
    );
    expect(html(<Text txtColor="subtle">meta</Text>)).toContain(
      'ms-text--color-subtle',
    );
    expect(html(<Text txtVariant="data">v0.2.0</Text>)).toContain(
      'ms-text--variant-data',
    );
  });
});

describe('hover props', () => {
  it('add only their classes, never reach the DOM', () => {
    const box = html(
      <Box hvrIsGroup hvrEffect="lift">
        <Text hvrEffect="nudge-end">→</Text>
      </Box>,
    );

    expect(box).toContain('ms-hover--group');
    expect(box).toContain('ms-hover--lift');
    expect(box).toContain('ms-hover--nudge-end');
    expect(box).not.toContain('hvr');
    expect(html(<Box />)).not.toContain('ms-hover');
  });

  it('work on buttons, with icon slots around the label', () => {
    const button = html(
      <Button
        hvrIsGroup
        btnIconStart={<svg data-icon="start" />}
        btnIconEnd={<svg data-icon="end" />}
      >
        Download
      </Button>,
    );

    expect(button).toContain('ms-hover--group');
    expect(button).toMatch(
      /<span class="ms-button__icon"><svg data-icon="start"><\/svg><\/span>Download<span class="ms-button__icon"><svg data-icon="end"><\/svg><\/span>/,
    );
    expect(html(<Button>Plain</Button>)).not.toContain('ms-button__icon');
  });
});

describe('cards and links', () => {
  it('an interactive card is a link area and a hover group', () => {
    const card = html(
      <CardBasic crdIsInteractive srfVariant="outlined">
        <Link href="/docninja" lnkIsStretched lnkUnderline="none">
          DocNinja
        </Link>
      </CardBasic>,
    );

    expect(card).toContain('ms-link-area');
    expect(card).toContain('ms-hover--group');
    expect(card).toContain('ms-link--stretched');
    expect(html(<CardBasic />)).not.toContain('ms-link-area');
  });

  it('small badges', () => {
    const badge = html(<Badge bdgSize="sm">New</Badge>);

    expect(badge).toContain('ms-text--size-xs');
    expect(badge).toContain('ms-spacing--ph-element-lg');
  });
});

describe('IconTile, AspectRatio, ListBasic.Item', () => {
  it('IconTile is a decorative, toned tile', () => {
    expect(
      html(
        <IconTile ictTheme="success" ictShape="circle">
          <svg />
        </IconTile>,
      ),
    ).toBe(
      '<span aria-hidden="true" class="ms-icon-tile ms-icon-tile--size-base ms-icon-tile--shape-circle ms-icon-tile--variant-outlined ms-tone-success"><svg></svg></span>',
    );
  });

  it('AspectRatio defaults to 16-9 cover, rounds with brdRadius', () => {
    expect(
      classes(
        html(
          <AspectRatio aspRatio="16-10" brdRadius="lg">
            <img alt="" />
          </AspectRatio>,
        ),
      ),
    ).toEqual(
      [
        'ms-aspect-ratio',
        'ms-aspect-ratio--ratio-16-10',
        'ms-aspect-ratio--fit-cover',
        'ms-border',
        'ms-border--radius-lg',
      ].sort(),
    );
  });

  it('ListBasic.Item puts the icon beside the text', () => {
    expect(
      html(<ListBasic.Item lstIcon={<svg />}>Works offline</ListBasic.Item>),
    ).toBe(
      '<li class="ms-list__item"><span class="ms-list__item-icon"><svg></svg></span><span>Works offline</span></li>',
    );
    expect(html(<ListBasic.Item>Plain</ListBasic.Item>)).toBe('<li>Plain</li>');
  });
});

describe('Animate', () => {
  let unmount: () => void = () => undefined;
  afterEach(() => {
    unmount();
    vi.useRealTimers();
  });

  it('mount: the entrance is in the server HTML, with its delay', () => {
    const markup = html(
      <Animate anmSlide="up" anmFade={false} anmDelay={120}>
        Hi
      </Animate>,
    );

    expect(classes(markup)).toEqual(
      ['ms-animate', 'ms-animate--state-enter', 'ms-animate--slide-up'].sort(),
    );
    expect(markup).toContain('style="--ms-animate-delay:120ms"');
  });

  it('visible: the server HTML has no state, so it is readable before hydration', () => {
    const markup = html(
      <Animate anmTrigger="visible" anmAs="li">
        Hi
      </Animate>,
    );

    expect(markup).toBe('<li class="ms-animate ms-animate--fade">Hi</li>');
  });

  it('controlled: exits, then unmounts and reports it', () => {
    vi.useFakeTimers();
    const onExited = vi.fn();
    const Toggle = ({ isIn }: { isIn: boolean }) => (
      <Animate
        anmIsIn={isIn}
        anmIsUnmountedOnExit
        anmOnExited={onExited}
        data-testid="panel"
      >
        Panel
      </Animate>
    );

    let rerender: (next: React.ReactElement) => void;
    ({ unmount, rerender } = render(<Toggle isIn={false} />));
    const panel = () => document.querySelector('[data-testid="panel"]');
    expect(panel()).toBeNull();

    rerender(<Toggle isIn />);
    expect(panel()!.className).toContain('ms-animate--state-enter');

    rerender(<Toggle isIn={false} />);
    expect(panel()!.className).toContain('ms-animate--state-exit');

    // jsdom has no animations: the fallback timer ends the exit
    React.act(() => {
      vi.runAllTimers();
    });
    expect(panel()).toBeNull();
    expect(onExited).toHaveBeenCalledTimes(1);
  });
});
