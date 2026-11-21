import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';

import { ejectDocsApp } from './eject.mjs';
import { exportStaticSite } from './static-export.mjs';
import { previewStaticSite } from './static-preview.mjs';

const USAGE = `Usage: ms-docs <export | preview | eject> [options]

export   renders every page of an ms-cli SSR build (run \`ms-cli web-app --exec build\` first)
         into static HTML, following the site's links from the entries
preview  serves the export like a static host would (GitHub Pages), to check it locally
eject    copies the app engine (entries, server render, routes, HTML template) into the
         project, to change it; the project's copies are built instead of the kit's

Options:
  --out <dir>          output folder (default: dist/static)
  --entry <path>       where crawling starts, repeatable (default: /)
  --not-found <path>   rendered into 404.html (default: /404)
  --base <path>        output.publicPath of the build (default: $PUBLIC_PATH or /)
  --allow-broken-links report broken links without failing
  --port <number>      preview: the port (default: 4173)
`;

async function runDocsCli(argv: string[]) {
  const { positionals, values } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      out: { type: 'string' },
      entry: { type: 'string', multiple: true },
      'not-found': { type: 'string' },
      base: { type: 'string' },
      'allow-broken-links': { type: 'boolean' },
      port: { type: 'string' },
      help: { type: 'boolean', short: 'h' },
    },
  });

  const [command] = positionals;

  if (
    values.help ||
    (command !== 'export' && command !== 'preview' && command !== 'eject')
  ) {
    process.stdout.write(USAGE);
    process.exit(values.help ? 0 : 1);
  }

  // NOTE: the same `.env` ms-cli loads for the build, so PUBLIC_PATH matches it
  const envFile = path.join(process.cwd(), '.env');

  if (fs.existsSync(envFile)) process.loadEnvFile(envFile);

  if (command === 'eject') {
    try {
      const { files } = ejectDocsApp();

      console.log(
        `\n✅ [ms-docs] the engine is in the project now:\n${files.map((file) => `   ${file}`).join('\n')}\n\n` +
          "   config/webpack.config.mjs (docsWebpackConfig) builds these instead of the kit's.\n",
      );
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
      process.exit(1);
    }

    return;
  }

  if (command === 'preview') {
    previewStaticSite({
      root: values.out && path.resolve(values.out),
      port: values.port ? Number(values.port) : undefined,
      basePath: values.base,
    });

    return;
  }

  process.env.NODE_ENV ??= 'production';

  const startedAt = Date.now();

  try {
    const result = await exportStaticSite({
      outDir: values.out && path.resolve(values.out),
      entries: values.entry,
      notFoundPath: values['not-found'],
      basePath: values.base,
      isBrokenLinkAllowed: values['allow-broken-links'],
    });

    result.brokenLinks.forEach(({ href, linkedFrom }) =>
      console.warn(
        `⚠️  broken link ${href}, linked from ${linkedFrom.join(', ')}`,
      ),
    );
    console.log(
      `\n✅ [ms-docs] exported ${result.pages.length} pages` +
        (result.redirects.length
          ? `, ${result.redirects.length} redirects`
          : '') +
        ` in ${((Date.now() - startedAt) / 1000).toFixed(1)}s\n`,
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

export { runDocsCli };
