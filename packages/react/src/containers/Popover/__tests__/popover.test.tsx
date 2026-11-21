// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import {
  byRole,
  byText,
  click,
  nextFrame,
  pointerDown,
  press,
  render,
} from '../../../../test/dom.js';
import { Button } from '../../../components/Button/index.mjs';
import { Dialog } from '../../Dialog/index.mjs';
import { MainSetProvider } from '../../MainSetContext/MainSetProvider.js';
import { Tooltip } from '../../Tooltip/index.mjs';
import { Popover } from '../Popover.js';

function Filters() {
  return (
    <Popover popPlacement="bottom" popAlign="end">
      <Popover.Trigger>
        <Button>Filters</Button>
      </Popover.Trigger>
      <Popover.Content aria-label="Filters">
        <input aria-label="Search" />
        <Button>Apply</Button>
      </Popover.Content>
    </Popover>
  );
}

const trigger = () => byText('Filters').closest('button')!;

let unmount: () => void = () => undefined;
afterEach(() => unmount());

describe('Popover', () => {
  it('opens on click, focus inside; Escape closes and returns the focus', async () => {
    ({ unmount } = render(<Filters />));
    expect(trigger().getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger().getAttribute('aria-expanded')).toBe('false');

    trigger().focus();
    click(trigger());
    await nextFrame();

    const content = byRole('dialog')!;
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(trigger().getAttribute('aria-controls')).toBe(content.id);
    expect(content.className).toBe('ms-popover');
    expect(content.style.position).toBe('fixed');
    expect(document.activeElement!.getAttribute('aria-label')).toBe('Search');
    // rendered next to its trigger, so the Tab order goes on from there
    expect(trigger().nextElementSibling).toBe(content);

    press(document.activeElement!, 'Escape');
    expect(byRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it('a press outside closes it; the trigger toggles', () => {
    ({ unmount } = render(<Filters />));
    click(trigger());
    pointerDown(document.body);
    expect(byRole('dialog')).toBeNull();

    click(trigger());
    pointerDown(trigger());
    click(trigger());
    expect(byRole('dialog')).toBeNull();
  });

  it('Escape inside a dialog closes the popover only', async () => {
    ({ unmount } = render(
      <MainSetProvider>
        <Dialog dlgIsOpen aria-label="Settings">
          <Filters />
        </Dialog>
      </MainSetProvider>,
    ));
    click(trigger());
    await nextFrame();

    press(document.activeElement!, 'Escape');
    expect(document.querySelector('.ms-popover')).toBeNull();
    expect(byRole('dialog')!.getAttribute('aria-label')).toBe('Settings');
  });
});

describe('Tooltip', () => {
  function CopyButton() {
    return (
      <Tooltip tipContent="Copy link">
        <Button btnIsIcon aria-label="Copy" aria-describedby="extra">
          ⧉
        </Button>
      </Tooltip>
    );
  }

  it('describes its trigger; shows on focus, hides on blur', () => {
    ({ unmount } = render(<CopyButton />));
    const button = byText('⧉').closest('button')!;
    const tooltip = byRole('tooltip')!;

    expect(button.getAttribute('aria-describedby')).toBe(`extra ${tooltip.id}`);
    expect(tooltip.hidden).toBe(true);

    React.act(() => button.focus());
    expect(tooltip.hidden).toBe(false);
    expect(tooltip.style.position).toBe('fixed');

    React.act(() => button.blur());
    expect(tooltip.hidden).toBe(true);
  });

  it('Escape hides it, keeping the focus, before a dialog sees the key', () => {
    ({ unmount } = render(
      <MainSetProvider>
        <Dialog dlgIsOpen aria-label="Share">
          <CopyButton />
        </Dialog>
      </MainSetProvider>,
    ));
    const button = byText('⧉').closest('button')!;
    React.act(() => button.focus());

    press(button, 'Escape');
    expect(byRole('tooltip')!.hidden).toBe(true);
    expect(document.activeElement).toBe(button);
    expect(byRole('dialog')).not.toBeNull();
  });
});
