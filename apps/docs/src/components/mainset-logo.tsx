import { Badge, Flex, Spacing, TextSection } from '@mainset/react/ui-elements';
import React from 'react';

const MainSetLogo = () => {
  return (
    <Flex>
      <Badge srfBackgroundColor="base" srfBorderRadius="sm">
        <TextSection txtColor="inverse" txtSize="small" txtWeight="bolder">
          m
        </TextSection>
        <TextSection txtColor="tertiary" txtSize="small" txtWeight="bolder">
          s
        </TextSection>
        <Spacing spcType="mb" spcScale="element" spcSize="xs" />
      </Badge>
      <TextSection txtSize="large">mainset</TextSection>
    </Flex>
  );
};

export { MainSetLogo };
