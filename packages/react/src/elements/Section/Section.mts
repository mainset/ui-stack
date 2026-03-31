import type { SurfaceStyleProps } from '@mainset/ui-core';
import {
  SECTION__CLASS_NAME_CONFIG,
  SURFACE__CLASS_NAME_CONFIG,
  SectionStyleProps,
  cnx,
  extractClassNamesFromProps,
  stylesSection,
  stylesSurface,
} from '@mainset/ui-core';
import React from 'react';

interface SectionProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    SectionStyleProps,
    SurfaceStyleProps {}

const Section: React.FC<SectionProps> = ({
  children,
  className,

  ...props
}) => {
  const [classNames, restProps] = extractClassNamesFromProps(
    [SECTION__CLASS_NAME_CONFIG, SURFACE__CLASS_NAME_CONFIG],
    props,
    Object.assign({}, stylesSection, stylesSurface),
  );

  return React.createElement(
    'section',
    {
      className: cnx(className, classNames),
      ...restProps,
    },
    children,
  );
};

export { Section };
