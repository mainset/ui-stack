import { Badge, Flex, Spacing, TextSection } from '@mainset/react/elements';
import React from 'react';

const MainSetLogo = () => {
  return (
    <Flex>
      <Badge srfTheme="base" srfVariant="solid">
        <TextSection txtColor="inverse" txtSize="small" txtWeight="bolder">
          m
        </TextSection>
        <TextSection txtColor="tertiary" txtSize="small" txtWeight="bolder">
          s
        </TextSection>
      </Badge>
      <TextSection
        txtSize="large"
        spcType="mh"
        spcScale="element"
        spcSize="base"
      >
        mainset
      </TextSection>
    </Flex>
  );
};

export { MainSetLogo };
