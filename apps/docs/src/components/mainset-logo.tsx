import { Badge, Flex, TextSection } from '@mainset/react/elements';
import React from 'react';

const MainSetLogo = () => {
  return (
    <Flex layAlign="center" layGapSize="xs">
      {/* NOTE: a solid surface paints its text with the tone's `on-solid` color, no `txtColor` needed */}
      <Badge srfTheme="base" srfVariant="solid">
        <TextSection txtSize="sm" txtWeight="bolder">
          m
        </TextSection>
        <TextSection txtColor="tertiary" txtSize="sm" txtWeight="bolder">
          s
        </TextSection>
      </Badge>
      <TextSection txtSize="lg">mainset</TextSection>
    </Flex>
  );
};

export { MainSetLogo };
