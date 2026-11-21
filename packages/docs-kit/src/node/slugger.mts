// GitHub's heading ids, so an anchor works the same on GitHub and on the site: lowercased,
// everything but letters, marks, digits, `_`, `-` and spaces dropped, spaces turned into `-`.
// A repeated id gets `-1`, `-2`…
//
// NOTE: matches `github-slugger` on every character, except ones newer than its Unicode table
// (kept here) and enclosed letters like `Ⓐ` (dropped here): none of them in heading text

const SLUG_DROPPED__REGEX = /[^\p{L}\p{M}\p{Nd}\p{Nl}\p{Pc} -]/gu;

/** `With "quotes" & spaces` → `with-quotes--spaces` */
function slugify(text: string): string {
  return text.toLowerCase().replace(SLUG_DROPPED__REGEX, '').replace(/ /g, '-');
}

/** One per page: ids are unique within it (`usage`, `usage-1`, `usage-2`) */
function createSlugger(): (text: string) => string {
  const countBySlug = new Map<string, number>();

  return (text) => {
    const base = slugify(text);
    let slug = base;

    // NOTE: `a`, `a`, `a-1` → `a`, `a-1`, `a-1-1`: a generated id never repeats a written one
    while (countBySlug.has(slug)) {
      const count = countBySlug.get(base)! + 1;

      countBySlug.set(base, count);
      slug = `${base}-${count}`;
    }

    countBySlug.set(slug, 0);

    return slug;
  };
}

export { createSlugger, slugify };
