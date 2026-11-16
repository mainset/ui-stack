# Components

Every component renders [`@mainset/ui-core`](../../ui-core/docs/elements.md) classes and adds
behaviour. For customizing the looks (tokens, tones, dark mode), see [Theming in React](./theming.md).

## Conventions

- **Prefixed props.** Each component family has a prefix (`btn*`, `srf*`, `spc*`, `flx*`,
  `lay*`, `grd*`, `ctn*`, `txt*`, `lnk*`, `ctl*`, `fld*`…), so props are easy to grep and never
  collide with HTML attributes.
- **`*As` picks the tag**: `btnAs`, `srfAs`, `boxAs`, `stkAs`, `flxAs`, `grdAs`, `secAs`,
  `ctnAs`, `spcAs`, `txtAs`, `lnkAs`, `vhAs`, `hAs`, `alrtAs`, `mnuAs`. Each allows only the tags that make sense
  for the component. `btnAs`, `srfAs` and `lnkAs` also take a component, e.g. a router link,
  whose props are then type-checked:

  ```tsx
  <Button btnAs={RouterLink} to="/pricing" srfVariant="solid">
    See pricing
  </Button>
  ```

- **Responsive props** take a per-breakpoint object: `layGapSize={{ base: 'sm', md: 'lg' }}`.
  Only layout props are responsive, never colors or control sizes.
- **`ref`** is a regular prop (React 19) and reaches the rendered element.
- **Forms are uncontrolled**: native inputs with `name` / `defaultValue`. Read them on submit
  (`FormData`) or with `useFormHandler`.

Where things live:

| Import                      | Holds                                                                                                          |
| --------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `@mainset/react/elements`   | one ui-core element each, stateless                                                                            |
| `@mainset/react/components` | elements combined into one component; may use `useId`, refs and `cloneElement`, but no state                   |
| `@mainset/react/containers` | anything with its own state or JS logic: `useState`, effects, timers, context, DOM side effects, the providers |
| `@mainset/react/hooks`      | hooks with no markup                                                                                           |

## Layout (`elements`)

| Component                      | Props                                                                           | Notes                                            |
| ------------------------------ | ------------------------------------------------------------------------------- | ------------------------------------------------ |
| `Box`                          | `boxAs`, spacing, `bgColor`, `brd*`                                             | the base primitive                               |
| `Stack` / `HStack` / `Cluster` | `stkAs`, `flx*`, `lay*`, spacing                                                | column / centered row / wrapping row, gap `base` |
| `Flex`, `Flex.Item`            | `flxAs`, `flx*`, `lay*`                                                         | raw flexbox                                      |
| `Grid`, `Grid.Item`            | `grdAs`, `grdColumns`, `grdAutoFlow`, `lay*`; item `grdColSpan`, `grdIsFullRow` | auto-fit columns by default                      |
| `Container`                    | `ctnAs`, `ctnSize` (default `xl`), `ctnIsGutterless`, spacing                   | centered max width + gutters                     |
| `Section`                      | `secAs`, `secMaxWidth`, `bgColor`                                               | a page band                                      |
| `Spacing`                      | `spcAs`, spacing                                                                | spacing only                                     |

```tsx
<Section secAs="footer" bgColor="inverse">
  <Container spcType="pv" spcScale="section" spcSize={{ base: 'xs', md: 'lg' }}>
    <Stack
      flxDirection={{ base: 'column', md: 'row' }}
      layJustify="space-between"
    >
      …
    </Stack>
  </Container>
</Section>
```

## Typography (`elements`)

| Component   | Props                                                         | Notes                                                 |
| ----------- | ------------------------------------------------------------- | ----------------------------------------------------- |
| `Heading`   | `hAs` (`h1`–`h6`, default `h1`), `txt*`                       | the level sets a default size; `txtSize` overrides it |
| `Text`      | `txtAs` (span, p, small, strong, code…), `txt*`, spacing      | `TextSection` is an alias                             |
| `Paragraph` | `txt*`, spacing                                               | a `<p>`                                               |
| `Link`      | `lnkAs`, `lnkUnderline` (`always` · `hover` · `none`), `txt*` | current tone's text color                             |

```tsx
<Heading hAs="h1" txtSize="lg">Settings</Heading> {/* the page's h1, toolbar-sized */}
```

## Actions (`components` / `elements`)

| Component     | Props                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| `Button`      | `btnAs`, `btnSize`, `btnIsPending` (`aria-busy`), `btnIsDisabled`, `srfTheme`, `srfVariant`, `srfHover` |
| `ButtonBasic` | the same, unsized (no control height / padding)                                                         |
| `CloseButton` | an icon button (×), ghost, `aria-label` "Close" by default; `children` replace the icon                 |

