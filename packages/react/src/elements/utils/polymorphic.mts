import type React from 'react';

/**
 * Any React component (e.g. a router `Link`). Its own props are still type-checked: they come
 * from `React.ComponentPropsWithRef<C>` with the inferred {C}.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- what `React.ElementType` requires
type AnyComponent = React.JSXElementConstructor<any>;

/** Block-level tags a layout primitive (Box, Flex, Stack…) may render as */
type BlockElementType =
  | 'div'
  | 'span'
  | 'section'
  | 'article'
  | 'aside'
  | 'header'
  | 'footer'
  | 'main'
  | 'nav'
  | 'form'
  | 'fieldset'
  | 'ul'
  | 'ol'
  | 'li';

/**
 * Props of a component that renders as {C}, chosen with its own prefixed `*As` prop {K}
 * (`btnAs`, `srfAs`, `hAs` … — one prefix per component, like every other prop).
 * {C}'s props are included, except those the component defines itself.
 *
 * @example
 * type ButtonProps<C extends 'button' | 'a' | AnyComponent> = PolymorphicProps<'btnAs', C, Own>;
 * <Button btnAs={Link} to="/home">Home</Button>
 */
type PolymorphicProps<
  K extends string,
  C extends React.ElementType,
  OwnProps = object,
  // NOTE: with `ref` — a regular prop since React 19
> = OwnProps & { [P in K]?: C } & Omit<
    React.ComponentPropsWithRef<C>,
    keyof OwnProps | K
  >;

export type { AnyComponent, BlockElementType, PolymorphicProps };
