import { describe, expect, it } from 'vitest';

import { defineDocsSite } from './define-docs.mjs';
import {
  localeHomePath,
  sectionPagePath,
  splitLocalePath,
  switchLocalePath,
} from './locale-path.mjs';

const SITE = defineDocsSite({
  title: 'Docs',
  defaultLocale: 'en',
  locales: { en: { label: 'English' }, uk: { label: 'Українська' } },
  sections: [],
});
const SECTION = {
  id: 'ui-core',
  path: 'ui-core',
  pagePath: (pageKey: string) => pageKey,
} as Parameters<typeof sectionPagePath>[1];

describe('locale paths', () => {
  it('leaves the default locale unprefixed', () => {
    expect(localeHomePath(SITE, 'en')).toBe('/');
    expect(localeHomePath(SITE, 'uk')).toBe('/uk');
    expect(sectionPagePath(SITE, SECTION, 'en')).toBe('/ui-core');
    expect(sectionPagePath(SITE, SECTION, 'uk', 'layout/box')).toBe(
      '/uk/ui-core/layout/box',
    );
  });

  it('tells the locale of a path', () => {
    expect(splitLocalePath(SITE, '/uk/ui-core')).toEqual({
      locale: 'uk',
      restPath: '/ui-core',
    });
    expect(splitLocalePath(SITE, '/uk')).toEqual({
      locale: 'uk',
      restPath: '/',
    });
    expect(splitLocalePath(SITE, '/ui-core')).toEqual({
      locale: 'en',
      restPath: '/ui-core',
    });
    // NOTE: the default locale has no prefix, so `/en/…` is just a path
    expect(splitLocalePath(SITE, '/en/x').restPath).toBe('/en/x');
  });

  it('switches a path to another locale', () => {
    expect(switchLocalePath(SITE, '/ui-core/layout/box', 'uk')).toBe(
      '/uk/ui-core/layout/box',
    );
    expect(switchLocalePath(SITE, '/uk/ui-core/layout/box', 'en')).toBe(
      '/ui-core/layout/box',
    );
    expect(switchLocalePath(SITE, '/', 'uk')).toBe('/uk');
    expect(switchLocalePath(SITE, '/uk', 'en')).toBe('/');
  });
});
