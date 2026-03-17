import { Button } from '@mainset/react/components';
import { Flex, Hr, ListBasic, Section, Spacing } from '@mainset/react/elements';
import React from 'react';

import { MainSetLogo } from '../mainset-logo';

const NAV_LINKS = [
  { name: 'Products', href: '#products' },
  { name: 'Open Source', href: '#open-source' },
  { name: 'Features', href: '#features' },
  { name: 'GitHub', href: 'https://github.com/mainset' },
];

const Header = () => {
  return (
    <header>
      <Section secMaxWidth="xl">
        <Spacing spcType="p" spcScale="component" spcSize="sm">
          {/* mobile-first: stacked on phones, one row from `md` (48rem) */}
          <Flex
            flxDirection={{ base: 'column', md: 'row' }}
            layJustify="space-between"
            layAlign={{ base: 'flex-start', md: 'center' }}
            layGapSize="sm"
          >
            <a href="/" aria-label="mainset home">
              <MainSetLogo />
            </a>

            <nav aria-label="Main">
              <ListBasic>
                {NAV_LINKS.map((link) => (
                  <li key={link.name}>
                    {/* polymorphic: a real link, styled as a button */}
                    <Button
                      btnAs="a"
                      href={link.href}
                      srfTheme="muted"
                      srfVariant="ghost"
                    >
                      {link.name}
                    </Button>
                  </li>
                ))}
              </ListBasic>
            </nav>

            <Flex layGapSize="xs">
              <Button
                btnAs="a"
                href="https://github.com/mainset"
                srfTheme="base"
                srfVariant="outlined"
              >
                Start on GitHub
              </Button>
              <Button srfTheme="base" srfVariant="solid">
                Get started
              </Button>
            </Flex>
          </Flex>
        </Spacing>
      </Section>
      <Hr hrColor="muted" />
    </header>
  );
};

export { Header };
