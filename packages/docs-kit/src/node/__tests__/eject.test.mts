import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import {
  ENGINE_FILE_TARGETS,
  ejectDocsApp,
  toProjectSource,
} from '../eject.mjs';
import { ENGINE_SOURCE__PATH } from '../engine-paths.mjs';

describe('toProjectSource', () => {
  it("imports the kit by its name, and the engine's files at their new places", () => {
    const source = [
      "import { preloadDocsRoute } from '../../index.mjs';",
      "import { ROUTES } from './app.routes.js';",
      "import { APP_ROOT__ID } from './app.constants.js';",
      "import other from './not-an-engine-file.js';",
    ].join('\n');

    expect(toProjectSource('index.ssr.ts', source)).toBe(
      [
        "import { preloadDocsRoute } from '@mainset/docs-kit';",
        "import { ROUTES } from './app.routes';",
        "import { APP_ROOT__ID } from './app.constants';",
        "import other from './not-an-engine-file.js';",
      ].join('\n'),
    );
  });

  it('points the SSR server config (in config/) at src/', () => {
    expect(
      toProjectSource(
        'ssr-server.config.mts',
        "import provideServerReactApp from './app.server.js';",
      ),
    ).toBe("import provideServerReactApp from '../src/app.server';");
  });
});

describe('ejectDocsApp', () => {
  let root: string;

  afterEach(() => fs.rmSync(root, { recursive: true, force: true }));

  it('copies every engine file, none of them importing the kit by a relative path', () => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'docs-eject-'));

    const { files } = ejectDocsApp({ root });

    expect(files.sort()).toEqual(Object.values(ENGINE_FILE_TARGETS).sort());
    // NOTE: every file of the engine folder is listed, so none is left behind
    expect(fs.readdirSync(ENGINE_SOURCE__PATH).sort()).toEqual(
      Object.keys(ENGINE_FILE_TARGETS).sort(),
    );
    files.forEach((file) => {
      const source = fs.readFileSync(path.join(root, file), 'utf8');

      expect(source).not.toMatch(
        /\.\.\/\.\.\/index\.mjs|from '\.\/[\w.-]+\.js'/,
      );
    });
  });

  it("refuses to overwrite the project's files", () => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'docs-eject-'));
    fs.mkdirSync(path.join(root, 'src'));
    fs.writeFileSync(path.join(root, 'src', 'index.ssr.ts'), '// mine');

    expect(() => ejectDocsApp({ root })).toThrow(
      'eject would overwrite: src/index.ssr.ts',
    );
    expect(
      fs.readFileSync(path.join(root, 'src', 'index.ssr.ts'), 'utf8'),
    ).toBe('// mine');
  });
});
