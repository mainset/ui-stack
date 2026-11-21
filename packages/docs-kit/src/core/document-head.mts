// The `<head>` of a page, collected while it renders on the server (see `DocsHeadContext`) and
// written into the HTML template. In the browser, `DocsHead` updates the live document instead.

interface DocsHeadAlternate {
  /** BCP 47 tag, or `x-default` */
  hreflang: string;
  href: string;
}

interface DocsDocumentHead {
  title?: string;
  description?: string;
  lang?: string;
  dir?: 'ltr' | 'rtl';
  /** The page's URL (absolute when the site has a `url`) */
  canonical?: string;
  /** The same page in every language: search engines show the reader's one */
  alternates?: DocsHeadAlternate[];
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function setHtmlAttribute(htmlTag: string, name: string, value: string) {
  const attribute = `${name}="${escapeHtml(value)}"`;
  const existing = new RegExp(`\\s${name}="[^"]*"`);

  return existing.test(htmlTag)
    ? htmlTag.replace(existing, ` ${attribute}`)
    : htmlTag.replace(/^<html/, `<html ${attribute}`);
}

/** The template with the page's `<title>`, description and `<html lang dir>` */
function applyDocumentHead(template: string, head: DocsDocumentHead): string {
  let html = template;

  if (head.lang || head.dir) {
    html = html.replace(/<html\b[^>]*>/, (htmlTag) => {
      let tag = htmlTag;

      if (head.lang) tag = setHtmlAttribute(tag, 'lang', head.lang);
      if (head.dir) tag = setHtmlAttribute(tag, 'dir', head.dir);

      return tag;
    });
  }

  if (head.title) {
    html = html.replace(
      /<title>[\s\S]*?<\/title>/,
      `<title>${escapeHtml(head.title)}</title>`,
    );
  }

  if (head.description) {
    const meta = `<meta name="description" content="${escapeHtml(head.description)}" />`;

    html = /<meta name="description"[^>]*>/.test(html)
      ? html.replace(/<meta name="description"[^>]*>/, meta)
      : html.replace('</title>', `</title>\n    ${meta}`);
  }

  const links = [
    ...(head.canonical
      ? [`<link rel="canonical" href="${escapeHtml(head.canonical)}" />`]
      : []),
    ...(head.alternates ?? []).map(
      ({ hreflang, href }) =>
        `<link rel="alternate" hreflang="${escapeHtml(hreflang)}" href="${escapeHtml(href)}" />`,
    ),
  ];

  if (links.length > 0) {
    html = html.replace('</head>', `    ${links.join('\n    ')}\n  </head>`);
  }

  return html;
}

export { applyDocumentHead };
export type { DocsDocumentHead, DocsHeadAlternate };
