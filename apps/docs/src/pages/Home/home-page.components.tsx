import { Heading, Paragraph, Section } from '@mainset/react/ui-elements';
import React from 'react';

const Hero = () => {
  return (
    <Section secMaxWidth="md" srfBackgroundColor="transparent">
      <Heading txtWeight="bold" txtSize="xxx-large" txtAlign="center">
        Productivity tools
        <Paragraph txtColor="muted">built for the modern workflow</Paragraph>
      </Heading>

      <Paragraph txtSize="large" txtColor="muted" txtAlign="center">
        We build open-source and proprietary software that helps you work
        smarter. Cross-platform apps designed web-first, with native desktop and
        mobile experiences.
      </Paragraph>
    </Section>
  );
};

export { Hero };
