/**
 * Up to two initials of a name: the first letters of its first and last words, upper-cased.
 * `Array.from` keeps a letter outside the BMP (an emoji, some scripts) whole.
 */
function avatarInitials(name: string | undefined): string {
  const words = (name ?? '').trim().split(/\s+/u).filter(Boolean);
  if (!words.length) return '';

  const first = Array.from(words[0])[0];
  const last = words.length > 1 ? Array.from(words[words.length - 1])[0] : '';

  return `${first}${last}`.toLocaleUpperCase();
}

export { avatarInitials };