`btnIsIcon` makes any `Button` a square for an icon alone; give it an `aria-label`.

## Forms

| Component                       | From         | Props                                                                                    |
| ------------------------------- | ------------ | ---------------------------------------------------------------------------------------- |
| `Input`                         | `elements`   | `ctlSize`, `type` (text-like types), native attributes                                   |
| `Textarea`                      | `elements`   | `ctlSize`, `rows` (default 3)                                                            |
| `Select`                        | `elements`   | `ctlSize`, `<option>` children; `className` on the select                                |
| `Checkbox` / `Radio` / `Switch` | `elements`   | native attributes; `children` become the label; `Checkbox` also `chkIsIndeterminate`     |
| `Label`                         | `elements`   | `lblIsRequired`                                                                          |
| `Field`                         | `components` | `fldLabel`, `fldHint`, `fldError`, `fldIsRequired`, `fldControlId`; one control as child |

`Field` gives its control the `id`, `aria-describedby` (hint + error), `aria-invalid` and
`required`; the control stays uncontrolled:

```tsx
import { Field } from '@mainset/react/components';
import {
  Button,
  Checkbox,
  Input,
  Select,
  Stack,
} from '@mainset/react/elements';
import { useFormHandler } from '@mainset/react/hooks';

type SignupValues = { email: string; plan: string; news: boolean };

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
```

`useFormHandler` stores `checked` for checkboxes and switches, `value` for everything else, and
supports nested names (`address.city`, `items[0].name`).

Every control follows the `dir` of its section: `<Box boxAs="section" dir="rtl">` mirrors the
fields, switches and labels inside, on an LTR page too.

Checked colors follow the tone: `<Box className={toneRecipe('success')}>` around a group, or
`ms-tone-*` on any ancestor.

## Feedback and accessibility

`Alert` is in `components`; everything else here in `elements`.

| Component                       | Props                                                                                                                                             | Notes                                                      |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `Alert`                         | `srfTheme` (default `info`), `srfVariant` (default `soft`), `alrtTitle`, `alrtIcon`, `alrtActions`, `alrtOnDismiss`, `alrtDismissLabel`, `alrtAs` | `role="alert"` for `error` / `warning`, `status` otherwise |
| `Spinner`                       | `spnSize`, `spnLabel` (default "Loading")                                                                                                         | `role="status"`; in the current text color                 |
| `VisuallyHidden`                | `vhAs`, `vhIsFocusable`                                                                                                                           | `vhIsFocusable` for skip links                             |
| `Badge`, `CardBasic`, `Surface` | `srf*`, `bgColor`, `brd*`                                                                                                                         | tone × variant containers                                  |

```tsx
<VisuallyHidden vhAs="a" href="#main" vhIsFocusable>
  Skip to content
</VisuallyHidden>
```

```tsx
<Alert
  srfTheme="warning"
  alrtTitle="Payment failed"
  alrtActions={<Button btnSize="sm">Retry</Button>}
>
  Your card was declined.
</Alert>
```

## Overlays (`containers`)

They need the `MainSetProvider`: it keeps the stack of open overlays, the backdrop and the
toasts, so any of them can be opened from any place of the app.

### Dialog and Drawer

Modal: focus trapped while on top and given back to the trigger on close, Escape and a
backdrop click close the top one only, the page doesn't scroll behind them.

Open one by id from anywhere, or control it:

```tsx
import { Button } from '@mainset/react/components';
import { Dialog, useOverlay } from '@mainset/react/containers';

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
```

