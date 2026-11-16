import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { Spinner } from './Spinner/index.mjs';
import { VisuallyHidden } from './VisuallyHidden/index.mjs';

const html = (element: React.ReactElement) => renderToStaticMarkup(element);

describe('Spinner', () => {
  it('is a status with an announced label', () => {
    expect(html(<Spinner />)).toBe(
      '<span role="status" class="ms-spinner ms-spinner--size-base">' +
        '<span class="ms-visually-hidden">Loading</span></span>',
    );
    expect(html(<Spinner spnSize="sm" spnLabel="Saving" />)).toContain(
      'ms-spinner--size-sm',
    );
  });
});

describe('VisuallyHidden', () => {
  it('hides visually, optionally until focused', () => {
    expect(html(<VisuallyHidden>Hi</VisuallyHidden>)).toBe(
      '<span class="ms-visually-hidden">Hi</span>',
    );
    expect(
      html(
        <VisuallyHidden vhAs="a" href="#main" vhIsFocusable>
          Skip
        </VisuallyHidden>,
      ),
    ).toBe('<a class="ms-visually-hidden-focusable" href="#main">Skip</a>');
  });
});
