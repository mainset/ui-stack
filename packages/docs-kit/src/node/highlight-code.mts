import type { BundledLanguage, Highlighter } from 'shiki';
import { bundledLanguages, createHighlighter } from 'shiki';

// Build-time syntax highlighting. Two themes at once: every token carries both colors as
// custom properties (`--shiki-light`, `--shiki-dark`), the stylesheet picks one per color
// scheme, so code follows `data-theme` with no script.
const CODE_THEMES = { light: 'github-light', dark: 'github-dark' } as const;

const PLAIN_TEXT__LANGUAGE = 'text';

let highlighterPromise: Promise<Highlighter> | undefined;

// NOTE: one highlighter per process, its languages loaded on first use (webpack compiles the
// server and the browser bundle in the same process, both reuse it)
const getHighlighter = () => {
  highlighterPromise ??= createHighlighter({
    themes: [CODE_THEMES.light, CODE_THEMES.dark],
    langs: [],
  });

  return highlighterPromise;
};

/** `<pre class="shiki">` with both themes' colors; an unknown language is plain text */
async function highlightCode(code: string, language?: string | null) {
  const highlighter = await getHighlighter();
  const lang =
    language && language in bundledLanguages
      ? (language as BundledLanguage)
      : PLAIN_TEXT__LANGUAGE;

  if (
    lang !== PLAIN_TEXT__LANGUAGE &&
    !highlighter.getLoadedLanguages().includes(lang)
  ) {
    await highlighter.loadLanguage(lang);
  }

  return highlighter.codeToHtml(code, {
    lang,
    themes: CODE_THEMES,
    defaultColor: false,
  });
}

export { CODE_THEMES, highlightCode };
