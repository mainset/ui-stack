import { describe, expect, it } from 'vitest';

import { createTheme, createThemeTokens, parseColor } from './index.mjs';

describe('createThemeTokens', () => {
  // NOTE: the built-in derivation for #0f766e, also documented in docs/css-overrides.md
  const teal = createThemeTokens({ tones: { primary: '#0f766e' } });

  it('derives every role per scheme', () => {
    expect(teal.light).toMatchObject({
      '--ms-color-primary-solid': '#0f766e',
      '--ms-color-primary-solid-hover': '#0a5e57',
      '--ms-color-primary-on-solid': '#f9fafb',
      '--ms-color-primary-subtle': '#e4eeed',
      '--ms-color-primary-subtle-hover': '#d3e3e0',
      '--ms-color-primary-border': '#0f766e',
      '--ms-color-primary-text': '#0f766e',
    });
    expect(teal.dark).toMatchObject({
      '--ms-color-primary-solid-hover': '#428a82',
      '--ms-color-primary-subtle': '#061821',
      '--ms-color-primary-subtle-hover': '#08222a',
      '--ms-color-primary-border': '#659e97',
      '--ms-color-primary-text': '#87b2ad',
    });
  });

  it('the focus ring follows primary unless set', () => {
    expect(teal.light['--ms-color-focus-ring']).toBe('#0f766e');
    expect(teal.dark['--ms-color-focus-ring']).toBe('#87b2ad');
    expect(
      createThemeTokens({
        tones: { primary: '#0f766e' },
        light: { '--ms-color-focus-ring': '#000000' },
      }).light['--ms-color-focus-ring'],
    ).toBe('#000000');
  });

  it('picks the on-solid text with more contrast', () => {
    expect(
      createThemeTokens({ tones: { warning: '#eab308' } }).light[
        '--ms-color-warning-on-solid'
      ],
    ).toBe('#111827');
  });

  it('accepts per-scheme and explicit roles', () => {
    const tokens = createThemeTokens({
      tones: {
        primary: {
          light: '#0f766e',
          dark: { solid: '#14b8a6', onSolid: '#111827' },
        },
        base: { solid: '#1c1917', text: '#1c1917' },
      },
    });

    expect(tokens.dark['--ms-color-primary-solid']).toBe('#14b8a6');
    expect(tokens.dark['--ms-color-primary-on-solid']).toBe('#111827');
    expect(tokens.dark['--ms-color-base-text']).toBe('#1c1917');
  });

  it('null / undefined tones keep the built-in tone', () => {
    expect(createTheme({ tones: { primary: null, error: undefined } })).toBe(
      '',
    );
  });
});

describe('createTheme', () => {
  it('writes the scheme-aware pattern', () => {
    const css = createTheme({ light: { '--ms-border-radius-sm': '0' } });

    expect(css).toBe(
      ':root,[data-theme=light],[data-theme=system]{--ms-border-radius-sm:0}',
    );
    expect(createTheme({ tones: { primary: '#0f766e' } })).toContain(
      '@media (prefers-color-scheme:dark){[data-theme=system]{',
    );
  });

  it.each([
    ['an unparsable color', { tones: { primary: 'teal' } }],
    ['an unknown tone', { tones: { brand: '#000000' } }],
    ['a value closing the rule', { light: { '--ms-x': 'red;}body{x:y' } }],
    ['a value closing the element', { dark: { '--ms-x': '</style>' } }],
    ['a non --ms-* name', { light: { color: 'red' } }],
  ])('rejects %s', (_label, options) => {
    expect(() => createTheme(options as never)).toThrow(TypeError);
  });
});

describe('parseColor', () => {
  it.each([
    ['#0f7', { r: 0, g: 255, b: 119, alpha: 1 }],
    ['#0f766e80', { r: 15, g: 118, b: 110, alpha: 128 / 255 }],
    ['rgb(15 118 110 / 50%)', { r: 15, g: 118, b: 110, alpha: 0.5 }],
    ['rgba(15, 118, 110, 0.5)', { r: 15, g: 118, b: 110, alpha: 0.5 }],
  ])('%s', (input, expected) => {
    expect(parseColor(input)).toEqual(expected);
  });

  it('returns null for unsupported syntax', () => {
    expect(parseColor('hsl(0 0% 0%)')).toBeNull();
    expect(parseColor('var(--x)')).toBeNull();
  });
});
