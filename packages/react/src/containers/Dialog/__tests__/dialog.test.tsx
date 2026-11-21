// @vitest-environment jsdom
import React from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  byRole,
  byText,
  click,
  nextFrame,
  press,
  render,
} from '../../../../test/dom.js';
import { Button } from '../../../components/Button/index.mjs';
import { useOverlay } from '../../MainSetContext/MainSetContext.mjs';
import { MainSetProvider } from '../../MainSetContext/MainSetProvider.js';
import { Dialog, Drawer } from '../Dialog.js';
import { useDialog } from '../DialogContext.mjs';

function OpenButton({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const overlay = useOverlay(id);
  return <Button onClick={overlay.open}>{children}</Button>;
}

function CancelButton() {
  const { dismiss } = useDialog();
  return <Button onClick={dismiss}>Cancel</Button>;
}

function App({ children }: { children?: React.ReactNode }) {
  return (
    <MainSetProvider>
      <OpenButton id="settings">Open settings</OpenButton>
      <Dialog dlgId="settings" dlgSize="sm">
        <Dialog.Header>
          <Dialog.Title>Settings</Dialog.Title>
          <Dialog.CloseButton />
        </Dialog.Header>
        <Dialog.Body>
          <OpenButton id="confirm">Reset</OpenButton>
        </Dialog.Body>
        <Dialog.Footer>
          <CancelButton />
        </Dialog.Footer>
      </Dialog>
      <Dialog
        dlgId="confirm"
        dlgRole="alertdialog"
        aria-label="Reset everything?"
      >
        <Dialog.Body>
          <CancelButton />
        </Dialog.Body>
      </Dialog>
      {children}
    </MainSetProvider>
  );
}

let unmount: () => void = () => undefined;

afterEach(() => unmount());

describe('Dialog', () => {
  it('opens by id from anywhere, named by its title, focus inside', async () => {
    ({ unmount } = render(<App />));
    expect(byRole('dialog')).toBeNull();

    const trigger = byText('Open settings').closest('button')!;
    trigger.focus();
    click(trigger);
    await nextFrame();

    const dialog = byRole('dialog')!;
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.className).toBe('ms-dialog ms-dialog--size-sm');
    expect(dialog.parentElement!.className).toBe(
      'ms-overlay ms-overlay--placement-center',
    );
    expect(
      document.getElementById(dialog.getAttribute('aria-labelledby')!)!
        .textContent,
    ).toBe('Settings');
    // the close button is the first focusable node
    expect(document.activeElement!.getAttribute('aria-label')).toBe('Close');
    expect(document.querySelector('.ms-backdrop--visible')).not.toBeNull();
    expect(document.body.style.overflow).toBe('hidden');

    press(document.activeElement!, 'Escape');
    expect(byRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(document.querySelector('.ms-backdrop--visible')).toBeNull();
    expect(document.body.style.overflow).toBe('');
  });

  it('stacks: Escape closes the top one, focus returns inside the one below', async () => {
    ({ unmount } = render(<App />));
    click(byText('Open settings').closest('button')!);
    await nextFrame();

    const reset = byText('Reset').closest('button')!;
    reset.focus();
    click(reset);
    await nextFrame();

    const alert = byRole('alertdialog')!;
    expect(alert.contains(document.activeElement)).toBe(true);

    // an alert dialog ignores backdrop clicks
    click(document.querySelector('.ms-backdrop')!);
    expect(byRole('alertdialog')).not.toBeNull();

    press(document.activeElement!, 'Escape');
    await nextFrame();
    expect(byRole('alertdialog')).toBeNull();
    expect(byRole('dialog')).not.toBeNull();
    expect(document.activeElement).toBe(reset);
  });

  it('closes on a backdrop click and with useDialog().dismiss', async () => {
    ({ unmount } = render(<App />));
    click(byText('Open settings').closest('button')!);
    click(document.querySelector('.ms-backdrop')!);
    expect(byRole('dialog')).toBeNull();

    click(byText('Open settings').closest('button')!);
    click(byText('Cancel').closest('button')!);
    expect(byRole('dialog')).toBeNull();
  });

  it('keeps Tab inside', async () => {
    ({ unmount } = render(<App />));
    click(byText('Open settings').closest('button')!);
    await nextFrame();

    const cancel = byText('Cancel').closest('button')!;
    cancel.focus();
    const event = press(cancel, 'Tab');
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement!.getAttribute('aria-label')).toBe('Close');
  });

  it('is controlled with dlgIsOpen / dlgOnOpenChange', () => {
    const onOpenChange = vi.fn();
    ({ unmount } = render(
      <MainSetProvider>
        <Dialog
          dlgIsOpen
          dlgOnOpenChange={onOpenChange}
          aria-label="Controlled"
        >
          <Dialog.Body>Hi</Dialog.Body>
        </Dialog>
      </MainSetProvider>,
    ));

    press(document, 'Escape');
    expect(onOpenChange).toHaveBeenCalledWith(false);
    // still open: the caller owns the state
    expect(byRole('dialog')!.getAttribute('aria-label')).toBe('Controlled');
  });

  it('renders nothing on the server, even when open', () => {
    expect(
      renderToString(
        <MainSetProvider>
          <Dialog dlgIsOpen aria-label="Server">
            Hi
          </Dialog>
        </MainSetProvider>,
      ),
    ).not.toContain('Server');
  });
});

describe('Drawer', () => {
  it('sits at an edge, `end` by default', () => {
    ({ unmount } = render(
      <MainSetProvider>
        <Drawer drwIsOpen drwSize="lg" aria-label="Filters">
          <Drawer.Body>…</Drawer.Body>
        </Drawer>
      </MainSetProvider>,
    ));

    const drawer = byRole('dialog')!;
    expect(drawer.className).toBe(
      'ms-dialog ms-dialog--size-lg ms-dialog--drawer',
    );
    expect(drawer.parentElement!.className).toBe(
      'ms-overlay ms-overlay--placement-end',
    );
  });
});
