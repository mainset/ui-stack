import { describe, expect, it } from 'vitest';

import { createSlugger, slugify } from '../slugger.mjs';

describe('slugify', () => {
  it.each([
    ['Hello World', 'hello-world'],
    ['With `code` & "quotes"!', 'with-code--quotes'],
    ['Layout: global', 'layout-global'],
    ['snake_case and kebab-case', 'snake_case-and-kebab-case'],
    ['Tone roles (--ms-tone-*)', 'tone-roles---ms-tone-'],
    ['Кнопка-іконка', 'кнопка-іконка'],
    ['Café crème', 'café-crème'],
    ['x² and ½', 'x-and-'],
    ['🚀 Launch', '-launch'],
  ])('%j → %j (as GitHub)', (text, slug) => {
    expect(slugify(text)).toBe(slug);
  });
});

describe('createSlugger', () => {
  it('numbers repeated ids, never repeating a written one', () => {
    const slug = createSlugger();

    expect(['Usage', 'Usage', 'Usage-1', 'Usage'].map(slug)).toEqual([
      'usage',
      'usage-1',
      'usage-1-1',
      'usage-2',
    ]);
  });

  it('starts over for each page', () => {
    expect(createSlugger()('Usage')).toBe('usage');
    expect(createSlugger()('Usage')).toBe('usage');
  });
});
