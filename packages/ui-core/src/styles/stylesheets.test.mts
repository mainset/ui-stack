import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { expect, it } from 'vitest';

const elementsDir = path.join(import.meta.dirname, '../elements');

it('the framework-agnostic bundle includes every element stylesheet', () => {
  const index = readFileSync(
    path.join(import.meta.dirname, 'index.scss'),
    'utf8',
  );
  const missing = readdirSync(elementsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((dir) =>
      readdirSync(path.join(elementsDir, dir.name))
        .filter((file) => file.endsWith('.scss') && !file.startsWith('_'))
        .map((file) => `../elements/${dir.name}/${file.replace('.scss', '')}`),
    )
    .filter((stylesheet) => !index.includes(`@use '${stylesheet}'`));

  expect(missing).toEqual([]);
});

it('tokens pointing at scheme colors are declared on every theme root', () => {
  // A `var()` inside a custom property resolves where it's declared: on `:root` only, a scheme
  // color would keep its light value inside `[data-theme="dark"]`
  const offenders = readdirSync(elementsDir, { recursive: true })
    .map(String)
    .filter((file) => file.endsWith('.scss'))
    .flatMap((file) => {
      const source = readFileSync(path.join(elementsDir, file), 'utf8');
      const rootOnlyBlocks = source.match(/:where\(:root\)\s*\{[^}]*\}/g) ?? [];

      return rootOnlyBlocks
        .filter((block) => /var\(--ms-(color|tone)-/.test(block))
        .map(() => file);
    });

  expect(offenders).toEqual([]);
});
