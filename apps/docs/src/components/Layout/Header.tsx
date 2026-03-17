import { Button } from '@mainset/react/components';
import { Flex, Hr, ListBasic } from '@mainset/react/elements';
import React from 'react';

import { MainSetLogo } from '../mainset-logo';

const Header = () => {
  return (
    <header>
      <Flex layJustify="space-between" layAlign="center">
        <Flex.Item>
          <MainSetLogo />
        </Flex.Item>
        <Flex.Item>
          <ListBasic>
            <li>
              <Button srfTheme="muted" srfVariant="ghost">
                Products
              </Button>
            </li>
            <li>
              <Button srfTheme="muted" srfVariant="ghost">
                Open Source
              </Button>
            </li>
            <li>
              <Button srfTheme="muted" srfVariant="ghost">
                Features
              </Button>
            </li>
            <li>
              <Button srfTheme="muted" srfVariant="ghost">
                GitHub
              </Button>
            </li>
          </ListBasic>
        </Flex.Item>
        <Flex.Item>
          <Flex>
            <Button srfTheme="base" srfVariant="outlined">
              Start on GitHub
            </Button>
            <Button srfTheme="base" srfVariant="solid">
              Get started
            </Button>
          </Flex>
        </Flex.Item>
      </Flex>
      <Hr hrColor="muted" />
    </header>
  );
};

export { Header };
