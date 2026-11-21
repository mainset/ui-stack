// @vitest-environment jsdom
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';

import { render } from '../../../../test/dom.js';
import { AvatarGroup } from '../../../components/AvatarGroup/index.mjs';
import { Avatar } from '../Avatar.js';
import { avatarInitials } from '../avatar-initials.mjs';

let unmount: () => void = () => undefined;

afterEach(() => unmount());

const fire = (target: Element, type: 'load' | 'error') =>
  React.act(() => {
    target.dispatchEvent(new Event(type));
  });

describe('avatarInitials', () => {
  it('takes the first letters of the first and last words', () => {
    expect(avatarInitials('ada lovelace')).toBe('AL');
    expect(avatarInitials('  Grace  Brewster   Hopper ')).toBe('GH');
    expect(avatarInitials('Linus')).toBe('L');
    expect(avatarInitials('')).toBe('');
    expect(avatarInitials('😀 Smile')).toBe('😀S');
  });
});

describe('Avatar', () => {
  it('is one image named by avtName, initials as the fallback', () => {
    expect(
      renderToStaticMarkup(
        <Avatar avtName="Ada Lovelace" avtSize="sm" avtTone="info" />,
      ),
    ).toBe(
      '<span role="img" aria-label="Ada Lovelace" ' +
        'class="ms-avatar ms-avatar--size-sm ms-avatar--shape-circle ms-tone-info">AL</span>',
    );
    // decorative without a name
    expect(renderToStaticMarkup(<Avatar>?</Avatar>)).toContain(
      'aria-hidden="true"',
    );
  });

  it('shows the fallback until the picture loads', () => {
    ({ unmount } = render(<Avatar avtName="Ada Lovelace" avtSrc="/ada.png" />));

    const avatar = document.querySelector('.ms-avatar')!;
    const img = avatar.querySelector('img')!;
    expect(img.getAttribute('alt')).toBe('');
    expect(avatar.textContent).toBe('AL');

    fire(img, 'load');
    expect(avatar.textContent).toBe('');
    expect(avatar.querySelector('img')).not.toBeNull();
  });

  it('drops a picture that fails, and starts over with a new one', () => {
    const { rerender, unmount: unmountAvatar } = render(
      <Avatar avtName="Ada Lovelace" avtSrc="/missing.png" />,
    );
    unmount = unmountAvatar;

    const avatar = document.querySelector('.ms-avatar')!;
    fire(avatar.querySelector('img')!, 'error');
    expect(avatar.querySelector('img')).toBeNull();
    expect(avatar.textContent).toBe('AL');

    rerender(<Avatar avtName="Ada Lovelace" avtSrc="/ada.png" />);
    expect(avatar.querySelector('img')!.getAttribute('src')).toBe('/ada.png');
  });
});

describe('AvatarGroup', () => {
  it('sizes its avatars and counts the ones past avtMax', () => {
    const markup = renderToStaticMarkup(
      <AvatarGroup aria-label="Members" avtSize="xs" avtMax={2}>
        <Avatar avtName="Ada Lovelace" />
        <Avatar avtName="Grace Hopper" avtSize="lg" />
        <Avatar avtName="Linus Torvalds" />
        <Avatar avtName="Margaret Hamilton" />
      </AvatarGroup>,
    );

    expect(markup).toContain(
      'role="group" class="ms-avatar-group" aria-label="Members"',
    );
    expect(markup).toContain('ms-avatar--size-xs ms-avatar--shape-circle">AL');
    // its own size wins
    expect(markup).toContain('ms-avatar--size-lg ms-avatar--shape-circle">GH');
    expect(markup).not.toContain('LT');
    expect(markup).toContain(
      '<span role="img" aria-label="2 more" dir="ltr" class="ms-avatar ms-avatar--size-xs ms-avatar--shape-circle ms-tone-muted">+2</span>',
    );
  });
});