| Prop                                | Dialog                                                                  | Drawer                                                       |
| ----------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------ |
| id to open it with `useOverlay(id)` | `dlgId`                                                                 | `drwId`                                                      |
| controlled                          | `dlgIsOpen`, `dlgOnOpenChange`                                          | `drwIsOpen`, `drwOnOpenChange`                               |
| size                                | `dlgSize` (`xs`–`xl`, `full`)                                           | `drwSize` (its depth)                                        |
| where                               | centered                                                                | `drwPlacement`: `start` · `end` (default) · `top` · `bottom` |
| role                                | `dlgRole`: `dialog` · `alertdialog` (a backdrop click doesn't close it) | `dialog`                                                     |
| `*IsBackdropDismissable`            | default `true` (`false` for `alertdialog`)                              | default `true`                                               |

- Parts: `Header`, `Title` (names the dialog; `hAs`, default `h2`), `CloseButton`, `Body`,
  `Footer`, the same on `Drawer`. Without a `Title`, give it an `aria-label`.
- `useDialog().dismiss()` closes the one it's rendered in; `useOverlay(id)` gives
  `{ isOpen, open, close, toggle }`; `useMainSet()` has `openOverlayById`, `closeOverlayById`,
  `toggleOverlayOpenById`.
- The initial focus goes to an element with `autoFocus` / `data-autofocus`, else the first
  focusable one.
- `start` / `end` follow `dir`: a drawer at `end` opens on the left in an RTL section.

### Popover

A non-modal panel next to its trigger, positioned by [Floating UI](https://floating-ui.com)
(it flips and shifts to stay on screen). It moves the focus inside; Escape closes it and returns
the focus; a press outside or Tab-ing away closes it too.

```tsx
<Popover popPlacement="bottom" popAlign="end">
  <Popover.Trigger>
    <Button>Filters</Button>
  </Popover.Trigger>
  <Popover.Content aria-label="Filters">…</Popover.Content>
</Popover>
```

Props: `popPlacement` (`top` · `bottom` · `start` · `end`), `popAlign` (`start` · `center` ·
`end`), `popIsOpen` + `popOnOpenChange`, `popDefaultIsOpen`. `Popper` (`elements`) is the
CSS-only variant: it shows on hover / focus-within, no script.

### Tooltip

```tsx
<Tooltip tipContent="Copy link">
  <Button btnIsIcon aria-label="Copy link">
    <CopyIcon />
  </Button>
</Tooltip>
```

On hover (after `tipDelay`, 400ms) and on keyboard focus; it stays while the pointer is over it,
Escape hides it (WCAG 1.4.13). It's the trigger's description (`aria-describedby`), so an icon
button still needs its `aria-label`. Props: `tipPlacement` (default `top`), `tipAlign`,
`tipDelay`, `tipIsDisabled`. Disabled buttons fire no pointer events: wrap them in a `span`.

### Menu

```tsx
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
```

Keyboard (WAI-ARIA menu button): Enter / Space / ↓ on the trigger open it on the first item, ↑
on the last; ↑ / ↓ / Home / End move; typing jumps to an item by its first letters; Enter /
Space / a click select and close it, returning the focus; Escape closes it; Tab closes it and
moves on. `mnuIsDisabled` items stay focusable but do nothing. Props: `mnuPlacement`,
`mnuAlign`, `mnuIsOpen` + `mnuOnOpenChange`.

### Toasts

```tsx
const { toast } = useToast();

toast({ tstTitle: 'Saved', srfTheme: 'success' });
toast({
  tstTitle: 'Message archived',
  tstAction: { label: 'Undo', onClick: unarchive },
});
```

| Option           | Default                                                             |
| ---------------- | ------------------------------------------------------------------- |
| `tstTitle`       | required                                                            |
| `tstDescription` |                                                                     |
| `srfTheme`       | `base`; `error` is announced assertively                            |
| `srfVariant`     | `soft`                                                              |
| `tstDuration`    | 5000ms, paused while hovered or focused; `Infinity` until dismissed |
| `tstAction`      | `{ label, onClick }`, also dismisses                                |
| `tstId`          | the same id shows it again in place ("Saving…" → "Saved")           |

`toast()` returns the id, `dismissToast(id)` closes it. At most 5 are shown. Name the list in
your language with `<MainSetProvider toastRegionLabel="Сповіщення">`.

## Disclosure (`containers`)

### Tabs

```tsx
<Tabs tbsDefaultId="profile">
  <Tabs.List aria-label="Account">
    <Tabs.Trigger tbsId="profile">Profile</Tabs.Trigger>
    <Tabs.Trigger tbsId="billing">Billing</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content tbsId="profile">…</Tabs.Content>
  <Tabs.Content tbsId="billing">…</Tabs.Content>
</Tabs>
```

← / → move between tabs (mirrored in an RTL section), Home / End jump; only the selected tab
is in the Tab order. Props: `tbsOrientation` (`vertical`: ↑ / ↓), `tbsActivation` (`auto`
selects on arrow keys; `manual` waits for Enter / Space), `tbsControllerId` +
`tbsOnBtnTabChangeClick` (controlled).

### Accordion

```tsx
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
```

Props: `accType` (`single` default · `multiple`), `accIsCollapsible` (single: whether all can
close, default `true`), `accHeadingAs` (the triggers' heading level, default `h3`, to fit the
page outline), `accOpenIds` + `accOnOpenChange` (controlled); item `accIsDisabled`. Collapsed
panels stay in the DOM (`hidden`), ↑ / ↓ / Home / End move between triggers.

## Data display

`Table`, `Skeleton` and `Progress` are in `elements`, `AvatarGroup` in `components`, `Avatar`
in `containers` (it keeps the state of its picture).

### Table

```tsx
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
```

Props: `tblSize` (`sm` · `base` · `lg`), `tblIsStriped`, `tblIsHoverable`, `tblIsBordered`,
`tblIsStickyHeader`, `tblWrapperProps` (the scrolling wrapper: a `style={{ maxBlockSize }}` for
the sticky header, `tabIndex={0}` + `role="region"` + `aria-label` so a keyboard can scroll it);
everything else goes to the `table`. Parts: `Caption`, `Head`, `Body`, `Foot`, `Row`
(`tblIsSelected`), `HeaderCell` (`scope="col"` by default) and `Cell` (`tblAlign`).
`SortableHeaderCell` takes `tblSortDirection` (`ascending` · `descending` · `null`) and
`tblOnSort`. The sort state and the sorting are yours: only the sorted column gets `aria-sort`.

### Avatar and AvatarGroup

```tsx
<Avatar avtSrc={user.photoUrl} avtName={user.name} avtSize="sm" />

<AvatarGroup aria-label="Members" avtSize="sm" avtMax={3}>
  {members.map((member) => (
    <Avatar key={member.id} avtName={member.name} avtSrc={member.photoUrl} />
  ))}
</AvatarGroup>
```

`Avatar`: `avtSrc`, `avtName` (its accessible name and the initials of the fallback; without
it the avatar is decorative), `avtSize`, `avtShape` (`circle` · `square`), `avtTone`,
`avtImgProps` (`srcSet`, `loading`…), `children` (a fallback instead of the initials). The
fallback shows while the picture loads and if it fails, including a failure before hydration.

`AvatarGroup`: `avtSize` / `avtShape` for every avatar that doesn't set its own, `avtMax` (the
rest are counted in a "+N" avatar), `avtGetMoreLabel` (default `` (count) => `${count} more` ``).

### Skeleton

```tsx
<div aria-busy={!user}>
  <Skeleton sklVariant="circle" sklIsLoading={!user}>
    <Avatar avtName={user?.name} />
  </Skeleton>
  <Skeleton sklVariant="text" sklLines={3} />
</div>
```

Props: `sklVariant` (`text` · `rect` default · `circle`), `sklLines` (several `text` lines, the
last one shorter), `sklIsLoading` (default `true`; `false` renders the children as they are).
With children, it takes their size. Size an empty `rect` with `style` or a class. Skeletons are
`aria-hidden`: put `aria-busy` on the loading region.

### Progress

```tsx
<Progress aria-label="Upload" prgValue={uploaded} prgMax={total} prgTone="success" />
<Progress aria-label="Loading results" />
```

Props: `prgValue` (unset / `null`: indeterminate), `prgMin` (0), `prgMax` (100),
`prgValueText` (read instead of the percentage, e.g. "3 of 8 files"), `prgSize` (`sm` · `base` ·
`lg`), `prgTone`. It's a `role="progressbar"`: give it a name.

## Navigation (`components`)

### Pagination

```tsx
<Pagination pgnPage={page} pgnPageCount={20} pgnOnPageChange={setPage} />

<Pagination
  pgnPage={page}
  pgnPageCount={20}
  pgnGetHref={(page) => `?page=${page}`}
  pgnLinkAs={NextLink}
/>
```

Props: `pgnPage` (from 1), `pgnPageCount`, `pgnOnPageChange` (page buttons) or `pgnGetHref`
(page links; `pgnLinkAs` is the link component, given `href`), `pgnSiblingCount` (1),
`pgnBoundaryCount` (1), `pgnSize`, and the labels `pgnLabel` ("Pagination"),
`pgnPreviousLabel` ("Previous page"), `pgnNextLabel` ("Next page"), `pgnGetPageLabel`
(`` (page) => `Page ${page}` ``). The current page is a solid button in the inherited tone
(`aria-current="page"`), the others are neutral. Previous / next are disabled at the ends.
For a router whose link takes `to`, wrap it: `({ href, ...props }) => <Link to={href} {...props} />`.

### Breadcrumb

```tsx
<Breadcrumb>
  <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
  <Breadcrumb.Item brcAs={RouterLink} to="/docs">
    Docs
  </Breadcrumb.Item>
  <Breadcrumb.Item brcIsCurrent>Install</Breadcrumb.Item>
</Breadcrumb>
```

Props: `brcSeparator` (default `/`; `›` is mirrored in RTL text, an icon may need mirroring),
`brcLabel` ("Breadcrumb"). Each child becomes a list item, so pass items directly, not in a
fragment. `Breadcrumb.Item`: `brcAs` (a router link), `brcIsCurrent` (`aria-current="page"`);
it's a `span` unless it has an `href` or a `brcAs`.
