# Theming in React (`@mainset/react`)

`@mainset/react` has **no theme provider and no theme object**. Components render ui-core classes,
and ui-core's CSS custom properties do all the theming. In React you:

1. set the color scheme with a `data-theme` attribute,
2. pick tones and variants with props,
3. override tokens with your own CSS, as in [Theming with CSS](./ui-core.md).

The library has no React-specific theming API to learn, and React adds no runtime cost for theming.

## Setup

```tsx
// your token overrides (any order works)
import { MainSetProvider } from '@mainset/react/containers';
import '@mainset/react/styles/main.css';

// optional reset; import it before anything else
import './app-theme.css';

export function App() {
  return (
    <MainSetProvider>
      {' '}
      {/* overlays / modals state; not related to theming */}
      <Routes />
    </MainSetProvider>
  );
}
```

Component CSS (tokens included) is imported by the components themselves, so a bundler ships
only what you use.

## 1. Color scheme

Put `data-theme` on `<html>`, preferably in the server-rendered markup so the first paint is right:

```html
<html lang="en" data-theme="system"></html>
```

Any element can start its own scheme. It's an ordinary attribute in JSX:

```tsx
<footer data-theme="dark">…</footer>
<Surface data-theme="light" srfVariant="soft">A light card on a dark page</Surface>
```

### A scheme switcher (app code)

The library doesn't ship one, because it's a few lines and apps differ in where they persist
the choice:

```tsx
type ColorScheme = 'light' | 'dark' | 'system';

function useColorScheme(initial: ColorScheme = 'system') {
  const [scheme, setScheme] = React.useState<ColorScheme>(() => {
    try {
      return (localStorage.getItem('color-scheme') as ColorScheme) || initial;
    } catch {
      return initial;
    }
  });

  React.useEffect(() => {
    document.documentElement.dataset.theme = scheme;
    try {
      localStorage.setItem('color-scheme', scheme);
    } catch {}
  }, [scheme]);

  return [scheme, setScheme] as const;
}
```

To avoid a light flash before React hydrates, set the attribute from a tiny inline script in
`<head>` (or render it on the server from a cookie):

```html
<script>
  try {
    document.documentElement.dataset.theme =
      localStorage.getItem('color-scheme') || 'system';
  } catch (e) {}
</script>
```

## 2. Tones and variants via props

| Prop         | On                                                       | Does                                                         |
| ------------ | -------------------------------------------------------- | ------------------------------------------------------------ |
| `srfTheme`   | `Surface`, `Button`, `ButtonBasic`, `Badge`, `CardBasic` | sets the tone (`.ms-tone-*`) for the element and its subtree |
| `srfVariant` | same                                                     | `solid` · `soft` · `outlined` · `ghost`                      |
| `srfHover`   | same                                                     | which roles change on hover: `bg` · `border` · `all`         |
| `bgColor`    | `Surface` (and the components above), `Section`          | background = `--ms-color-{tone}-solid`                       |
| `brdColor`   | `Surface` (and the components above)                     | border color = `--ms-color-{tone}-border`                    |
| `txtColor`   | `Heading`, `Paragraph`, `TextSection`, `SVGIcon`         | text color = `--ms-color-{tone}-text`                        |

```tsx
import { Button } from '@mainset/react/components';
import { Badge, Surface } from '@mainset/react/elements';

<Button srfVariant="solid">Save</Button>                      {/* primary by default */}
<Button srfTheme="error" srfVariant="outlined">Delete</Button>
<Badge srfTheme="success" srfVariant="soft">Paid</Badge>
```

### Tone a whole subtree

The tone is inherited, so a parent sets it once for every child:

```tsx
<Surface srfTheme="warning" srfVariant="soft">
  <Paragraph>Your trial ends in 3 days.</Paragraph>
  <Button srfVariant="solid">Upgrade</Button> {/* warning, without a prop */}
</Surface>
```

For a parent that isn't a Surface, use the recipe:

```tsx
import { toneRecipe } from '@mainset/ui-core';

<div className={toneRecipe('error')}>…</div>; // → "ms-tone-error"
```

Tones and colors are **not responsive props**: a button doesn't change color at a breakpoint.

## 3. Overriding tokens

Global and scheme overrides go in a stylesheet, see
[Theming with CSS](./ui-core.md#3-re-brand-change-a-tone) and the
[scheme-aware pattern](./ui-core.md#scheme-aware-overrides).

For one element, pass the custom property through `className` (preferred) or `style`:

```tsx
<Button className="checkout-button" srfVariant="solid">Pay</Button>
// .checkout-button { --ms-control-radius: 0; }

<Button style={{ '--ms-control-radius': '0' } as React.CSSProperties}>Pay</Button>
```

Overriding `--ms-tone-*` works only on an element that carries the tone itself, i.e. one with
`srfTheme` set. See [where an override applies](./ui-core.md#where-an-override-applies).

## 4. Live theming

To let users pick brand colors in the browser, generate the tone values and inject them as a
stylesheet. A `<input type="color">` then re-themes the page on every change. See
[Live theming](./live-theming.md#react).

## Your own components

Build on the same contract and your components theme for free:

```tsx
import type { ElementColor } from '@mainset/ui-core';
import { cnx, surfaceRecipe } from '@mainset/ui-core';

function Callout({
  tone,
  className,
  ...props
}: { tone?: ElementColor } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cnx(
        className,
        surfaceRecipe({ srfTheme: tone, srfVariant: 'soft' }),
        'callout',
      )}
      {...props}
    />
  );
}
```

```css
.callout {
  border-inline-start: 4px solid var(--ms-tone-border); /* follows tone and scheme */
}
```

Read `--ms-tone-*` and `--ms-color-*` tokens in your CSS, never palette colors or hex values.
