import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { initDocsApp } from '../init.mjs';

const readJson = (filePath: string) =>
  JSON.parse(fs.readFileSync(filePath, 'utf8'));

describe('initDocsApp', () => {
  let root: string;

  beforeEach(() => {
    root = path.join(
      fs.mkdtempSync(path.join(os.tmpdir(), 'docs-init-')),
      'my-docs',
    );
  });

  afterEach(() =>
    fs.rmSync(path.dirname(root), { recursive: true, force: true }),
  );

  it('creates a project: its config, routes, home page and first section', () => {
    const { created, skipped, updated } = initDocsApp({ root });

    expect(created).toEqual(
      expect.arrayContaining([
        '.gitignore',
        'config/webpack.config.mjs',
        'package.json',
        'src/docs.config.tsx',
        'src/routes.tsx',
        'src/pages/home/home.page.tsx',
        'src/pages/docs/content/en/index.md',
        'src/i18n/locales/en/translation.json',
      ]),
    );
    expect(skipped).toEqual([]);
    expect(updated).toEqual([]);

    const packageJson = readJson(path.join(root, 'package.json'));

    expect(packageJson.name).toBe('my-docs');
    expect(packageJson.scripts.build).toBe('ms-cli web-app --exec build');
    expect(Object.keys(packageJson.dependencies)).toEqual(
      expect.arrayContaining(['@mainset/docs-kit', 'react', 'react-router']),
    );
    expect(packageJson.devDependencies['@mainset/cli']).toMatch(/^\^/);
  });

  it('never overwrites a file; package.json only gets what it lacks', () => {
    fs.mkdirSync(path.join(root, 'src'), { recursive: true });
    fs.writeFileSync(path.join(root, 'src/routes.tsx'), 'mine');
    fs.writeFileSync(
      path.join(root, 'package.json'),
      JSON.stringify({ name: 'mine', scripts: { build: 'my build' } }),
    );

    const { skipped, updated } = initDocsApp({ root });
    const packageJson = readJson(path.join(root, 'package.json'));

    expect(skipped).toEqual(['src/routes.tsx']);
    expect(updated).toEqual(['package.json']);
    expect(fs.readFileSync(path.join(root, 'src/routes.tsx'), 'utf8')).toBe(
      'mine',
    );
    expect(packageJson.name).toBe('mine');
    expect(packageJson.scripts.build).toBe('my build');
    expect(packageJson.scripts.dev).toContain('ms-cli web-app --exec serve');

    expect(initDocsApp({ root }).updated).toEqual([]);
  });
});
