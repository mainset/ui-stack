import type { ResponsiveStyle } from './responsive.mjs';
import {
  RESPONSIVE_BASE_BREAKPOINT,
  isDeclaredOption,
  isResponsiveObject,
  responsiveVarClassName,
  responsiveVarName,
} from './responsive.mjs';

/**
 * A prop may accept a mobile-first per-breakpoint object, e.g. `{ base: 'column', md: 'row' }`.
 * Only props that change the *layout* are responsive (direction, display, wrap, justify, align,
 * gap, padding, columns…), never props that only change the *look* (tone, color, radius, weight,
 * control size): see README › Responsive props.
 */
type ResponsiveDefinition =
  | {
      /**
       * `'class'` — for props with few options: one class per option per breakpoint,
       * `ms-flex--flex-direction-row@md` (the `responsive-variants` Sass mixin).
       */
      responsive?: 'class';
    }
  | {
      /**
       * `'css-var'` — for props with many options: the `base` value stays a plain class, every
       * other breakpoint adds a single class per prop, `ms-layout--gap-size@md`, and sets its value
       * inline as `--ms-layout-gap-size-at-md` (the `responsive-var-variants` Sass mixin), so the
       * CSS grows per breakpoint, not per option × breakpoint.
       * Needs a non-empty `modifier` (it names the class and the variable; Sass enforces it).
       */
      responsive: 'css-var';
      cssValue: string;
      modifier: string;
    };

type CNBasedPropDefinition = ResponsiveDefinition & {
  options: readonly (string | boolean | number)[];
  defaultValue?: string | boolean | number;
  /**
   * The CSS value of an option, `{option}` is replaced by the option,
   * e.g. `'var(--ms-space-layout-row-{option})'`. Used by the generated classes and,
   * for `css-var` responsive props, as the inline value of each breakpoint.
   */
  cssValue?: string;
};

const resolveCssValue = (template: string, option: string | number) =>
  template.replace(/\{option\}/g, String(option));

type ComposedConfig = {
  baseClass: string;
  isSingleClassComposed: true;
  classNameDefinitionByPropName: Record<
    string,
    CNBasedPropDefinition & { modifier?: string }
  >;
};

type MultipleClassesConfig = {
  baseClass: string;
  isSingleClassComposed?: false;
  classNameDefinitionByPropName: Record<
    string,
    CNBasedPropDefinition & { modifier: string }
  >;
};

type ClassNameFromPropConfig = ComposedConfig | MultipleClassesConfig;

type ExtractClassNameFromPropOptions<
  TConfig extends {
    classNameDefinitionByPropName: Record<string, { options: readonly any[] }>;
  },
  TPropName extends keyof TConfig['classNameDefinitionByPropName'],
> = TConfig['classNameDefinitionByPropName'][TPropName]['options'][number];

// ---------------------------------------------------------------------------------------------
// Compiled configs: every option's class string is built once per config list (at first use),
// so a call only loops over the props it was given and does lookups. Each class lands in a fixed
// slot (config order, then definition order), so the output order never depends on prop order.
// Cached by config identity, so the inline `[A, B]` arrays that components pass on every render
// hit it too. NOTE: configs are constants; one mutated after its first use keeps its classes.
// ---------------------------------------------------------------------------------------------

type PropDefinition = CNBasedPropDefinition & { modifier?: string };

type CompiledProp = {
  name: string;
  definition: PropDefinition;
  baseClass: string;
  /** declared option (plus `null` / `false`) → its class, `''` for none */
  classByOption: Map<unknown, string>;
  /** the class of `defaultValue`, `''` for none */
  defaultClass: string;
  /** where its class goes in the output; `-1` for props of a composed config */
  slot: number;
};

type ComposedEntry = {
  baseClass: string;
  props: CompiledProp[];
  slot: number;
};

// `undefined` not set · `''` set, no class · class · classes of a per-breakpoint object
type Slot = string | string[] | undefined;

type CompiledConfigs = {
  /** base classes at their slots, `undefined` elsewhere (copied per call) */
  slotTemplate: Slot[];
  /** style prop name → its definition(s), one per config that declares it */
  propsByName: Map<string, CompiledProp[]>;
  /** props with a default, applied when a call leaves their slot unset */
  propsWithDefault: CompiledProp[];
  composedConfigs: ComposedEntry[];
};

