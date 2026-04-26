import { Badge, Flex, TextSection } from '@mainset/react/elements';
import React from 'react';

const MainSetLogo = () => {
  return (
    <Flex layGapSize="xs">
      <Badge srfTheme="base" srfVariant="solid">
        <TextSection txtColor="inverse" txtSize="small" txtWeight="bolder">
          m
        </TextSection>
        <TextSection txtColor="tertiary" txtSize="small" txtWeight="bolder">
          s
        </TextSection>
      </Badge>
      <TextSection txtSize="large">mainset</TextSection>
    </Flex>
  );
};

export { MainSetLogo };
