// Compiles and renders the examples of docs/components.md, so the docs can't drift from the API
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';

import { Alert } from './components/Alert/index.mjs';
import { Button } from './components/Button/index.mjs';
import { Field } from './components/Field/index.mjs';
import { Accordion } from './containers/Accordion/index.mjs';
import { Dialog } from './containers/Dialog/index.mjs';
import { useOverlay } from './containers/MainSetContext/MainSetContext.mjs';
import { MainSetProvider } from './containers/MainSetContext/MainSetProvider.js';
import { Menu } from './containers/Menu/index.mjs';
import { Popover } from './containers/Popover/index.mjs';
import { Tabs } from './containers/Tabs/index.mjs';
import { useToast } from './containers/Toast/index.mjs';
import { Tooltip } from './containers/Tooltip/index.mjs';
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

function DeleteProject({ onDelete }: { onDelete: () => void }) {
  const deleteDialog = useOverlay('delete-project');

  return (
    <>
      <Button onClick={deleteDialog.open}>Delete project</Button>

      <Dialog dlgId="delete-project" dlgRole="alertdialog" dlgSize="sm">
        <Dialog.Header>
          <Dialog.Title>Delete the project?</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>It can’t be undone.</Dialog.Body>
        <Dialog.Footer>
          <Button onClick={deleteDialog.close}>Cancel</Button>
          <Button srfTheme="error" srfVariant="solid" onClick={onDelete}>
            Delete
          </Button>
        </Dialog.Footer>
      </Dialog>
    </>
  );
}

const CopyIcon = () => <svg aria-hidden="true" />;
const rename = () => undefined;
const remove = () => undefined;
const unarchive = () => undefined;

function Overlays() {
  const { toast } = useToast();

  return (
    <>
      <Button
        onClick={() => {
          toast({ tstTitle: 'Saved', srfTheme: 'success' });
          toast({
            tstTitle: 'Message archived',
            tstAction: { label: 'Undo', onClick: unarchive },
          });
        }}
      >
        Toast
      </Button>
      <Popover popPlacement="bottom" popAlign="end">
        <Popover.Trigger>
          <Button>Filters</Button>
        </Popover.Trigger>
        <Popover.Content aria-label="Filters">…</Popover.Content>
      </Popover>
      <Tooltip tipContent="Copy link">
        <Button btnIsIcon aria-label="Copy link">
          <CopyIcon />
        </Button>
      </Tooltip>
      <Menu>
        <Menu.Trigger>
          <Button>Actions</Button>
        </Menu.Trigger>
        <Menu.List>
          <Menu.Item mnuOnSelect={rename}>Rename</Menu.Item>
          <Menu.Item mnuAs="a" href="/export">
            Export
          </Menu.Item>
          <Menu.Separator />
          <Menu.Group mnuLabel="Danger zone">
            <Menu.Item mnuTone="error" mnuOnSelect={remove}>
              Delete
            </Menu.Item>
          </Menu.Group>
        </Menu.List>
      </Menu>
      <Tabs tbsDefaultId="profile">
        <Tabs.List aria-label="Account">
          <Tabs.Trigger tbsId="profile">Profile</Tabs.Trigger>
          <Tabs.Trigger tbsId="billing">Billing</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content tbsId="profile">…</Tabs.Content>
        <Tabs.Content tbsId="billing">…</Tabs.Content>
      </Tabs>
      <Accordion accDefaultOpenIds={['shipping']}>
        <Accordion.Item accId="shipping">
          <Accordion.Trigger>Shipping</Accordion.Trigger>
          <Accordion.Panel>Free over 50 €.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item accId="returns">
          <Accordion.Trigger>Returns</Accordion.Trigger>
          <Accordion.Panel>30 days.</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <Alert
        srfTheme="warning"
        alrtTitle="Payment failed"
        alrtActions={<Button btnSize="sm">Retry</Button>}
      >
        Your card was declined.
      </Alert>
      <DeleteProject onDelete={() => undefined} />
    </>
  );
}

it('the overlay, disclosure and feedback examples compile and render', () => {
  const markup = renderToStaticMarkup(
    <MainSetProvider>
      <Overlays />
    </MainSetProvider>,
  );

  expect(markup).toContain('aria-haspopup="menu"');
  expect(markup).toContain('role="tablist"');
  expect(markup).toContain('class="ms-disclosure"');
  expect(markup).toContain('role="alert"');
});

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
