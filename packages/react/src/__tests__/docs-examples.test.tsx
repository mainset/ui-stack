// Compiles and renders the examples of docs/components.md, so the docs can't drift from the API
import { hoverRecipe } from '@mainset/ui-core';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';

import { Alert } from '../components/Alert/index.mjs';
import { AvatarGroup } from '../components/AvatarGroup/index.mjs';
import { Breadcrumb } from '../components/Breadcrumb/index.mjs';
import { Button } from '../components/Button/index.mjs';
import { Field } from '../components/Field/index.mjs';
import { Pagination } from '../components/Pagination/index.mjs';
import { Accordion } from '../containers/Accordion/index.mjs';
import { Animate } from '../containers/Animate/index.mjs';
import { Avatar } from '../containers/Avatar/index.mjs';
import { Dialog } from '../containers/Dialog/index.mjs';
import { useOverlay } from '../containers/MainSetContext/MainSetContext.mjs';
import { MainSetProvider } from '../containers/MainSetContext/MainSetProvider.js';
import { Menu } from '../containers/Menu/index.mjs';
import { Popover } from '../containers/Popover/index.mjs';
import { Tabs } from '../containers/Tabs/index.mjs';
import { useToast } from '../containers/Toast/index.mjs';
import { Tooltip } from '../containers/Tooltip/index.mjs';
import { CardBasic } from '../elements/CardBasic/index.mjs';
import { Checkbox } from '../elements/Choice/index.mjs';
import { Container } from '../elements/Container/index.mjs';
import { IconTile } from '../elements/IconTile/index.mjs';
import { Input, Select } from '../elements/Input/index.mjs';
import { Link } from '../elements/Link/index.mjs';
import { Progress } from '../elements/Progress/index.mjs';
import { Section } from '../elements/Section/index.mjs';
import { Skeleton } from '../elements/Skeleton/index.mjs';
import { Stack } from '../elements/Stack/index.mjs';
import { Table } from '../elements/Table/index.mjs';
import { Heading, Text } from '../elements/Typography/index.mjs';
import { VisuallyHidden } from '../elements/VisuallyHidden/index.mjs';
import { useActiveSectionId, useFormHandler } from '../hooks/index.mjs';

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

type Invoice = { id: string; amount: string };
type Member = { id: string; name: string; photoUrl?: string };

const NextLink = (props: React.ComponentProps<'a'>) => <a {...props} />;

