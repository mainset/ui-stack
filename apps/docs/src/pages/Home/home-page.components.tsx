import {
  Heading,
  Paragraph,
  Section,
  Spacing,
  TextSection,
} from '@mainset/react/elements';
import React from 'react';

const Hero = () => {
  return (
    <Section secMaxWidth="base">
      {/* responsive size: 72px on phones, 112px from `md` (one css-var rule, no extra classes) */}
      <Spacing
        spcScale="section"
        spcType="pv"
        spcSize={{ base: 'xs', md: 'lg' }}
      >
        <Spacing spcScale="component" spcType="ph" spcSize="sm">
          {/* NOTE: phrasing content only inside a heading (a <p> in <h1> is invalid HTML) */}
          <Heading txtWeight="bold" txtSize="xxl" txtAlign="center">
            Productivity tools
            <br />
            <TextSection txtColor="muted">
              built for the modern workflow
            </TextSection>
          </Heading>

          <Paragraph
            txtSize="lg"
            txtColor="muted"
            txtAlign="center"
            spcType="mt"
            spcScale="block"
            spcSize="xs"
          >
            We build open-source and proprietary software that helps you work
            smarter. Cross-platform apps designed web-first, with native desktop
            and mobile experiences.
          </Paragraph>
        </Spacing>
      </Spacing>
    </Section>
  );
};

export { Hero };
