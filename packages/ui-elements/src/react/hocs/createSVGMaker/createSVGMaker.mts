import React from 'react';

interface SVGS {
  [idSVG: string]: React.FC;
}

interface SVGMakerProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
}

function createSVGMaker(SVGS: SVGS) {
  const SVGMaker: React.FC<SVGMakerProps> = ({ className, name, ...props }) =>
    React.createElement('span', {
      className: `ms-svg-maker${className && ` ${className}`}`,
      dangerouslySetInnerHTML: {
        __html: SVGS[name](props),
      },
    });

  const availableSVGNames = Object.keys(SVGS);

  return SVGMaker;
}

export { createSVGMaker };
