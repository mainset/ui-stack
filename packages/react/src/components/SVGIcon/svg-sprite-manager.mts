// Central manager for the Dynamic Runtime SVG Sprite

const SPRITE_CONTAINER_ID = 'ms-svg-sprite';
const injectedIconIds = new Set<string>();

/**
 * Fast string hashing function to generate a deterministic ID from the SVG content.
 * e.g., transforms "<svg>...</svg>" -> "ms-icon-241512"
 */
const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
  }
  return `ms-icon--${Math.abs(hash)}`;
};

/**
 * Parses a raw SVG string, extracts its viewBox, its inner content,
 * generates a deterministic ID, and injects it into the global Sprite.
 * Returns the generated ID so the <use> tag can reference it.
 */
const injectToSprite = (rawSvgString: string): string => {
  // Generate deterministic ID based on the exact SVG content
  const iconId = hashString(rawSvgString);

  if (typeof document === 'undefined' || injectedIconIds.has(iconId)) {
    return iconId;
  }

  // 1. Extract viewBox (default to 0 0 24 24 if missing)
  const viewBoxMatch = rawSvgString.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';

  // 2. Extract inner content (everything inside the <svg>...</svg> tags)
  // This automatically ignores <?xml ...?> declarations and <svg> wrapper attributes.
  const innerContentMatch = rawSvgString.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  const innerContent = innerContentMatch ? innerContentMatch[1] : rawSvgString;

  let spriteSvg = document.getElementById(
    SPRITE_CONTAINER_ID,
  ) as unknown as SVGSVGElement;

  // On the very first icon load, we create the invisible sprite container in the body
  if (!spriteSvg) {
    const div = document.createElement('div');
    // Hide totally from layout and screen readers
    div.innerHTML = `
      <svg id="${SPRITE_CONTAINER_ID}" aria-hidden="true" style="display:none" xmlns="http://www.w3.org/2000/svg">
        <defs></defs>
      </svg>
    `;
    document.body.append(div.firstElementChild!);
    spriteSvg = document.getElementById(
      SPRITE_CONTAINER_ID,
    ) as unknown as SVGSVGElement;
  }

  const defs = spriteSvg.querySelector('defs');
  if (defs) {
    // Create a <symbol> element for this specific icon shape
    const symbol = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'symbol',
    );
    symbol.setAttribute('id', iconId);
    symbol.setAttribute('viewBox', viewBox);

    // Inject the raw paths (e.g. <path d="..." />, <circle ... />) into the symbol
    symbol.innerHTML = innerContent;

    defs.appendChild(symbol);
    injectedIconIds.add(iconId);
  }

  return iconId;
};

export { injectToSprite };
