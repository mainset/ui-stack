'use client';

import React from 'react';

import type {
  DocsDocumentHead,
  DocsHeadAlternate,
} from '../core/document-head.mjs';

// On the server, the page's head is collected while it renders (one collector per render,
// written into the HTML template with `applyDocumentHead`). In the browser there is no
// collector, and `DocsHead` updates the live document after every navigation.
const DocsHeadContext = React.createContext<DocsDocumentHead | null>(null);

function setMetaDescription(content: string) {
  let meta = document.head.querySelector<HTMLMetaElement>(
    'meta[name="description"]',
  );

  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'description';
    document.head.appendChild(meta);
  }

  meta.content = content;
}

// NOTE: rewritten as a whole on every navigation: the server's tags are replaced too
function setHeadLinks(
  canonical?: string,
  alternates: DocsHeadAlternate[] = [],
) {
  document.head
    .querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang]')
    .forEach((link) => link.remove());

  const links = [
    ...(canonical ? [{ rel: 'canonical', href: canonical }] : []),
    ...alternates.map(({ hreflang, href }) => ({
      rel: 'alternate',
      hreflang,
      href,
    })),
  ];

  links.forEach(
    ({
      rel,
      href,
      hreflang,
    }: {
      rel: string;
      href: string;
      hreflang?: string;
    }) => {
      const link = document.createElement('link');

      link.rel = rel;
      link.href = href;
      if (hreflang) link.hreflang = hreflang;
      document.head.appendChild(link);
    },
  );
}

/**
 * Sets the document's title, description, `lang`, `dir`, canonical and `hreflang` links.
 * Renders nothing.
 */
function DocsHead({
  title,
  description,
  lang,
  dir,
  canonical,
  alternates,
}: DocsDocumentHead) {
  const collector = React.useContext(DocsHeadContext);

  // NOTE: during render on purpose: the server renders once, synchronously, and a nested
  // `DocsHead` (the page) renders after its parent (the locale), so the page's title wins
  if (collector) {
    if (title) collector.title = title;
    if (description) collector.description = description;
    if (lang) collector.lang = lang;
    if (dir) collector.dir = dir;
    if (canonical) collector.canonical = canonical;
    if (alternates) collector.alternates = alternates;
  }

  // NOTE: by value, so a new array with the same links doesn't rewrite the head
  const alternatesKey = JSON.stringify(alternates ?? []);

  React.useEffect(() => {
    if (canonical || alternatesKey !== '[]') {
      setHeadLinks(canonical, JSON.parse(alternatesKey) as DocsHeadAlternate[]);
    }
  }, [canonical, alternatesKey]);

  React.useEffect(() => {
    if (title) document.title = title;
  }, [title]);

  React.useEffect(() => {
    if (description) setMetaDescription(description);
  }, [description]);

  React.useEffect(() => {
    if (lang) document.documentElement.lang = lang;
    if (dir) document.documentElement.dir = dir;
  }, [lang, dir]);

  return null;
}

export { DocsHead, DocsHeadContext };
