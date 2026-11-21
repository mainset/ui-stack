import { describe, expect, it } from 'vitest';

import {
  FrontmatterError,
  checkFrontmatter,
  parseFrontmatter,
} from './frontmatter.mjs';

const lineOf = (source: string) => {
  try {
    parseFrontmatter(source);
  } catch (error) {
    if (error instanceof FrontmatterError) return error.line;
  }

  return null;
};

describe('parseFrontmatter', () => {
  it('reads scalars and nested fields', () => {
    expect(
      parseFrontmatter(
        [
          '# a comment',
          'title: Button',
          'description: "Quoted: with \\"escapes\\""',
          "label: 'It''s single'",
          'order: -1.5',
          'toc: false',
          'empty:',
          'tilde: ~',
          'sidebar:',
          '  label: Short # a comment',
          '  anchors: True',
          '',
          '  hidden: no',
          'lang: C#',
        ].join('\n'),
      ),
    ).toEqual({
      title: 'Button',
      description: 'Quoted: with "escapes"',
      label: "It's single",
      order: -1.5,
      toc: false,
      empty: null,
      tilde: null,
      sidebar: { label: 'Short', anchors: true, hidden: 'no' },
      lang: 'C#',
    });
  });

  it('keeps a colon inside a plain value', () => {
    expect(parseFrontmatter('title: Theming: overview')).toEqual({
      title: 'Theming: overview',
    });
  });

  it('nests more than one level and closes them by indentation', () => {
    expect(parseFrontmatter('a:\n  b:\n    c: 1\n  d: 2\ne: 3')).toEqual({
      a: { b: { c: 1 }, d: 2 },
      e: 3,
    });
  });

  it.each([
    ['tags:\n  - one', 2, 'a list'],
    ['tags: [one, two]', 1, 'a flow list'],
    ['text: |\n  more', 1, 'a block string'],
    ['title: "open', 1, 'an unclosed quote'],
    ['title: a\ntitle: b', 2, 'a repeated key'],
    ['sidebar:\n\torder: 1', 2, 'a tab'],
    ['a: 1\n  b: 2', 2, 'an unexpected indent'],
    ['just text', 1, 'a line with no key'],
  ])('fails on %j at line %i (%s)', (source, line) => {
    expect(lineOf(source)).toBe(line);
  });
});

describe('checkFrontmatter', () => {
  it('passes the known fields, numbers as text where text is expected', () => {
    const { frontmatter, warnings } = checkFrontmatter({
      title: 2024,
      toc: null,
      sidebar: { order: 2, anchors: true },
    });

    expect(frontmatter).toEqual({
      title: '2024',
      sidebar: { order: 2, anchors: true },
    });
    expect(warnings).toEqual([]);
  });

  it('warns about unknown fields, a typo usually', () => {
    const { warnings } = checkFrontmatter({
      sidbar: { order: 1 },
      sidebar: { ordr: 1 },
    });

    expect(warnings).toEqual([
      'unknown frontmatter field "sidbar" (known: title, description, toc, sidebar)',
      'unknown frontmatter field "sidebar.ordr" (known: label, order, hidden, anchors)',
    ]);
  });

  it.each([
    [{ toc: 'no' }, '"toc" must be a boolean, got "no"'],
    [{ sidebar: { order: 'first' } }, '"sidebar.order" must be a number'],
    [{ sidebar: 'Short' }, '"sidebar" must hold fields'],
  ])('fails on a wrong type: %j', (data, message) => {
    expect(() => checkFrontmatter(data)).toThrow(message);
  });
});
