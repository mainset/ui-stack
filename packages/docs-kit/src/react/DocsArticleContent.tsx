'use client';

import React from 'react';
import { useHref, useNavigate } from 'react-router';

import { useDocs } from './docs-context.js';
import './docs-prose.scss';

const COPIED__DURATION_MS = 2000;

const isModifiedClick = (event: React.MouseEvent) =>
  event.button !== 0 ||
  event.metaKey ||
  event.ctrlKey ||
  event.shiftKey ||
  event.altKey;

interface DocsArticleContentProps {
  /** Compiled page HTML, page links already resolved */
  html: string;
  /** Set when the content is in another language than the page (an untranslated page) */
  lang?: string;
}

/**
 * The compiled page. Its links to other pages navigate in the app (no reload), its code blocks
 * get a copy button once the script runs.
 */
function DocsArticleContent({ html, lang }: DocsArticleContentProps) {
  const { ui } = useDocs();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  // NOTE: the router's basename as an href prefix: `/` or `/ui-stack/`
  const basePath = useHref('/').replace(/\/$/, '');

  React.useEffect(() => {
    contentRef.current
      ?.querySelectorAll<HTMLButtonElement>('[data-msd-copy]')
      .forEach((button) => {
        button.textContent = ui.copyCode;
        button.hidden = false;
      });
  }, [html, ui.copyCode]);

  const copyCode = (button: HTMLButtonElement) => {
    const code = button.parentElement?.querySelector('pre')?.textContent ?? '';

    navigator.clipboard?.writeText(code).then(() => {
      button.textContent = ui.copiedCode;
      window.setTimeout(() => {
        button.textContent = ui.copyCode;
      }, COPIED__DURATION_MS);
    });
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as Element;
    const copyButton = target.closest<HTMLButtonElement>('[data-msd-copy]');

    if (copyButton) {
      copyCode(copyButton);

      return;
    }

    const anchor = target.closest('a');

    if (
      !anchor ||
      event.defaultPrevented ||
      isModifiedClick(event) ||
      anchor.target ||
      anchor.hasAttribute('download')
    ) {
      return;
    }

    const url = new URL(anchor.href, window.location.href);
    const isInApp =
      url.origin === window.location.origin &&
      (url.pathname === basePath || url.pathname.startsWith(`${basePath}/`));
    // NOTE: a jump within the page is the browser's (it keeps the scroll offset)
    const isSamePage = url.pathname === window.location.pathname;

    if (!isInApp || isSamePage) return;

    event.preventDefault();
    navigate(
      `${url.pathname.slice(basePath.length) || '/'}${url.search}${url.hash}`,
    );
  };

  return (
    // NOTE: the clicks it handles land on links and buttons inside the HTML, which are
    // keyboard-operable by themselves (Enter on a link fires the same click)
    <div
      ref={contentRef}
      className="msd-prose"
      lang={lang}
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export { DocsArticleContent };
export type { DocsArticleContentProps };
