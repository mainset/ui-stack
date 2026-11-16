import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { Input, Select, Textarea } from './Input/index.mjs';

const html = (element: React.ReactElement) => renderToStaticMarkup(element);

describe('Input / Textarea / Select', () => {
  it('Input is a sized text control, uncontrolled', () => {
    expect(html(<Input name="email" type="email" defaultValue="a@b.c" />)).toBe(
      '<input class="ms-control ms-control--size-base ms-input" type="email" name="email" value="a@b.c"/>',
    );
    expect(html(<Input ctlSize="lg" />)).toContain('ms-control--size-lg');
  });

  it('Textarea defaults to 3 rows', () => {
    expect(html(<Textarea name="bio" />)).toBe(
      '<textarea class="ms-control ms-control--size-base ms-input" rows="3" name="bio"></textarea>',
    );
  });

  it('Select wraps the native select for the chevron', () => {
    expect(
      html(
        <Select name="plan" defaultValue="pro">
          <option value="free">Free</option>
          <option value="pro">Pro</option>
        </Select>,
      ),
    ).toBe(
      '<span class="ms-select"><select class="ms-control ms-control--size-base ms-input" name="plan">' +
        '<option value="free">Free</option><option value="pro" selected="">Pro</option></select></span>',
    );
  });
});
