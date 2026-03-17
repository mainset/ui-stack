type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | Record<string, unknown>
  | ClassValue[];

/**
 * A highly optimized utility for conditionally joining class names together.
 * Designed to be as fast as `clsx`.
 */
function cnx(...args: ClassValue[]): string {
  let str = '';

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg) continue;

    const argType = typeof arg;
    let appended = '';

    if (argType === 'string' || argType === 'number') {
      appended = arg as string;
    } else if (Array.isArray(arg)) {
      if (arg.length) {
        appended = cnx(...arg);
      }
    } else if (argType === 'object') {
      for (const key in arg as Record<string, unknown>) {
        if ((arg as Record<string, unknown>)[key]) {
          // Add space if there is already a string
          appended += (appended ? ' ' : '') + key;
        }
      }
    }

    if (appended) {
      str += (str ? ' ' : '') + appended;
    }
  }

  return str;
}

export { cnx };
