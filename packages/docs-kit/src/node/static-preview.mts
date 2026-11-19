import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

// A local stand-in for a static host (GitHub Pages), to check an export before deploying it:
// the site under its base path, `dir/index.html` for `dir`, and `404.html` with a 404 status for
// anything else. Not a production server.

interface StaticPreviewOptions {
  /** @default '<cwd>/dist/static' */
  root?: string;
  /** @default 4173 */
  port?: number;
  /** @default process.env.PUBLIC_PATH || '/' */
  basePath?: string;
}

const CONTENT_TYPE__BY_EXTENSION: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

function previewStaticSite({
  root = path.join(process.cwd(), 'dist', 'static'),
  port = 4173,
  basePath: rawBasePath = process.env.PUBLIC_PATH || '/',
}: StaticPreviewOptions = {}) {
  const basePath = `/${rawBasePath.replace(/^\/+|\/+$/g, '')}/`.replace(
    /^\/\/$/,
    '/',
  );

  const resolveFile = (pathname: string): string | null => {
    const relativePath = pathname.slice(basePath.length);
    const candidates = [
      relativePath,
      path.join(relativePath, 'index.html'),
      `${relativePath}.html`,
    ];

    for (const candidate of candidates) {
      const filePath = path.resolve(root, candidate);

      // NOTE: never outside the root (`/../../etc/passwd`)
      if (!filePath.startsWith(root)) return null;
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile())
        return filePath;
    }

    return null;
  };

  const server = http.createServer((request, response) => {
    const pathname = decodeURIComponent(
      new URL(request.url ?? '/', 'http://localhost').pathname,
    );
    const filePath = pathname.startsWith(basePath)
      ? resolveFile(pathname)
      : null;
    const notFoundPath = path.join(root, '404.html');
    const servedPath =
      filePath ?? (fs.existsSync(notFoundPath) ? notFoundPath : null);

    if (!servedPath) {
      response.writeHead(404).end('Not Found');

      return;
    }

    response.writeHead(filePath ? 200 : 404, {
      'Content-Type':
        CONTENT_TYPE__BY_EXTENSION[path.extname(servedPath)] ??
        'application/octet-stream',
    });
    fs.createReadStream(servedPath).pipe(response);
  });

  server.listen(port, () => {
    console.log(
      `\n👀 [ms-docs] previewing ${path.relative(process.cwd(), root) || '.'} at http://localhost:${port}${basePath}\n`,
    );
  });

  return server;
}

export { previewStaticSite };
export type { StaticPreviewOptions };
