interface AsSVGOptions {
  fill?: string;
  fillBackground?: string;
  height?: number;
  width?: number;
}

const asSVG =
  (
    {
      fill: defaultFill = '',
      fillBackground: defaultFillBackground = '',
      height: defaultHeight = 0,
      width: defaultWidth = 0,
    }: AsSVGOptions,
    path: string,
  ) =>
  ({
    fill = defaultFill,
    fillBackground = defaultFillBackground,
    height = defaultHeight,
    width = defaultWidth,
  } = {}) =>
    path
      .replace(/%SVGMaker--fill/g, fill)
      .replace(/%SVGMaker--fillBackground/g, fillBackground)
      .replace(/%SVGMaker--height/g, height.toString())
      .replace(/%SVGMaker--width/g, width.toString());

export default asSVG;
