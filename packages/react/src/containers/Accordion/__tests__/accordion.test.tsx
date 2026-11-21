// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { click, press, render } from '../../../../test/dom.js';
import { Accordion } from '../Accordion.js';

function Faq(props: Partial<React.ComponentProps<typeof Accordion>>) {
  return (
    <Accordion accDefaultOpenIds={['shipping']} {...props}>
      <Accordion.Item accId="shipping">
        <Accordion.Trigger>Shipping</Accordion.Trigger>
        <Accordion.Panel>Free over 50 €.</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item accId="returns">
        <Accordion.Trigger>Returns</Accordion.Trigger>
        <Accordion.Panel>30 days.</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item accId="legacy" accIsDisabled>
        <Accordion.Trigger>Legacy</Accordion.Trigger>
        <Accordion.Panel>…</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

const triggers = () => [
  ...document.querySelectorAll<HTMLButtonElement>('.ms-disclosure__trigger'),
];
const expanded = () =>
  triggers()
    .filter((trigger) => trigger.getAttribute('aria-expanded') === 'true')
    .map((trigger) => trigger.textContent);

let unmount: () => void = () => undefined;
afterEach(() => unmount());

describe('Accordion', () => {
  it('a button in a heading, its panel a region named by it', () => {
    ({ unmount } = render(<Faq accHeadingAs="h2" />));

    const [shipping] = triggers();
    const panel = document.getElementById(
      shipping.getAttribute('aria-controls')!,
    )!;
    expect(shipping.parentElement!.tagName).toBe('H2');
    expect(panel.getAttribute('role')).toBe('region');
    expect(panel.getAttribute('aria-labelledby')).toBe(shipping.id);
    expect(panel.dataset.state).toBe('open');
    expect(panel.hasAttribute('inert')).toBe(false);

    const collapsed = document.getElementById(
      triggers()[1].getAttribute('aria-controls')!,
    )!;
    expect(collapsed.dataset.state).toBe('closed');
    expect(collapsed.hasAttribute('inert')).toBe(true);
  });

  it('single: one open at a time, collapsible by default', () => {
    ({ unmount } = render(<Faq />));

    click(triggers()[1]);
    expect(expanded()).toEqual(['Returns']);
    click(triggers()[1]);
    expect(expanded()).toEqual([]);
  });

  it('single, not collapsible: the open item stays open', () => {
    ({ unmount } = render(<Faq accIsCollapsible={false} />));

    click(triggers()[0]);
    expect(expanded()).toEqual(['Shipping']);
    expect(triggers()[0].getAttribute('aria-disabled')).toBe('true');
  });

  it('multiple: independent; controlled reports the ids', () => {
    const onChange = vi.fn();
    ({ unmount } = render(
      <Faq accType="multiple" accOnOpenChange={onChange} />,
    ));

    click(triggers()[1]);
    expect(expanded()).toEqual(['Shipping', 'Returns']);
    expect(onChange).toHaveBeenLastCalledWith(['shipping', 'returns']);
  });

  it('Up / Down / Home / End move between enabled triggers', () => {
    ({ unmount } = render(<Faq />));
    triggers()[0].focus();

    press(document.activeElement!, 'ArrowDown');
    expect(document.activeElement).toBe(triggers()[1]);
    press(document.activeElement!, 'ArrowDown');
    expect(document.activeElement).toBe(triggers()[0]);
    press(document.activeElement!, 'End');
    expect(document.activeElement).toBe(triggers()[1]);
  });
});
