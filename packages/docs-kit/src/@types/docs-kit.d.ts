// Types for an app that renders docs with `@mainset/docs-kit`:
// `/// <reference types="@mainset/docs-kit/global-types" />`

// NOTE: what the docs-kit markdown loader makes of a page (see `docsWebpackConfigFragment`)
declare module '*.md' {
  import type { DocsPageContent, DocsPageMeta } from '@mainset/docs-kit';

  export const meta: DocsPageMeta;
  export function loadContent(): Promise<DocsPageContent>;
}

// NOTE: webpack's compile-time directory listing (webpack >= 5.70), how a section's
// `content` folder is read
interface ImportMeta {
  webpackContext(
    request: string,
    options?: {
      recursive?: boolean;
      regExp?: RegExp;
      include?: RegExp;
      exclude?: RegExp;
      mode?: 'sync' | 'eager' | 'weak' | 'lazy' | 'lazy-once';
    },
  ): {
    keys(): string[];
    (id: string): unknown;
  };
}
