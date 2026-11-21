import fs from 'node:fs';
import path from 'node:path';

import { ENGINE_SOURCE__PATH } from './engine-paths.mjs';

// `ms-docs eject`: copies the engine (entries, server render, routes, HTML template) into the
// project, to change what the kit doesn't let you configure. `docsWebpackConfig()` then builds
// the project's copies instead of the kit's: same webpack config, same `@docs-app/*` modules.
// The copies call the kit's public API, so the logic they use still updates with the kit.

/** Engine file (in the kit) → its place in the project */
const ENGINE_FILE_TARGETS: Record<string, string> = {
  'index.ssr.ts': 'src/index.ssr.ts',
  'index.csr.ts': 'src/index.csr.ts',
  'index.template.html': 'src/index.template.html',
  'app.browser.tsx': 'src/app.browser.tsx',
  'app.server.tsx': 'src/app.server.tsx',
  'app.routes.tsx': 'src/app.routes.tsx',
  'app.constants.ts': 'src/app.constants.ts',
  'docs-app.d.ts': 'src/@types/docs-app.d.ts',
  'ssr-server.config.mts': 'config/ssr-server.config.mts',
};

const KIT_IMPORT__REGEX = /(['"])\.\.\/\.\.\/index\.mjs\1/g;
const ENGINE_IMPORT__REGEX = /(['"])\.\/([\w.-]+)\.js\1/g;

/**
 * An engine file as the project's: the kit's own modules become `@mainset/docs-kit`, the
 * engine's imports of one another point at the files' new places (no `.js` extension).
 */
function toProjectSource(fileName: string, source: string): string {
  const target = ENGINE_FILE_TARGETS[fileName];
  const targetDir = path.posix.dirname(target);

  return source
    .replace(KIT_IMPORT__REGEX, '$1@mainset/docs-kit$1')
    .replace(ENGINE_IMPORT__REGEX, (match, quote: string, name: string) => {
      const importedFile = Object.keys(ENGINE_FILE_TARGETS).find(
        (file) => file.replace(/\.[^.]+$/, '') === name,
      );

      if (!importedFile) return match;

      const importedTarget = ENGINE_FILE_TARGETS[importedFile].replace(
        /\.[^.]+$/,
        '',
      );
      const relative = path.posix.relative(targetDir, importedTarget);

      return `${quote}${relative.startsWith('.') ? relative : `./${relative}`}${quote}`;
    });
}

interface EjectResult {
  files: string[];
}

/** Copies the engine into {root}; refuses to overwrite a file the project already has */
function ejectDocsApp({ root = process.cwd() }: { root?: string } = {}) {
  const existing = Object.values(ENGINE_FILE_TARGETS).filter((target) =>
    fs.existsSync(path.join(root, target)),
  );

  if (existing.length > 0) {
    throw new Error(
      `[docs-kit] eject would overwrite: ${existing.join(', ')}. Move them away first.`,
    );
  }

  const result: EjectResult = { files: [] };

  Object.entries(ENGINE_FILE_TARGETS).forEach(([fileName, target]) => {
    const source = fs.readFileSync(
      path.join(ENGINE_SOURCE__PATH, fileName),
      'utf8',
    );
    const targetPath = path.join(root, target);

    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, toProjectSource(fileName, source));
    result.files.push(target);
  });

  return result;
}

export { ENGINE_FILE_TARGETS, ejectDocsApp, toProjectSource };
export type { EjectResult };