function DataDisplay({
  rows,
  members,
  user,
}: {
  rows: Invoice[];
  members: Member[];
  user?: Member;
}) {
  const [sort, setSort] = React.useState<{
    column: string;
    direction: 'ascending' | 'descending';
  }>({ column: 'id', direction: 'ascending' });
  const sortBy = (column: string) =>
    setSort({
      column,
      direction:
        sort.column === column && sort.direction === 'ascending'
          ? 'descending'
          : 'ascending',
    });
  const selectedId = 'INV-2';
  const [page, setPage] = React.useState(1);

  return (
    <>
      <Table tblIsHoverable tblSize="sm" aria-label="Invoices">
        <Table.Head>
          <Table.Row>
            <Table.SortableHeaderCell
              tblSortDirection={sort.column === 'id' ? sort.direction : null}
              tblOnSort={() => sortBy('id')}
            >
              Invoice
            </Table.SortableHeaderCell>
            <Table.HeaderCell tblAlign="end">Amount</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {rows.map((row) => (
            <Table.Row key={row.id} tblIsSelected={row.id === selectedId}>
              <Table.HeaderCell scope="row">{row.id}</Table.HeaderCell>
              <Table.Cell tblAlign="end">{row.amount}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Avatar avtSrc={user?.photoUrl} avtName={user?.name} avtSize="sm" />
      <AvatarGroup aria-label="Members" avtSize="sm" avtMax={3}>
        {members.map((member) => (
          <Avatar
            key={member.id}
            avtName={member.name}
            avtSrc={member.photoUrl}
          />
        ))}
      </AvatarGroup>
      <div aria-busy={!user}>
        <Skeleton sklVariant="circle" sklIsLoading={!user}>
          <Avatar avtName={user?.name} />
        </Skeleton>
        <Skeleton sklVariant="text" sklLines={3} />
      </div>
      <Progress aria-label="Upload" prgValue={3} prgMax={8} prgTone="success" />
      <Progress aria-label="Loading results" />
      <Pagination pgnPage={page} pgnPageCount={20} pgnOnPageChange={setPage} />
      <Pagination
        pgnPage={page}
        pgnPageCount={20}
        pgnGetHref={(page) => `?page=${page}`}
        pgnLinkAs={NextLink}
      />
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item brcAs={RouterLink} to="/docs">
          Docs
        </Breadcrumb.Item>
        <Breadcrumb.Item brcIsCurrent>Install</Breadcrumb.Item>
      </Breadcrumb>
    </>
  );
}

it('the data display and navigation examples compile and render', () => {
  const markup = renderToStaticMarkup(
    <DataDisplay
      rows={[
        { id: 'INV-1', amount: '12.00' },
        { id: 'INV-2', amount: '980.50' },
      ]}
      members={[
        'Ada Lovelace',
        'Grace Hopper',
        'Linus Torvalds',
        'Alan Kay',
      ].map((name, index) => ({ id: String(index), name }))}
    />,
  );

  expect(markup).toContain('aria-sort="ascending"');
  expect(markup).toContain('aria-label="1 more"');
  expect(markup).toContain('ms-progress--indeterminate');
  expect(markup).toContain('href="?page=2"');
  expect(markup).toContain(
    '<a href="/docs" class="ms-breadcrumb__link">Docs</a>',
  );
});

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

const ArrowRight = (props: React.ComponentProps<'svg'>) => <svg {...props} />;
const SearchIcon = () => <svg aria-hidden="true" />;
const features = [{ id: 'offline' }, { id: 'typos' }];
const SECTION_IDS = ['data', 'rights'];
const titles: Record<string, string> = { data: 'Data', rights: 'Rights' };

function Language() {
  const [locale, changeLanguage] = React.useState('en');

  return (
    <Menu mnuAlign="end">
      <Menu.Trigger>
        <Button srfVariant="ghost">EN</Button>
      </Menu.Trigger>
      <Menu.List aria-label="Language">
        <Menu.RadioGroup mnuValue={locale} mnuOnValueChange={changeLanguage}>
          <Menu.RadioItem mnuValue="en" lang="en">
            English
          </Menu.RadioItem>
          <Menu.RadioItem mnuValue="uk" lang="uk">
            Українська
          </Menu.RadioItem>
        </Menu.RadioGroup>
      </Menu.List>
    </Menu>
  );
}

function Contents() {
  const activeId = useActiveSectionId(SECTION_IDS);

  return (
    <nav aria-label="Contents">
      {SECTION_IDS.map((id) => (
        <Link
          key={id}
          href={`#${id}`}
          lnkUnderline="hover"
          aria-current={id === activeId ? 'location' : undefined}
        >
          {titles[id]}
        </Link>
      ))}
    </nav>
  );
}

it('the landing-page examples compile and render', () => {
  const markup = renderToStaticMarkup(
    <MainSetProvider>
      <Text txtAs="p" txtVariant="overline" txtColor="primary">
        Products
      </Text>
      <Heading hAs="h2" txtSize="display-sm" txtWrap="balance">
        Find any document
      </Heading>
      <Text txtAs="p" txtVariant="lead" txtColor="muted" txtWrap="pretty">
        …
      </Text>
      <Button
        btnAs={RouterLink}
        to="/docninja"
        srfVariant="solid"
        brdRadius="pill"
        hvrIsGroup
        btnIconEnd={
          <ArrowRight
            aria-hidden
            className={hoverRecipe({ hvrEffect: 'nudge-end' })}
          />
        }
      >
        Explore DocNinja
      </Button>
      <CardBasic
        srfVariant="outlined"
        srfHover="border"
        crdIsInteractive
        hvrEffect="lift"
      >
        <IconTile>
          <SearchIcon />
        </IconTile>
        <Heading hAs="h3" txtSize="lg">
          <Link
            lnkAs={RouterLink}
            to="/docninja"
            lnkIsStretched
            lnkUnderline="none"
            txtColor="base"
          >
            DocNinja
          </Link>
        </Heading>
        <Text txtAs="p" txtColor="muted">
          Offline search through your documents.
        </Text>
      </CardBasic>
      <Animate anmSlide="up" anmFade={false}>
        <Heading hAs="h1" txtSize="display-base">
          Software users love
        </Heading>
      </Animate>
      <Stack stkAs="ul">
        {features.map((feature, index) => (
          <Animate
            key={feature.id}
            anmAs="li"
            anmTrigger="visible"
            anmSlide="up"
            anmDelay={index * 80}
          >
            …
          </Animate>
        ))}
      </Stack>
      <Language />
      <Contents />
    </MainSetProvider>,
  );

  expect(markup).toContain('ms-link--stretched');
  expect(markup).toContain('ms-animate--state-enter');
  expect(markup).toContain('ms-hover--nudge-end');
  expect(markup).toContain('aria-haspopup="menu"');
});
