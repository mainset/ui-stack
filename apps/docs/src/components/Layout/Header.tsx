import { Flex, Hr, Spacing } from '@mainset/react/ui-elements';
import React from 'react';

import { MainSetLogo } from '../mainset-logo';

const Header = () => {
  return (
    <header>
      <Flex flxJustify="space-between" flxAlign="center">
        <Flex.Item>
          <Spacing spcType="p" spcScale="block" spcSize="base">
            <MainSetLogo />
          </Spacing>
        </Flex.Item>
        <Flex.Item>Links</Flex.Item>
        <Flex.Item>Button actions</Flex.Item>
      </Flex>
      <Hr hrColor="muted" />
    </header>
  );
};

export { Header };
