import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { checkCategoriesConfig } from '../categories-loader.mjs';

describe('checkCategoriesConfig', () => {
  let contentDir: string;
  const structure = (categories: unknown) =>
    checkCategoriesConfig(categories, { contentDir, isLocale: false });
  const labels = (categories: unknown) =>
    checkCategoriesConfig(categories, { contentDir, isLocale: true });

  beforeEach(() => {
    contentDir = path.join(
      fs.mkdtempSync(path.join(os.tmpdir(), 'docs-categories-')),
      'content',
    );
    fs.mkdirSync(path.join(contentDir, 'en', '01-getting-started'), {
      recursive: true,
    });
    fs.mkdirSync(path.join(contentDir, 'en', '02-elements', '01-layout'), {
      recursive: true,
    });
    // NOTE: a translation without folders: its pages fall back to the default locale's
    fs.mkdirSync(path.join(contentDir, 'uk'));
  });

  afterEach(() =>
    fs.rmSync(path.dirname(contentDir), { recursive: true, force: true }),
  );

  it('takes the folders by their paths without the order prefixes', () => {
    expect(
      structure({
        'getting-started': { order: 2, collapsed: false },
        'elements/layout': {},
      }),
    ).toEqual([]);
    expect(
      labels({ elements: 'Елементи', 'elements/layout': 'Макет' }),
    ).toEqual([]);
  });

  it('reports a key naming no folder', () => {
    expect(structure({ '01-getting-started': {}, layout: {} })).toEqual([
      '"01-getting-started" is no folder of the section (keys are folder paths without the "01-" prefixes)',
      '"layout" is no folder of the section (keys are folder paths without the "01-" prefixes)',
    ]);
  });

  it('keeps the structure out of the labels, and the labels out of the structure', () => {
    expect(
      structure({
        elements: 'Elements',
        'getting-started': { label: 'Start', colapsed: false },
        'elements/layout': { collapsed: 'no' },
      }),
    ).toEqual([
      '"elements": { order, collapsed } is expected (labels are in content/<locale>/_categories.json)',
      '"getting-started".label: labels are in content/<locale>/_categories.json',
      '"getting-started": unknown field "colapsed"',
      '"elements/layout".collapsed: a boolean is expected',
    ]);
    expect(labels({ elements: { collapsed: false } })).toEqual([
      '"elements": a label is expected (order and collapsed are in content/_categories.json)',
    ]);
  });

  it('takes a `path` of one URL segment, unique among its siblings', () => {
    expect(
      structure({
        elements: { path: 'components' },
        'elements/layout': { path: 'box' },
      }),
    ).toEqual([]);
    expect(structure({ elements: { path: 'ui/components' } })).toEqual([
      '"elements".path: one URL segment is expected (letters, digits, "-", "_", ".", "~"), not "ui/components"',
    ]);
    // NOTE: the folder `elements` keeps its own name, so "getting-started" can't take it
    expect(structure({ 'getting-started': { path: 'elements' } })).toEqual([
      '"elements" and "getting-started" have the same URL segment "elements"',
    ]);
  });

  it('expects an object', () => {
    expect(structure(['elements'])).toHaveLength(1);
    expect(labels('Elements')).toHaveLength(1);
  });
});
