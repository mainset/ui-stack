type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | Record<string, unknown>
  | ClassValue[];

// One argument → its class string (arrays recurse without re-spreading their items)
function toClassString(arg: ClassValue): string {
  if (!arg) return '';

  if (typeof arg === 'string') return arg;
  if (typeof arg === 'number') return String(arg);

  let str = '';

  if (Array.isArray(arg)) {
    for (let i = 0; i < arg.length; i++) {
      const appended = toClassString(arg[i]);
      if (appended) str += (str ? ' ' : '') + appended;
    }
  } else if (typeof arg === 'object') {
    for (const key in arg) {
      if (arg[key]) str += (str ? ' ' : '') + key;
    }
  }

  return str;
}

/**
 * A highly optimized utility for conditionally joining class names together.
 * Designed to be as fast as `clsx`.
 */
function cnx(...args: ClassValue[]): string {
  let str = '';

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg) continue;

    const appended = typeof arg === 'string' ? arg : toClassString(arg);
    if (appended) str += (str ? ' ' : '') + appended;
  }

  return str;
}

export { cnx };
