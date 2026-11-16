import { describe, expect, it } from 'vitest';

import { spacingRecipe, spacingStyleProps } from '../elements/index.mjs';
import { LAYOUT__CLASS_NAME_CONFIG } from '../elements/index.mjs';
import { composeStyleProps } from '../utils/index.mjs';
import {
  boxStyleProps,
  buttonRecipe,
  controlRecipe,
  inputRecipe,
  selectWrapperRecipe,
  surfaceRecipe,
  toneRecipe,
} from './index.mjs';

const classes = (className: string) => className.split(' ').sort();

describe('recipes', () => {
  it('buttonRecipe composes surface, control, button and tone', () => {
    expect(
      classes(
        buttonRecipe({
          srfVariant: 'outlined',
          srfTheme: 'error',
          ctlSize: 'sm',
        }),
      ),
    ).toEqual(
      classes(
        'ms-background ms-border ms-surface ms-surface--hover-all ms-surface--variant-outlined ' +
          'ms-control ms-control--size-sm ms-button ms-tone-error',
      ),
    );
  });

  it('controlRecipe maps the size', () => {
    expect(controlRecipe({ ctlSize: 'lg' })).toBe(
      'ms-control ms-control--size-lg',
    );
  });

  it('surfaceRecipe adds the tone class only when a tone is set', () => {
    expect(surfaceRecipe({ srfVariant: 'soft' })).not.toMatch(/ms-tone-/);
    expect(surfaceRecipe({ srfTheme: 'success' })).toMatch(
      /(^| )ms-tone-success( |$)/,
    );
  });

  it('toneRecipe', () => {
    expect(toneRecipe('warning')).toBe('ms-tone-warning');
    expect(toneRecipe(undefined)).toBe('');
  });
});

describe('spacing', () => {
  // NOTE: spacing has no base class, each class is self-contained
  it('a plain size is one class', () => {
    expect(
      spacingRecipe({ spcType: 'p', spcScale: 'block', spcSize: 'sm' }),
    ).toBe('ms-spacing--p-block-sm');
  });

  it('a responsive size adds a breakpoint class + its CSS variable', () => {
    const { className, style } = spacingStyleProps({
      spcType: 'pv',
      spcScale: 'section',
      spcSize: { base: 'xs', md: 'lg' },
    });

    expect(classes(className)).toEqual(
      classes('ms-spacing--pv-section-xs ms-spacing--pv@md'),
    );
    expect(style).toEqual({
      '--ms-spacing-pv-at-md': 'var(--ms-spacing-scale-section-lg)',
    });
  });

  it('ignores options that are not declared (no arbitrary CSS via props)', () => {
    const { style } = spacingStyleProps({
      spcType: 'p',
      spcScale: 'block',
      // @ts-expect-error -- not an option
      spcSize: { md: 'calc(100vh)' },
    });

    expect(style).toEqual({});
  });
});

describe('composeStyleProps', () => {
  it('returns the css-var of a responsive gap', () => {
    const { className, style } = composeStyleProps(
      [LAYOUT__CLASS_NAME_CONFIG],
      { layGapSize: { base: 'sm', md: 'lg' } },
    );

    expect(className).toContain('ms-layout--gap-size@md');
    expect(Object.keys(style)).toEqual(['--ms-layout-gap-size-at-md']);
  });
});

describe('boxStyleProps', () => {
  it('combines background, border and responsive spacing', () => {
    const { className, style } = boxStyleProps({
      bgColor: 'muted',
      brdRadius: 'sm',
      spcType: 'p',
      spcScale: 'block',
      spcSize: { base: 'sm', md: 'lg' },
    });

    expect(classes(className)).toEqual(
      classes(
        'ms-background ms-background--color-muted ms-border ms-border--radius-sm ' +
          'ms-spacing--p-block-sm ms-spacing--p@md',
      ),
    );
    expect(style).toEqual({
      '--ms-spacing-p-at-md': 'var(--ms-spacing-scale-block-lg)',
    });
  });
});

describe('inputRecipe', () => {
  it('is a sized control with the field look', () => {
    expect(inputRecipe()).toBe('ms-control ms-control--size-base ms-input');
    expect(inputRecipe({ ctlSize: 'lg' })).toBe(
      'ms-control ms-control--size-lg ms-input',
    );
    expect(selectWrapperRecipe()).toBe('ms-select');
  });
});
