import {
  Flex,
  Heading,
  Hr,
  Paragraph,
  Section,
  Spacing,
  TextSection,
} from '@mainset/react/elements';
import React from 'react';

import { MainSetLogo } from '../mainset-logo';

const SOCIAL_LINKS = [
  { name: 'GitHub', href: 'https://github.com/mainset' },
  { name: 'Twitter', href: 'https://twitter.com/mainset' },
];

const FOOTER_COLUMNS = [
  {
    title: 'Products',
    links: [
      { name: 'Notes', href: '#' },
      { name: 'Tasks', href: '#' },
      { name: 'Time', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'Documentation', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Changelog', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy', href: '#' },
      { name: 'Terms', href: '#' },
    ],
  },
];

type FooterLinkProps = { href: string; children: React.ReactNode };

// NOTE: the reset makes links inherit their color, so the text utilities style them
const FooterLink = ({ href, children }: FooterLinkProps) => (
  <a href={href}>
    <TextSection txtColor="muted" txtColorHover="base" txtSize="sm">
      {children}
    </TextSection>
  </a>
);

const Footer = () => {
  return (
    <footer>
      <Hr hrColor="base" />

      <Section secMaxWidth="xl">
        <Spacing
          spcScale="section"
          spcType="pv"
          spcSize={{ base: 'xs', md: 'xl' }}
        >
          <Spacing spcScale="component" spcType="ph" spcSize="sm">
            {/* mobile-first: stacked on phones, side by side from `md` (48rem) */}
            <Flex flxDirection={{ base: 'column', md: 'row' }} layGapSize="xl">
              {/* Logo block */}
              <Flex flxDirection="column" layGapSize="sm">
                <MainSetLogo />
                <Paragraph txtColor="muted" txtSize="sm">
                  Building productivity tools for the modern workflow.
                </Paragraph>
                <Flex layGapSize="base">
                  {SOCIAL_LINKS.map((link) => (
                    <FooterLink key={link.name} href={link.href}>
                      {link.name}
                    </FooterLink>
                  ))}
                </Flex>
              </Flex>

              {/* Links blocks */}
              <Flex.Item flxGrow={1}>
                <Flex flxWrap="wrap" layJustify="space-between" layGapSize="xl">
                  {FOOTER_COLUMNS.map((column) => (
                    <nav key={column.title} aria-label={column.title}>
                      <Flex flxDirection="column" layGapSize="sm">
                        <Heading hAs="h4" txtSize="sm" txtWeight="bolder">
                          {column.title}
                        </Heading>
                        <Flex flxDirection="column" layGapSize="xs">
                          {column.links.map((link) => (
                            <FooterLink key={link.name} href={link.href}>
                              {link.name}
                            </FooterLink>
                          ))}
                        </Flex>
                      </Flex>
                    </nav>
                  ))}
                </Flex>
              </Flex.Item>
            </Flex>

            <Hr hrColor="base" spcType="mv" spcScale="block" spcSize="lg" />

            <Paragraph txtColor="muted" txtSize="sm" txtAlign="center">
              © {new Date().getFullYear()} Mainset. All rights reserved.
            </Paragraph>
          </Spacing>
        </Spacing>
      </Section>
    </footer>
  );
};

export { Footer };
