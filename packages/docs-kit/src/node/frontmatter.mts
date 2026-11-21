import type { DocsPageFrontmatter } from '../core/docs.types.mjs';

// A page's frontmatter, in a strict subset of YAML: enough for the fields a page has, and read
// the same way by GitHub (which shows it as a table).
//
//   title: Button                # plain, "double" or 'single' quoted strings
//   sidebar:                     # nested by indentation (spaces)
//     order: 3                   # numbers
//     anchors: true              # true / false, null (or nothing)
//
// Anything else (lists, multi-line strings, `{…}` / `[…]`, anchors, tags) fails with its line
// number, rather than being read as something the author didn't mean.

type FrontmatterValue = string | number | boolean | null | FrontmatterObject;

interface FrontmatterObject {
  [key: string]: FrontmatterValue;
}

class FrontmatterError extends Error {
  /** 1-based, inside the frontmatter block */
  readonly line: number;

  constructor(message: string, line: number) {
    super(message);
    this.name = 'FrontmatterError';
    this.line = line;
  }
}

const KEY_VALUE__REGEX = /^([A-Za-z_][\w-]*)[ \t]*:(?:[ \t]+(.*))?$/;
const DOUBLE_QUOTED__REGEX = /^"((?:[^"\\]|\\.)*)"[ \t]*(?:#.*)?$/;
const SINGLE_QUOTED__REGEX = /^'((?:[^']|'')*)'[ \t]*(?:#.*)?$/;
const NUMBER__REGEX = /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][-+]?\d+)?$/;
const UNSUPPORTED_START__REGEX = /^[[{|>&*!%@`]/;
const ESCAPED_CHAR__BY_LETTER: Record<string, string> = {
  n: '\n',
  t: '\t',
  '"': '"',
  '\\': '\\',
  '/': '/',
};

function parseScalar(rawValue: string, line: number): FrontmatterValue {
  const value = rawValue.trim();

  if (value.startsWith('"')) {
    const match = DOUBLE_QUOTED__REGEX.exec(value);

    if (!match) throw new FrontmatterError('unclosed "double quotes"', line);

    return match[1].replace(/\\(.)/g, (escape, letter: string) => {
      if (!(letter in ESCAPED_CHAR__BY_LETTER)) {
        throw new FrontmatterError(`unknown escape "${escape}"`, line);
      }

      return ESCAPED_CHAR__BY_LETTER[letter];
    });
  }

  if (value.startsWith("'")) {
    const match = SINGLE_QUOTED__REGEX.exec(value);

    if (!match) throw new FrontmatterError("unclosed 'single quotes'", line);

    return match[1].replace(/''/g, "'");
  }

  if (UNSUPPORTED_START__REGEX.test(value)) {
    throw new FrontmatterError(
      `"${value}": lists, multi-line strings and {…} / […] aren't supported, quote the text if it is one`,
      line,
    );
  }

  // NOTE: a comment needs a space before its `#` (`C#` is text)
  const plain = value.replace(/[ \t]+#.*$/, '');

  if (/^(?:true|True|TRUE)$/.test(plain)) return true;
  if (/^(?:false|False|FALSE)$/.test(plain)) return false;
  if (/^(?:|~|null|Null|NULL)$/.test(plain)) return null;
  if (NUMBER__REGEX.test(plain)) return Number(plain);

  return plain;
}

/** The text between the `---` lines, as an object. Throws a {FrontmatterError} */
function parseFrontmatter(source: string): FrontmatterObject {
  const root: FrontmatterObject = {};
  // NOTE: the objects open at the current line, each with the indentation of its keys
  const stack: { indent: number; object: FrontmatterObject }[] = [
    { indent: 0, object: root },
  ];
  // A `key:` with no value: `null`, or an object if the next line is indented deeper
  let pending: {
    object: FrontmatterObject;
    key: string;
    indent: number;
  } | null = null;

  source.split(/\r?\n/).forEach((text, lineIndex) => {
    const line = lineIndex + 1;

    if (/^\s*(?:#.*)?$/.test(text)) return;

    const indentation = /^\s*/.exec(text)![0];

    if (indentation.includes('\t')) {
      throw new FrontmatterError('indent with spaces, not tabs', line);
    }

    const indent = indentation.length;

    if (pending && indent > pending.indent) {
      const object: FrontmatterObject = {};

      pending.object[pending.key] = object;
      stack.push({ indent, object });
    }

    pending = null;

    while (stack.length > 1 && indent < stack[stack.length - 1].indent) {
      stack.pop();
    }

    const current = stack[stack.length - 1];

    if (indent !== current.indent) {
      throw new FrontmatterError('unexpected indentation', line);
    }

    const match = KEY_VALUE__REGEX.exec(text.slice(indent));

    if (!match) throw new FrontmatterError('expected "key: value"', line);

    const [, key, rawValue = ''] = match;

    if (Object.prototype.hasOwnProperty.call(current.object, key)) {
      throw new FrontmatterError(`"${key}" is set twice`, line);
    }

    if (rawValue.replace(/^#.*$/, '').trim() === '') {
      current.object[key] = null;
      pending = { object: current.object, key, indent };
    } else {
      current.object[key] = parseScalar(rawValue, line);
    }
  });

  return root;
}

// ========== The fields a page has ==========

type FieldType = 'string' | 'number' | 'boolean';

const FRONTMATTER__SCHEMA: Record<
  string,
  FieldType | Record<string, FieldType>
> = {
  title: 'string',
  description: 'string',
  toc: 'boolean',
  sidebar: {
    label: 'string',
    order: 'number',
    hidden: 'boolean',
    anchors: 'boolean',
  },
};

function checkField(
  object: FrontmatterObject,
  key: string,
  type: FieldType,
  path: string,
) {
  const value = object[key];

  if (value === null) {
    delete object[key];

    return;
  }

  // NOTE: `title: 2024` is a number in YAML, the author meant the text
  if (type === 'string' && typeof value === 'number') {
    object[key] = String(value);

    return;
  }

  if (typeof value !== type) {
    throw new Error(
      `"${path}" must be a ${type}, got ${JSON.stringify(value)}`,
    );
  }
}

/**
 * Checks the known fields' types (and turns numbers into text where text is expected); returns
 * warnings for fields it doesn't know, a typo usually. Throws on a wrong type.
 */
function checkFrontmatter(data: FrontmatterObject): {
  frontmatter: DocsPageFrontmatter;
  warnings: string[];
} {
  const warnings: string[] = [];
  const warnUnknown = (path: string, known: string[]) =>
    warnings.push(
      `unknown frontmatter field "${path}" (known: ${known.join(', ')})`,
    );

  Object.keys(data).forEach((key) => {
    const fieldSchema = FRONTMATTER__SCHEMA[key];

    if (!fieldSchema) {
      warnUnknown(key, Object.keys(FRONTMATTER__SCHEMA));
    } else if (typeof fieldSchema === 'string') {
      checkField(data, key, fieldSchema, key);
    } else if (data[key] !== null && typeof data[key] !== 'object') {
      throw new Error(`"${key}" must hold fields, like "${key}:\\n  order: 1"`);
    } else if (data[key] !== null) {
      const object = data[key] as FrontmatterObject;

      Object.keys(object).forEach((childKey) => {
        if (childKey in fieldSchema) {
          checkField(
            object,
            childKey,
            fieldSchema[childKey],
            `${key}.${childKey}`,
          );
        } else {
          warnUnknown(`${key}.${childKey}`, Object.keys(fieldSchema));
        }
      });
    }
  });

  return { frontmatter: data as DocsPageFrontmatter, warnings };
}

export { FrontmatterError, checkFrontmatter, parseFrontmatter };
export type { FrontmatterObject, FrontmatterValue };
