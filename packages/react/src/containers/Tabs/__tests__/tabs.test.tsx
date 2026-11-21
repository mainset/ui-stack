// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  allByRole,
  byRole,
  click,
  press,
  render,
} from '../../../../test/dom.js';
import { Tabs } from '../Tabs.js';

function AccountTabs(props: Partial<React.ComponentProps<typeof Tabs>>) {
  return (
    <Tabs tbsDefaultId="profile" {...props}>
      <Tabs.List aria-label="Account">
        <Tabs.Trigger tbsId="profile">Profile</Tabs.Trigger>
        <Tabs.Trigger tbsId="team" disabled>
          Team
        </Tabs.Trigger>
        <Tabs.Trigger tbsId="billing">Billing</Tabs.Trigger>
        <Tabs.Trigger tbsId="security">Security</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content tbsId="profile">Profile panel</Tabs.Content>
      <Tabs.Content tbsId="billing">Billing panel</Tabs.Content>
      <Tabs.Content tbsId="security">Security panel</Tabs.Content>
    </Tabs>
  );
}

const tabs = () => allByRole('tab');
const selected = () =>
  tabs().find((tab) => tab.getAttribute('aria-selected') === 'true')!;

let unmount: () => void = () => undefined;
afterEach(() => unmount());

describe('Tabs', () => {
  it('links tabs and panels; only the selected tab is tabbable', () => {
    ({ unmount } = render(<AccountTabs />));

    const [profile, team] = tabs();
    const panel = byRole('tabpanel')!;
    expect(byRole('tablist')!.getAttribute('aria-orientation')).toBe(
      'horizontal',
    );
    expect(profile.getAttribute('aria-controls')).toBe(panel.id);
    expect(panel.getAttribute('aria-labelledby')).toBe(profile.id);
    expect(tabs().map((tab) => tab.tabIndex)).toEqual([0, -1, -1, -1]);
    expect(team.hasAttribute('aria-controls')).toBe(false);
    expect(document.querySelector('.ms-tabs')!.className).toBe(
      'ms-tabs ms-tabs--orientation-horizontal',
    );
  });

  it('arrow keys move and select, skipping disabled tabs, wrapping; Home / End', () => {
    ({ unmount } = render(<AccountTabs />));
    tabs()[0].focus();

    press(document.activeElement!, 'ArrowRight');
    expect(selected().textContent).toBe('Billing');
    expect(document.activeElement).toBe(selected());
    expect(byRole('tabpanel')!.textContent).toBe('Billing panel');

    press(document.activeElement!, 'End');
    expect(selected().textContent).toBe('Security');
    press(document.activeElement!, 'ArrowRight');
    expect(selected().textContent).toBe('Profile');
    press(document.activeElement!, 'ArrowLeft');
    expect(selected().textContent).toBe('Security');
    press(document.activeElement!, 'Home');
    expect(selected().textContent).toBe('Profile');
  });

  it('mirrors the arrow keys in an RTL section', () => {
    ({ unmount } = render(
      <section dir="rtl">
        <AccountTabs />
      </section>,
    ));
    tabs()[0].focus();

    press(document.activeElement!, 'ArrowLeft');
    expect(selected().textContent).toBe('Billing');
    press(document.activeElement!, 'ArrowRight');
    expect(selected().textContent).toBe('Profile');
  });

  it('vertical: up / down; manual activation only moves the focus', () => {
    const onChange = vi.fn();
    ({ unmount } = render(
      <AccountTabs
        tbsOrientation="vertical"
        tbsActivation="manual"
        tbsOnBtnTabChangeClick={onChange}
      />,
    ));
    tabs()[0].focus();

    press(document.activeElement!, 'ArrowRight');
    expect(document.activeElement).toBe(tabs()[0]);

    press(document.activeElement!, 'ArrowDown');
    expect(document.activeElement!.textContent).toBe('Billing');
    expect(selected().textContent).toBe('Profile');

    click(document.activeElement!);
    expect(selected().textContent).toBe('Billing');
    expect(onChange).toHaveBeenCalledWith('billing');
  });
});