type CacheNode = {
  compiled: CompiledConfigs | null;
  next: WeakMap<ClassNameFromPropConfig, CacheNode>;
};

function buildMultipleConfigClass(
  baseClass: string,
  configPropName: string,
  modifier: string | undefined,
  propValue: unknown,
): string | null {
  if (propValue == null || propValue === false) return null;

  if (propValue === true) {
    return modifier
      ? `${baseClass}--${modifier}`
      : `${baseClass}--${configPropName}`;
  }

  return modifier
    ? `${baseClass}--${modifier}-${propValue}`
    : `${baseClass}--${propValue}`;
}

function compileProp(
  baseClass: string,
  name: string,
  definition: PropDefinition,
  slot: number,
): CompiledProp {
  const classByOption = new Map<unknown, string>();
  const toClass = (value: unknown) =>
    buildMultipleConfigClass(baseClass, name, definition.modifier, value) || '';

  // NOTE: composed configs join raw values into one class (see `composedClass`)
  if (slot !== -1) {
    for (const option of [...definition.options, null, false]) {
      classByOption.set(option, toClass(option));
    }
  }

  return {
    name,
    definition,
    baseClass,
    classByOption,
    defaultClass:
      slot === -1 || definition.defaultValue === undefined
        ? ''
        : toClass(definition.defaultValue),
    slot,
  };
}

function compileConfigs(configs: ClassNameFromPropConfig[]): CompiledConfigs {
  const compiled: CompiledConfigs = {
    slotTemplate: [],
    propsByName: new Map(),
    propsWithDefault: [],
    composedConfigs: [],
  };
  const { slotTemplate, propsByName } = compiled;

  for (const config of configs) {
    const { baseClass, classNameDefinitionByPropName } = config;
    slotTemplate.push(baseClass);

    const composed: ComposedEntry | null = config.isSingleClassComposed
      ? { baseClass, props: [], slot: slotTemplate.push(undefined) - 1 }
      : null;
    if (composed) compiled.composedConfigs.push(composed);

    for (const name of Object.keys(classNameDefinitionByPropName)) {
      const slot = composed ? -1 : slotTemplate.push(undefined) - 1;
      const prop = compileProp(
        baseClass,
        name,
        classNameDefinitionByPropName[name],
        slot,
      );

      if (composed) composed.props.push(prop);
      if (prop.defaultClass) compiled.propsWithDefault.push(prop);

      const sameName = propsByName.get(name);
      if (sameName) sameName.push(prop);
      else propsByName.set(name, [prop]);
    }
  }

  return compiled;
}

const compiledByChain = new WeakMap<ClassNameFromPropConfig, CacheNode>();

function getCompiledConfigs(
  configs: ClassNameFromPropConfig[],
): CompiledConfigs {
  let level = compiledByChain;
  let node: CacheNode | undefined;

  for (let i = 0; i < configs.length; i++) {
    node = level.get(configs[i]);
    if (!node) {
      node = { compiled: null, next: new WeakMap() };
      level.set(configs[i], node);
    }
    level = node.next;
  }

  if (!node) return compileConfigs([]);
  node.compiled ??= compileConfigs(configs);

  return node.compiled;
}

// A composed config joins its values into one class, e.g. `ms-spacing--pv-element-sm`
function composedClass(
  composed: ComposedEntry,
  props: Record<string, unknown>,
): string {
  const combinedValues: (string | number)[] = [];

  for (let i = 0; i < composed.props.length; i++) {
    const { name, definition } = composed.props[i];
    const propValue =
      props[name] !== undefined ? props[name] : definition.defaultValue;

    if (propValue != null && propValue !== false) {
      if (propValue === true) {
        if (definition.modifier) combinedValues.push(definition.modifier);
      } else {
        combinedValues.push(propValue as string | number);
      }
    }
  }

  return combinedValues.length > 0
    ? `${composed.baseClass}--${combinedValues.join('-')}`
    : '';
}

