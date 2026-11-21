import { describe, expect, it } from 'vitest';

import { applyDocumentHead } from '../document-head.mjs';

const TEMPLATE = `<!doctype html>
<html lang="en" data-theme="system">
  <head>
    <title>Site</title>
  </head>
  <body></body>
</html>`;

describe('applyDocumentHead', () => {
  it('writes the title, description, lang, dir and links, escaped', () => {
    const html = applyDocumentHead(TEMPLATE, {
      title: 'Box & "friends"',
      description: 'A <box>',
      lang: 'uk',
      dir: 'ltr',
      canonical: 'https://x.dev/uk/box',
      alternates: [
        { hreflang: 'en', href: '/box' },
        { hreflang: 'uk', href: '/uk/box' },
      ],
    });

    expect(html).toContain('<html dir="ltr" lang="uk" data-theme="system">');
    expect(html).toContain('<title>Box &amp; &quot;friends&quot;</title>');
    expect(html).toContain(
      '<meta name="description" content="A &lt;box&gt;" />',
    );
    expect(html).toContain(
      '<link rel="canonical" href="https://x.dev/uk/box" />',
    );
    expect(html).toContain(
      '<link rel="alternate" hreflang="uk" href="/uk/box" />',
    );
  });

  it('leaves the template as it is without a head', () => {
    expect(applyDocumentHead(TEMPLATE, {})).toBe(TEMPLATE);
  });
});
