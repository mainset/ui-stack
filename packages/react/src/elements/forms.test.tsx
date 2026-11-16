import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { Field } from '../components/Field/index.mjs';
import { Checkbox, Radio, Switch } from './Choice/index.mjs';
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

describe('Checkbox / Radio / Switch', () => {
  it('Checkbox is a native input + the icon in one wrapper', () => {
    expect(html(<Checkbox name="terms" defaultChecked />)).toBe(
      '<span class="ms-checkbox"><input type="checkbox" class="ms-checkbox__input" name="terms" checked=""/>' +
        '<svg class="ms-checkbox__icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">' +
        '<path class="ms-checkbox__check" d="M3.75 8.25l2.75 2.75 5.75-6"></path>' +
        '<path class="ms-checkbox__dash" d="M4.5 8h7"></path></svg></span>',
    );
  });

  it('children become a clickable label', () => {
    expect(
      html(
        <Radio name="plan" value="pro">
          Pro
        </Radio>,
      ),
    ).toBe(
      '<label class="ms-choice"><input type="radio" class="ms-radio" name="plan" value="pro"/><span>Pro</span></label>',
    );
  });

  it('Switch is a checkbox announced as a switch', () => {
    expect(html(<Switch name="email" />)).toBe(
      '<span class="ms-switch"><input type="checkbox" role="switch" class="ms-switch__input" name="email"/>' +
        '<span class="ms-switch__thumb" aria-hidden="true"></span></span>',
    );
  });

  it('the icon markup matches the ui-core snippet for plain HTML', async () => {
    const { CHECKBOX_ICON__SVG } = await import('@mainset/ui-core');
    const markup = html(<Checkbox />);

    expect(markup).toContain(CHECKBOX_ICON__SVG.replace(/"\/>/g, '"></path>'));
  });
});

describe('Field', () => {
  it('wires label, hint, error and required onto the control', () => {
    const markup = html(
      <Field
        fldLabel="Email"
        fldHint="We never share it"
        fldError="Enter a valid email"
        fldIsRequired
        fldControlId="email"
      >
        <Input name="email" type="email" />
      </Field>,
    );

    expect(markup).toBe(
      '<div class="ms-field">' +
        '<label class="ms-label ms-label--required" for="email">Email</label>' +
        '<input class="ms-control ms-control--size-base ms-input" type="email" id="email" required="" ' +
        'aria-describedby="email-hint email-error" aria-invalid="true" name="email"/>' +
        '<p class="ms-field__hint" id="email-hint">We never share it</p>' +
        '<p class="ms-field__error" id="email-error">Enter a valid email</p>' +
        '</div>',
    );
  });

  it("generates an id and keeps the control's own aria-describedby", () => {
    const markup = html(
      <Field fldLabel="Name">
        <Input name="name" aria-describedby="extra" />
      </Field>,
    );
    const id = /for="([^"]+)"/.exec(markup)?.[1];

    expect(id).toBeTruthy();
    expect(markup).toContain(`id="${id}"`);
    expect(markup).toContain('aria-describedby="extra"');
    expect(markup).not.toContain('aria-invalid');
  });
});
