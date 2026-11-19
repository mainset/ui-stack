// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  allByRole,
  byRole,
  byText,
  click,
  pointerDown,
  press,
  render,
} from '../../../test/dom.js';
import { Button } from '../../components/Button/index.mjs';
import { Dialog } from '../Dialog/index.mjs';
import { MainSetProvider } from '../MainSetContext/MainSetProvider.js';
import { Menu } from './Menu.js';

const onRename = vi.fn();
const onDelete = vi.fn();
const onExport = vi.fn((event: React.MouseEvent) => event.preventDefault());

function Actions() {
  return (
    <Menu>
      <Menu.Trigger>
        <Button>Actions</Button>
      </Menu.Trigger>
      <Menu.List>
        <Menu.Item mnuOnSelect={onRename}>Rename</Menu.Item>
        <Menu.Item mnuIsDisabled>Duplicate</Menu.Item>
        <Menu.Item mnuAs="a" href="/export" onClick={onExport}>
          Export
        </Menu.Item>
        <Menu.Separator />
        <Menu.Group mnuLabel="Danger zone">
          <Menu.Item mnuTone="error" mnuOnSelect={onDelete}>
            Delete
          </Menu.Item>
          <Menu.Item>Deactivate</Menu.Item>
        </Menu.Group>
      </Menu.List>
    </Menu>
  );
}

const trigger = () => byText('Actions').closest('button')!;
const focused = () => document.activeElement!.textContent;

let unmount: () => void = () => undefined;
afterEach(() => {
  unmount();
  vi.clearAllMocks();
});

describe('Menu', () => {
  it('a menu button: named by its trigger, opens on the first item', () => {
    ({ unmount } = render(<Actions />));
    expect(trigger().getAttribute('aria-haspopup')).toBe('menu');

    click(trigger());
    const menu = byRole('menu')!;
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(menu.getAttribute('aria-labelledby')).toBe(trigger().id);
    expect(menu.className).toBe('ms-popover ms-menu');
    expect(allByRole('menuitem').map((item) => item.tabIndex)).toEqual([
      -1, -1, -1, -1, -1,
    ]);
    expect(focused()).toBe('Rename');
    expect(byText('Delete').className).toBe(
      'ms-menu__item ms-menu__item--toned ms-tone-error',
    );
    expect(byRole('group')!.getAttribute('aria-labelledby')).toBe(
      byText('Danger zone').id,
    );
  });

  it('Up on the trigger opens on the last item; arrows wrap, Home / End', () => {
    ({ unmount } = render(<Actions />));
    trigger().focus();

    press(trigger(), 'ArrowUp');
    expect(focused()).toBe('Deactivate');
    press(document.activeElement!, 'ArrowDown');
    expect(focused()).toBe('Rename');
    // disabled items are focusable
    press(document.activeElement!, 'ArrowDown');
    expect(focused()).toBe('Duplicate');
    press(document.activeElement!, 'End');
    expect(focused()).toBe('Deactivate');
    press(document.activeElement!, 'Home');
    expect(focused()).toBe('Rename');
  });

  it('typeahead jumps by text; a repeated letter cycles', () => {
    ({ unmount } = render(<Actions />));
    click(trigger());

    press(document.activeElement!, 'e');
    expect(focused()).toBe('Export');
    press(document.activeElement!, 'd');
    // "ed" matches nothing: stays
    expect(focused()).toBe('Export');
  });

  it('a repeated letter cycles through the items starting with it', () => {
    ({ unmount } = render(<Actions />));
    click(trigger());

    press(document.activeElement!, 'd');
    expect(focused()).toBe('Duplicate');
    press(document.activeElement!, 'd');
    expect(focused()).toBe('Delete');
    press(document.activeElement!, 'd');
    expect(focused()).toBe('Deactivate');
  });

  it('selecting runs the action, closes, returns the focus; disabled does nothing', () => {
    ({ unmount } = render(<Actions />));
    click(trigger());

    click(byText('Duplicate'));
    expect(byRole('menu')).not.toBeNull();

    click(byText('Delete'));
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(byRole('menu')).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it('Escape closes and returns the focus, inside a dialog the dialog stays', () => {
    ({ unmount } = render(
      <MainSetProvider>
        <Dialog dlgIsOpen aria-label="Project">
          <Actions />
        </Dialog>
      </MainSetProvider>,
    ));
    click(trigger());

    press(document.activeElement!, 'Escape');
    expect(byRole('menu')).toBeNull();
    expect(document.activeElement).toBe(trigger());
    expect(byRole('dialog')).not.toBeNull();
  });

  it('Tab and a press outside close it without taking the focus back', () => {
    ({ unmount } = render(<Actions />));
    click(trigger());
    const event = press(document.activeElement!, 'Tab');
    expect(event.defaultPrevented).toBe(false);
    expect(byRole('menu')).toBeNull();

    click(trigger());
    pointerDown(document.body);
    expect(byRole('menu')).toBeNull();
  });

  it('Space selects a link item', () => {
    ({ unmount } = render(<Actions />));
    click(trigger());
    press(document.activeElement!, 'e');

    press(document.activeElement!, ' ');
    expect(onExport).toHaveBeenCalledTimes(1);
  });

  it('radio items: one checked, focused on open, selecting checks and closes', () => {
    function Language() {
      const [locale, setLocale] = React.useState('uk');

      return (
        <Menu>
          <Menu.Trigger>
            <Button>Language</Button>
          </Menu.Trigger>
          <Menu.List>
            <Menu.RadioGroup mnuValue={locale} mnuOnValueChange={setLocale}>
              <Menu.RadioItem mnuValue="en">English</Menu.RadioItem>
              <Menu.RadioItem mnuValue="uk">Українська</Menu.RadioItem>
            </Menu.RadioGroup>
          </Menu.List>
        </Menu>
      );
    }

    ({ unmount } = render(<Language />));
    const languageTrigger = () => byText('Language').closest('button')!;

    click(languageTrigger());
    const items = allByRole('menuitemradio');
    expect(items.map((item) => item.getAttribute('aria-checked'))).toEqual([
      'false',
      'true',
    ]);
    expect(focused()).toBe('Українська');

    press(document.activeElement!, 'ArrowUp');
    expect(focused()).toBe('English');

    click(items[0]);
    expect(byRole('menu')).toBeNull();

    click(languageTrigger());
    expect(focused()).toBe('English');
  });
});
