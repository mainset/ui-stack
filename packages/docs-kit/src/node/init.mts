import fs from 'node:fs';
import path from 'node:path';

import { INIT_TEMPLATE__PATH, PACKAGE_ROOT } from './engine-paths.mjs';

// `ms-docs init [dir]`: a new docs project, the home page included: the project's pages are its
// own (`src/routes.tsx`), the kit ships no home page. It never overwrites a file: an existing
// `package.json` only gets the scripts and dependencies it lacks.

/** Template files whose name npm would drop or rename on publish */
const TEMPLATE_FILE_RENAMES: Record<string, string> = {
  gitignore: '.gitignore',
};

const PROJECT_SCRIPTS: Record<string, string> = {
  dev: 'cross-env NODE_ENV=development ms-cli web-app --exec serve',
  build: 'ms-cli web-app --exec build',
  serve: 'ms-cli web-app --exec serve-static',
  'build:static': 'ms-cli web-app --exec build && ms-docs export',
  'preview:static': 'ms-docs preview',
};

/** The kit's peers the project builds with, not ships */
const BUILD_PEERS = ['@mainset/bundler-webpack', '@mainset/cli'];

interface PackageJson {
  name?: string;
  version: string;
  private?: boolean;
  type?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

/** A peer range as a dependency's: `>=0.7.6` → `^0.7.6` (an open range would take any major) */
const toDependencyRange = (range: string) => range.replace(/^>=(\S+)$/, '^$1');

/** The project's `package.json` fields: the kit, its peers, the build tools, the scripts */
function projectPackageFields(): Required<
  Pick<PackageJson, 'scripts' | 'dependencies' | 'devDependencies'>
> {
  const kit = JSON.parse(
    fs.readFileSync(path.join(PACKAGE_ROOT, 'package.json'), 'utf8'),
  ) as PackageJson;
  const peers = Object.entries(kit.peerDependencies ?? {}).map(
    ([name, range]) => [name, toDependencyRange(range)] as const,
  );
  const kitDevDependency = (name: string) => kit.devDependencies?.[name];

  return {
    scripts: PROJECT_SCRIPTS,
    dependencies: Object.fromEntries([
      ['@mainset/docs-kit', `^${kit.version}`],
      ...peers.filter(([name]) => !BUILD_PEERS.includes(name)),
    ]),
    devDependencies: Object.fromEntries(
      [
        ...peers.filter(([name]) => BUILD_PEERS.includes(name)),
        ['@mainset/dev-stack-fe', kitDevDependency('@mainset/dev-stack-fe')],
        ['@types/react', kitDevDependency('@types/react')],
        ['@types/react-dom', kitDevDependency('@types/react-dom')],
        ['cross-env', '^10.1.0'],
      ].filter((entry): entry is [string, string] => Boolean(entry[1])),
    ),
  };
}

/** {fields} added to {packageJson}, each entry only where it has none */
function addMissingPackageFields(
  packageJson: PackageJson,
  fields: ReturnType<typeof projectPackageFields>,
): PackageJson {
  const next = { ...packageJson };

  (Object.keys(fields) as (keyof typeof fields)[]).forEach((key) => {
    next[key] = { ...fields[key], ...packageJson[key] };
  });

  return next;
}

/** Every file under {dir}, as paths relative to it */
function listFiles(dir: string): string[] {
  return fs
    .readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => path.relative(dir, path.join(entry.parentPath, entry.name)))
    .sort();
}

interface InitResult {
  /** The files written, relative to the project */
  created: string[];
  /** The files the project had already, left as they were */
  skipped: string[];
  /** `package.json`, when it existed and got scripts or dependencies it lacked */
  updated: string[];
}

/** A docs project in {root}: the template's files it lacks, its `package.json` completed */
function initDocsApp({ root = process.cwd() }: { root?: string } = {}) {
  const result: InitResult = { created: [], skipped: [], updated: [] };

  listFiles(INIT_TEMPLATE__PATH).forEach((templateFile) => {
    const target = path
      .join(
        path.dirname(templateFile),
        TEMPLATE_FILE_RENAMES[path.basename(templateFile)] ??
          path.basename(templateFile),
      )
      .split(path.sep)
      .join('/');
    const targetPath = path.join(root, target);

    if (fs.existsSync(targetPath)) {
      result.skipped.push(target);

      return;
    }

    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.copyFileSync(path.join(INIT_TEMPLATE__PATH, templateFile), targetPath);
    result.created.push(target);
  });

  const packageJsonPath = path.join(root, 'package.json');
  const fields = projectPackageFields();

  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(
      fs.readFileSync(packageJsonPath, 'utf8'),
    ) as PackageJson;
    const isComplete = (Object.keys(fields) as (keyof typeof fields)[]).every(
      (key) =>
        Object.keys(fields[key]).every((name) => packageJson[key]?.[name]),
    );

    if (isComplete) {
      result.skipped.push('package.json');
    } else {
      fs.writeFileSync(
        packageJsonPath,
        `${JSON.stringify(addMissingPackageFields(packageJson, fields), null, 2)}\n`,
      );
      result.updated.push('package.json');
    }
  } else {
    const packageJson: PackageJson = {
      name: path.basename(path.resolve(root)),
      version: '0.0.0',
      private: true,
      type: 'module',
      ...fields,
    };

    fs.mkdirSync(root, { recursive: true });
    fs.writeFileSync(
      packageJsonPath,
      `${JSON.stringify(packageJson, null, 2)}\n`,
    );
    result.created.push('package.json');
  }

  return result;
}

export { addMissingPackageFields, initDocsApp };
export type { InitResult };
