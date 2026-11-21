import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// NOTE: the package's folder, found from this file: it runs compiled (`dist/esm/node/`) and,
// in the tests, from its source (`src/node/`)
function findPackageRoot(fromDir: string): string {
  let dir = fromDir;

  while (!fs.existsSync(path.join(dir, 'package.json'))) {
    const parentDir = path.dirname(dir);

    if (parentDir === dir)
      throw new Error(`[docs-kit] no package.json above ${fromDir}`);
    dir = parentDir;
  }

  return dir;
}

const PACKAGE_ROOT = findPackageRoot(
  path.dirname(fileURLToPath(import.meta.url)),
);

/** The kit's compiled app (`dist/esm/app/`): engine, defaults, generated placeholders */
const APP_DIST__PATH = path.join(PACKAGE_ROOT, 'dist', 'esm', 'app');

/**
 * The engine's sources (`src/app/engine/`): they ship in the package, `ms-docs eject` copies
 * them, and the HTML template is used from there
 */
const ENGINE_SOURCE__PATH = path.join(PACKAGE_ROOT, 'src', 'app', 'engine');

export { APP_DIST__PATH, ENGINE_SOURCE__PATH };
