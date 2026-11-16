// DOM test helpers for behaviour tests (`// @vitest-environment jsdom`); not part of the build
import React from 'react';
import { createRoot } from 'react-dom/client';

// NOTE: tells React the updates below are wrapped in `act()`
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

function render(ui: React.ReactElement) {
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);

  React.act(() => root.render(ui));

  return {
    container,
    rerender: (next: React.ReactElement) => React.act(() => root.render(next)),
    unmount() {
      React.act(() => root.unmount());
      container.remove();
    },
  };
}

function press(
  target: Element | Document,
  key: string,
  init: ConstructorParameters<typeof KeyboardEvent>[1] = {},
) {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...init,
  });
  React.act(() => {
    target.dispatchEvent(event);
  });
  return event;
}

function click(target: Element) {
  React.act(() => (target as HTMLElement).click());
}

function pointerDown(target: Element) {
  React.act(() => {
    target.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
  });
}

/** Lets `requestAnimationFrame` callbacks (initial focus) run */
async function nextFrame() {
  await React.act(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      }),
  );
}

const byRole = (role: string, root: Document | Element = document) =>
  root.querySelector<HTMLElement>(`[role="${role}"]`);
const allByRole = (role: string, root: Document | Element = document) => [
  ...root.querySelectorAll<HTMLElement>(`[role="${role}"]`),
];
const byText = (text: string, root: Document | Element = document) =>
  [...root.querySelectorAll<HTMLElement>('*')].find(
    (node) => node.textContent === text && node.children.length === 0,
  )!;

export {
  allByRole,
  byRole,
  byText,
  click,
  nextFrame,
  pointerDown,
  press,
  render,
};
