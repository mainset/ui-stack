import type { TextBaseProps } from '@mainset/ui-core';
import {
  TEXT_BASE__CLASS_NAME_CONFIG,
  cnx,
  extractClassNamesFromProps,
  stylesTextBase,
} from '@mainset/ui-core';
import React from 'react';

import { injectToSprite } from './svg-sprite-manager.mjs';

interface SVGIconProps
  extends
    React.SVGProps<SVGSVGElement>,
    Pick<TextBaseProps, 'txtColor' | 'txtSize'> {
  /**
   * The raw SVG string (e.g., imported via '?raw' or defined as a string).
   * The viewBox and deterministic ID will be automatically extracted/generated.
   */
  svgSource: string;
}

/**
 * Renders an SVG icon using a highly-performant Dynamic Runtime Sprite Map.
 * Instead of duplicating paths infinitely in the React DOM, we inject the path
 * once into the document <defs> and reference it using an SVG <use> tag everywhere else.
 */
const SVGIcon = ({
  svgSource,

  className,

  ...props
}: SVGIconProps) => {
  // We use a ref to synchronously capture the generated hash ID before paint
  const iconIdRef = React.useRef<string>(null);

  // Before painting, parse the raw SVG, extract the viewBox, hash it,
  // and inject it into the sprite. We save the resulting hash ID.
  React.useLayoutEffect(() => {
    iconIdRef.current = injectToSprite(svgSource);
  }, [svgSource]);

  // Fast-path ID generation for first-render so <use> isn't momentarily blank
  // (This acts synchronously during render)
  const iconId = React.useMemo(() => {
    return iconIdRef.current || injectToSprite(svgSource);
  }, [svgSource]);

  const [classNames, restProps] = extractClassNamesFromProps(
    [TEXT_BASE__CLASS_NAME_CONFIG],
    props,
    stylesTextBase,
  );

  return React.createElement(
    'svg',
    {
      className: cnx(className, classNames),

      // Tie the layout scale directly to current CSS 'font-size'
      // (Can still be overridden by passing width={...} height={...} or className)
      width: '1em',
      height: '1em',
      fill: 'currentColor',

      ...restProps,
    },
    React.createElement('use', {
      href: `#${iconId}`,
    }),
  );
};

export { SVGIcon };
