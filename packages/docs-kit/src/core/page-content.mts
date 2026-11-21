import { PAGE_LINK__PREFIX } from './content-path.mjs';
import type { DocsPage, DocsPageContent } from './docs.types.mjs';

// A page's HTML is its own chunk. It is loaded by the page's route (its loader), before the
// page renders, and kept here, so the render reads it synchronously: on the server, while
// hydrating (see `preloadDocsRoute`) and on every client navigation after the first visit.

const contentByFile = new Map<string, DocsPageContent>();
const pendingByFile = new Map<string, Promise<DocsPageContent>>();

// NOTE: by file, not by route: an untranslated page shares the default locale's file
const cacheKey = (page: DocsPage) => `${page.sectionId}/${page.filePath}`;

function loadPageContent(page: DocsPage): Promise<DocsPageContent> {
  const key = cacheKey(page);
  const content = contentByFile.get(key);

  if (content) return Promise.resolve(content);

  let pending = pendingByFile.get(key);

  if (!pending) {
    pending = page.loadContent().then(
      (loaded) => {
        contentByFile.set(key, loaded);
        pendingByFile.delete(key);

        return loaded;
      },
      (error: unknown) => {
        // NOTE: forgotten, so the next navigation tries again (a chunk can fail on a flaky network)
        pendingByFile.delete(key);
        throw error;
      },
    );
    pendingByFile.set(key, pending);
  }

  return pending;
}

function readPageContent(page: DocsPage): DocsPageContent | undefined {
  return contentByFile.get(cacheKey(page));
}

const PAGE_LINK__REGEX = new RegExp(
  `href="${PAGE_LINK__PREFIX}([^"#]*)(#[^"]*)?"`,
  'g',
);

/**
 * Points the compiled links between pages (`msd:layout/box#props`) at their URLs in this
 * section and locale. {sectionHref} is a real href, basename included: `/uk/ui-core`;
 * {toPagePath} turns a page key into its URL inside the section (`DocsSection.pagePath`).
 */
function resolvePageLinks(
  html: string,
  sectionHref: string,
  toPagePath: (pageKey: string) => string = (pageKey) => pageKey,
): string {
  return html.replace(
    PAGE_LINK__REGEX,
    (_match, pageKey: string, hash = '') => {
      const pagePath = toPagePath(pageKey);

      return `href="${sectionHref}${pagePath ? `/${pagePath}` : ''}${hash}"`;
    },
  );
}

export { loadPageContent, readPageContent, resolvePageLinks };
