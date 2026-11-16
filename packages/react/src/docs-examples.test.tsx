// Compiles and renders the examples of docs/components.md, so the docs can't drift from the API
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';

import { Button } from './components/Button/index.mjs';
import { Field } from './components/Field/index.mjs';
import { Checkbox } from './elements/Choice/index.mjs';
import { Container } from './elements/Container/index.mjs';
import { Input, Select } from './elements/Input/index.mjs';
import { Section } from './elements/Section/index.mjs';
import { Stack } from './elements/Stack/index.mjs';
import { Heading } from './elements/Typography/index.mjs';
import { VisuallyHidden } from './elements/VisuallyHidden/index.mjs';
import { useFormHandler } from './hooks/index.mjs';

type SignupValues = { email: string; plan: string; news: boolean };

function RouterLink({
  to,
  ...props
}: { to: string } & React.ComponentProps<'a'>) {
  return <a href={to} {...props} />;
}

function SignupForm({
  onSignup,
}: {
  onSignup: (values: SignupValues) => void;
}) {
  const [values, { handleInputChange }] = useFormHandler<SignupValues>({
    email: '',
    plan: 'free',
    news: false,
  });

  return (
    <Stack
      stkAs="form"
      onSubmit={(event) => {
        event.preventDefault();
        onSignup(values);
      }}
    >
      <Field fldLabel="Email" fldHint="We never share it" fldIsRequired>
        <Input
          name="email"
          type="email"
          autoComplete="email"
          onChange={handleInputChange}
        />
      </Field>
      <Field fldLabel="Plan">
        <Select name="plan" defaultValue="free" onChange={handleInputChange}>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
        </Select>
      </Field>
      <Checkbox name="news" onChange={handleInputChange}>
        Send me product news
      </Checkbox>
      <Button type="submit" srfVariant="solid">
        Sign up
      </Button>
    </Stack>
  );
}

it('the docs examples compile and render', () => {
  const markup = renderToStaticMarkup(
    <>
      <Button btnAs={RouterLink} to="/pricing" srfVariant="solid">
        See pricing
      </Button>
      <Section secAs="footer" bgColor="inverse">
        <Container
          spcType="pv"
          spcScale="section"
          spcSize={{ base: 'xs', md: 'lg' }}
        >
          <Stack
            flxDirection={{ base: 'column', md: 'row' }}
            layJustify="space-between"
          >
            …
          </Stack>
        </Container>
      </Section>
      <Heading hAs="h1" txtSize="lg">
        Settings
      </Heading>
      <VisuallyHidden vhAs="a" href="#main" vhIsFocusable>
        Skip to content
      </VisuallyHidden>
      <SignupForm onSignup={() => undefined} />
    </>,
  );

  expect(markup).toContain('<form class="ms-flex');
  expect(markup).toContain('<footer class="ms-section');
});
