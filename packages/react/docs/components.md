# Components

Every component renders [`@mainset/ui-core`](../../ui-core/docs/elements.md) classes and adds
behaviour. For customizing the looks (tokens, tones, dark mode), see [Theming in React](./theming.md).

## Conventions

- **Prefixed props.** Each component family has a prefix (`btn*`, `srf*`, `spc*`, `flx*`,
  `lay*`, `grd*`, `ctn*`, `txt*`, `lnk*`, `ctl*`, `fld*`…), so props are easy to grep and never
  collide with HTML attributes.
- **`*As` picks the tag**: `btnAs`, `srfAs`, `boxAs`, `stkAs`, `flxAs`, `grdAs`, `secAs`,
  `ctnAs`, `spcAs`, `txtAs`, `lnkAs`, `vhAs`, `hAs`. Each allows only the tags that make sense
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

## Feedback and accessibility (`elements`)

| Component                       | Props                                     | Notes                                      |
| ------------------------------- | ----------------------------------------- | ------------------------------------------ |
| `Spinner`                       | `spnSize`, `spnLabel` (default "Loading") | `role="status"`; in the current text color |
| `VisuallyHidden`                | `vhAs`, `vhIsFocusable`                   | `vhIsFocusable` for skip links             |
| `Badge`, `CardBasic`, `Surface` | `srf*`, `bgColor`, `brd*`                 | tone × variant containers                  |

```tsx
<VisuallyHidden vhAs="a" href="#main" vhIsFocusable>
  Skip to content
</VisuallyHidden>
```
