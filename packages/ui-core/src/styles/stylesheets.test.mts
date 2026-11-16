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
