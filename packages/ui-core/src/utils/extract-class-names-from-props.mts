import { BREAKPOINT__DEFAULT } from '../tokens/index.mjs';

type CNBasedPropDefinition = {
  options: readonly (string | boolean | number)[];
  defaultValue?: string | boolean | number;
  /**
   * Accepts a per-breakpoint object, e.g. `{ base: 'column', md: 'row' }`.
   * Each entry generates the class with an `@{breakpoint}` suffix (none for `base`),
   * matching the CSS emitted by the `responsive-variants` Sass mixin.
   */
  isResponsive?: boolean;
};

// The mobile-first default breakpoint (min-width 0): its classes carry no `@{breakpoint}` suffix
const RESPONSIVE_BASE_BREAKPOINT = BREAKPOINT__DEFAULT;

const isResponsiveObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

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

    if (propConfig.isResponsive && isResponsiveObject(propValue)) {
      for (const breakpoint in propValue) {
        const generatedClass = buildMultipleConfigClass(
          baseClass,
          configPropName,
          modifier,
          propValue[breakpoint],
        );
        if (!generatedClass) continue;

        pushClass(
          breakpoint === RESPONSIVE_BASE_BREAKPOINT
            ? generatedClass
            : `${generatedClass}@${breakpoint}`,
        );
      }
      continue;
    }

    pushClass(
      buildMultipleConfigClass(baseClass, configPropName, modifier, propValue),
    );
  }
}

function extractClassNamesFromProps(
  configs: ClassNameFromPropConfig[],
  props: Record<string, any>,
  styles?: Record<string, string>,
): [string[], Record<string, any>] {
  const classes: string[] = [];
  const restProps: Record<string, any> = {};

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
      processMultipleConfig(config, props, styles, handledPropNames, classes);
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

  return [classes, restProps];
}

export { extractClassNamesFromProps };
export type { ClassNameFromPropConfig, ExtractClassNameFromPropOptions };