// Per-breakpoint object of a responsive prop, e.g. `{ base: 'column', md: 'row' }`
function responsiveClasses(
  prop: CompiledProp,
  propValue: Record<string, unknown>,
  style: ResponsiveStyle,
): string[] {
  const { baseClass, name, definition } = prop;
  const classes: string[] = [];

  for (const breakpoint in propValue) {
    const breakpointValue = propValue[breakpoint];
    const generatedClass =
      prop.classByOption.get(breakpointValue) ??
      buildMultipleConfigClass(
        baseClass,
        name,
        definition.modifier,
        breakpointValue,
      );
    if (!generatedClass) continue;

    if (breakpoint === RESPONSIVE_BASE_BREAKPOINT) {
      classes.push(generatedClass);
    } else if (definition.responsive === 'class') {
      classes.push(`${generatedClass}@${breakpoint}`);
    } else if (
      definition.responsive === 'css-var' &&
      // only declared options reach the inline style (no arbitrary CSS via a prop)
      isDeclaredOption(definition.options, breakpointValue)
    ) {
      const varModifier = definition.modifier;
      classes.push(responsiveVarClassName(baseClass, varModifier, breakpoint));
      style[responsiveVarName(baseClass, varModifier, breakpoint)] =
        resolveCssValue(definition.cssValue, breakpointValue);
    }
  }

  return classes;
}

function propSlot(
  prop: CompiledProp,
  propValue: unknown,
  style: ResponsiveStyle,
): Slot {
  if (prop.definition.responsive && isResponsiveObject(propValue)) {
    return responsiveClasses(prop, propValue, style);
  }

  // a declared option is a lookup; anything else is built as before (types keep it rare)
  return (
    prop.classByOption.get(propValue) ??
    (buildMultipleConfigClass(
      prop.baseClass,
      prop.name,
      prop.definition.modifier,
      propValue,
    ) ||
      '')
  );
}

/**
 * One pass over the given props: style props fill their slots, the rest go to {restProps}
 * (skipped when `null`, for recipes).
 */
function fillSlots(
  compiled: CompiledConfigs,
  props: Record<string, unknown>,
  style: ResponsiveStyle,
  restProps: Record<string, unknown> | null,
): Slot[] {
  const slots = compiled.slotTemplate.slice();

  for (const propName in props) {
    if (!Object.prototype.hasOwnProperty.call(props, propName)) continue;

    const definitions = compiled.propsByName.get(propName);
    if (definitions === undefined) {
      if (restProps) restProps[propName] = props[propName];
      continue;
    }

    const propValue = props[propName];
    // `undefined` falls back to the default below, like a prop that isn't set
    if (propValue === undefined) continue;

    for (let i = 0; i < definitions.length; i++) {
      const prop = definitions[i];
      if (prop.slot !== -1) slots[prop.slot] = propSlot(prop, propValue, style);
    }
  }

  for (let i = 0; i < compiled.propsWithDefault.length; i++) {
    const prop = compiled.propsWithDefault[i];
    if (slots[prop.slot] === undefined) slots[prop.slot] = prop.defaultClass;
  }

  for (let i = 0; i < compiled.composedConfigs.length; i++) {
    const composed = compiled.composedConfigs[i];
    slots[composed.slot] = composedClass(composed, props);
  }

  return slots;
}

/**
 * Style props → `[classNames, restProps, style]`.
 * {style} holds the inline CSS variables of `css-var` responsive props (empty otherwise):
 * spread it into the element's `style`, or the breakpoint classes have no value.
 */
function extractClassNamesFromProps(
  configs: ClassNameFromPropConfig[],
  props: Record<string, any>,
): [string[], Record<string, any>, ResponsiveStyle] {
  const restProps: Record<string, any> = {};
  const style: ResponsiveStyle = {};
  const slots = fillSlots(getCompiledConfigs(configs), props, style, restProps);

  const classes: string[] = [];
  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    if (!slot) continue;

    if (typeof slot === 'string') classes.push(slot);
    else for (let j = 0; j < slot.length; j++) classes.push(slot[j]);
  }

  return [classes, restProps, style];
}

/**
 * Like {extractClassNamesFromProps} without the rest props (recipes ignore non-style props):
 * `[className, style]`, the class names already joined.
 */
function composeClassNameString(
  configs: ClassNameFromPropConfig[],
  props: Record<string, any>,
): [string, ResponsiveStyle] {
  const style: ResponsiveStyle = {};
  const slots = fillSlots(getCompiledConfigs(configs), props, style, null);

  let className = '';
  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    if (!slot) continue;

    const value = typeof slot === 'string' ? slot : slot.join(' ');
    if (value) className += (className ? ' ' : '') + value;
  }

  return [className, style];
}

export { composeClassNameString, extractClassNamesFromProps };
export type {
  CNBasedPropDefinition,
  ClassNameFromPropConfig,
  ExtractClassNameFromPropOptions,
};
