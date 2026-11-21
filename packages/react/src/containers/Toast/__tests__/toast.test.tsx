// @vitest-environment jsdom
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { byText, click, render } from '../../../../test/dom.js';
import { Alert } from '../../../components/Alert/index.mjs';
import { MainSetProvider } from '../../MainSetContext/MainSetProvider.js';
import type { ToastContextValue } from '../ToastContext.mjs';
import { useToast } from '../ToastContext.mjs';

let api: ToastContextValue;
function Capture() {
  api = useToast();
  return null;
}

const toasts = () => [...document.querySelectorAll<HTMLElement>('.ms-toast')];
const advance = (ms: number) => React.act(() => vi.advanceTimersByTime(ms));

let unmount: () => void = () => undefined;
beforeEach(() => {
  vi.useFakeTimers();
  ({ unmount } = render(
    <MainSetProvider>
      <Capture />
    </MainSetProvider>,
  ));
});
afterEach(() => {
  unmount();
  vi.useRealTimers();
});

describe('useToast', () => {
  it('shows a toast in a labelled list and announces it politely', () => {
    React.act(() => {
      api.toast({
        tstTitle: 'Saved',
        tstDescription: 'All changes',
        srfTheme: 'success',
      });
    });

    const region = document.querySelector('.ms-toast-region')!;
    expect(region.tagName).toBe('OL');
    expect(region.getAttribute('aria-label')).toBe('Notifications');
    expect(toasts()[0].className).toBe(
      'ms-toast ms-alert ms-background ms-border ms-surface ms-surface--variant-soft ms-tone-success',
    );
    expect(toasts()[0].getAttribute('role')).toBe('listitem');
    expect(document.querySelector('[aria-live="polite"]')!.textContent).toBe(
      'Saved. All changes',
    );
  });

  it('errors are announced assertively', () => {
    React.act(() => {
      api.toast({ tstTitle: 'Upload failed', srfTheme: 'error' });
    });
    expect(document.querySelector('[aria-live="assertive"]')!.textContent).toBe(
      'Upload failed',
    );
    expect(document.querySelector('[aria-live="polite"]')!.textContent).toBe(
      '',
    );
  });

  it('dismisses itself after its duration, paused while hovered', () => {
    React.act(() => {
      api.toast({ tstTitle: 'Saved' });
    });

    advance(3000);
    const region = document.querySelector('.ms-toast-region')!;
    React.act(() => {
      region.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    });
    advance(10_000);
    expect(toasts()).toHaveLength(1);

    React.act(() => {
      region.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
    });
    advance(1999);
    expect(toasts()).toHaveLength(1);
    advance(1);
    expect(toasts()).toHaveLength(0);
  });

  it('action and close button dismiss it; Infinity stays', () => {
    const onUndo = vi.fn();
    React.act(() => {
      api.toast({
        tstTitle: 'Archived',
        tstDuration: Infinity,
        tstAction: { label: 'Undo', onClick: onUndo },
      });
    });
    advance(60_000);
    expect(toasts()).toHaveLength(1);

    click(byText('Undo').closest('button')!);
    expect(onUndo).toHaveBeenCalled();
    expect(toasts()).toHaveLength(0);

    React.act(() => {
      api.toast({ tstTitle: 'Again' });
    });
    click(document.querySelector('.ms-toast [aria-label="Dismiss"]')!);
    expect(toasts()).toHaveLength(0);
  });

  it('the same tstId replaces it in place; at most 5 are shown', () => {
    React.act(() => {
      api.toast({ tstId: 'upload', tstTitle: 'Uploading…' });
      api.toast({ tstId: 'upload', tstTitle: 'Uploaded' });
    });
    expect(toasts().map((toast) => toast.textContent)).toEqual(['Uploaded']);

    React.act(() => {
      for (let index = 1; index <= 5; index++)
        api.toast({ tstTitle: `#${index}` });
    });
    expect(
      toasts().map(
        (toast) => toast.querySelector('.ms-alert__title')!.textContent,
      ),
    ).toEqual(['#1', '#2', '#3', '#4', '#5']);
  });
});

describe('Alert', () => {
  const html = (element: React.ReactElement) => renderToStaticMarkup(element);

  it('role follows the urgency of the tone', () => {
    expect(html(<Alert>Info</Alert>)).toBe(
      '<div role="status" class="ms-alert ms-background ms-border ms-surface ms-surface--variant-soft ms-tone-info">' +
        '<div class="ms-alert__content"><div class="ms-alert__description">Info</div></div></div>',
    );
    expect(html(<Alert srfTheme="error">Failed</Alert>)).toContain(
      'role="alert"',
    );
  });

  it('icon, title, actions and a labelled close button', () => {
    const markup = html(
      <Alert
        alrtIcon="!"
        alrtTitle="Heads up"
        alrtActions={<a href="/x">Fix</a>}
        alrtOnDismiss={() => undefined}
      >
        Body
      </Alert>,
    );
    expect(markup).toContain(
      '<span class="ms-alert__icon" aria-hidden="true">!</span>',
    );
    expect(markup).toContain('<p class="ms-alert__title">Heads up</p>');
    expect(markup).toContain(
      '<div class="ms-alert__actions"><a href="/x">Fix</a></div>',
    );
    expect(markup).toContain('aria-label="Dismiss"');
    expect(markup).toContain('ms-button--icon');
  });
});
