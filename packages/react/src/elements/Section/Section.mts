import type { BackgroundStyleProps } from '@mainset/ui-core';
import {
  BACKGROUND__CLASS_NAME_CONFIG,
  SECTION__CLASS_NAME_CONFIG,
  SectionStyleProps,
  cnx,
  extractClassNamesFromProps,
  stylesBackground,
  stylesSection,
} from '@mainset/ui-core';
import React from 'react';

interface SectionProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    SectionStyleProps,
    BackgroundStyleProps {}

const Section: React.FC<SectionProps> = ({
  children,
  className,

  ...props
}) => {
  const [classNames, restProps] = extractClassNamesFromProps(
    [SECTION__CLASS_NAME_CONFIG, BACKGROUND__CLASS_NAME_CONFIG],
    props,
    Object.assign({}, stylesSection, stylesBackground),
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
