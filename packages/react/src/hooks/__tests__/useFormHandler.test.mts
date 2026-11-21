import { describe, expect, it } from 'vitest';

import { readFieldValue } from '../useFormHandler.mjs';

describe('readFieldValue', () => {
  it('reads checked for checkboxes and switches', () => {
    expect(
      readFieldValue({ type: 'checkbox', value: 'on', checked: true }),
    ).toBe(true);
    expect(
      readFieldValue({ type: 'checkbox', value: 'on', checked: false }),
    ).toBe(false);
  });

  it('reads value for everything else', () => {
    expect(readFieldValue({ type: 'email', value: 'a@b.c' })).toBe('a@b.c');
    expect(readFieldValue({ type: 'radio', value: 'pro', checked: true })).toBe(
      'pro',
    );
    expect(readFieldValue({ type: 'select-one', value: 'pro' })).toBe('pro');
  });
});
