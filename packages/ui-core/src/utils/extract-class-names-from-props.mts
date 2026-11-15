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

function processComposedConfig(
  config: ClassNameFromPropConfig,
  props: Record<string, any>,
  styles: Record<string, string> | undefined,
  handledPropNames: Record<string, boolean>,
  classes: string[],
) {
  const { baseClass, classNameDefinitionByPropName } = config;
  const combinedValues: (string | number)[] = [];

  for (const configPropName in classNameDefinitionByPropName) {
    if (
      !Object.prototype.hasOwnProperty.call(
        classNameDefinitionByPropName,
        configPropName,
      )
    )
      continue;

    handledPropNames[configPropName] = true;
    const propConfig = classNameDefinitionByPropName[configPropName];
    const propValue =
      props[configPropName] !== undefined
        ? props[configPropName]
        : propConfig.defaultValue;

    if (propValue != null && propValue !== false) {
      if (propValue === true) {
        if (propConfig.modifier) combinedValues.push(propConfig.modifier);
      } else {
        combinedValues.push(propValue as string | number);
      }
    }
  }

  if (combinedValues.length > 0) {
    const generatedClass = `${baseClass}--${combinedValues.join('-')}`;
    const resolvedClass = styles ? styles[generatedClass] : undefined;
    classes.push(resolvedClass || generatedClass);
  }
}

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

function processMultipleConfig(
  config: ClassNameFromPropConfig,
  props: Record<string, any>,
  styles: Record<string, string> | undefined,
  handledPropNames: Record<string, boolean>,
  classes: string[],
  style: ResponsiveStyle,
) {
  const { baseClass, classNameDefinitionByPropName } = config;

  const pushClass = (generatedClass: string | null) => {
    if (!generatedClass) return;

    const resolvedClass = styles ? styles[generatedClass] : undefined;
    classes.push(resolvedClass || generatedClass);
  };

  for (const configPropName in classNameDefinitionByPropName) {
    if (
      !Object.prototype.hasOwnProperty.call(
        classNameDefinitionByPropName,
        configPropName,
      )
    )
      continue;

    handledPropNames[configPropName] = true;
    const propConfig = classNameDefinitionByPropName[configPropName];
    const propValue =
      props[configPropName] !== undefined
        ? props[configPropName]
        : propConfig.defaultValue;
    const { modifier } = propConfig;

    if (propConfig.responsive && isResponsiveObject(propValue)) {
      for (const breakpoint in propValue) {
        const breakpointValue = propValue[breakpoint];
        const generatedClass = buildMultipleConfigClass(
          baseClass,
          configPropName,
          modifier,
          breakpointValue,
        );
        if (!generatedClass) continue;

        if (breakpoint === RESPONSIVE_BASE_BREAKPOINT) {
          pushClass(generatedClass);
        } else if (propConfig.responsive === 'class') {
          pushClass(`${generatedClass}@${breakpoint}`);
        } else if (
          propConfig.responsive === 'css-var' &&
          // only declared options reach the inline style (no arbitrary CSS via a prop)
          isDeclaredOption(propConfig.options, breakpointValue)
        ) {
          const varModifier = propConfig.modifier;
          pushClass(responsiveVarClassName(baseClass, varModifier, breakpoint));
          style[responsiveVarName(baseClass, varModifier, breakpoint)] =
            resolveCssValue(propConfig.cssValue, breakpointValue);
        }
      }
      continue;
    }

    pushClass(
      buildMultipleConfigClass(baseClass, configPropName, modifier, propValue),
    );
  }
}

/**
 * Style props → `[classNames, restProps, style]`.
 * {style} holds the inline CSS variables of `css-var` responsive props (empty otherwise):
 * spread it into the element's `style`, or the breakpoint classes have no value.
 */
function extractClassNamesFromProps(
  configs: ClassNameFromPropConfig[],
  props: Record<string, any>,
  styles?: Record<string, string>,
): [string[], Record<string, any>, ResponsiveStyle] {
  const classes: string[] = [];
  const restProps: Record<string, any> = {};
  const style: ResponsiveStyle = {};

  // Track all handled props across all configs so we can exclude them from restProps
  const handledPropNames: Record<string, boolean> = {};

  // 1 & 2. Process all configs
  for (let c = 0; c < configs.length; c++) {
    const config = configs[c];
    const { baseClass, isSingleClassComposed } = config;

    // Add the base class for this config
    classes.push(styles ? styles[baseClass] || baseClass : baseClass);

    // Branch into specific processing logic
    if (isSingleClassComposed) {
      processComposedConfig(config, props, styles, handledPropNames, classes);
    } else {
      processMultipleConfig(
        config,
        props,
        styles,
        handledPropNames,
        classes,
        style,
      );
    }
  }

  // 3. Separate standard HTML/React props into restProps using Object.keys
  const propKeys = Object.keys(props);
  for (let i = 0; i < propKeys.length; i++) {
    const propName = propKeys[i];
    if (!handledPropNames[propName]) {
      restProps[propName] = props[propName];
    }
  }

  return [classes, restProps, style];
}

export { extractClassNamesFromProps };
export type {
  CNBasedPropDefinition,
  ClassNameFromPropConfig,
  ExtractClassNameFromPropOptions,
};
