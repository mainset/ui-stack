type BasePropDefinition = {
  options: readonly (string | boolean | number)[];
  defaultValue?: string | boolean | number;
};

type ComposedConfig = {
  baseClass: string;
  isSingleClassComposed: true;
  propDefinitionByName: Record<
    string,
    BasePropDefinition & { modifier?: string }
  >;
};

type MultipleClassesConfig = {
  baseClass: string;
  isSingleClassComposed?: false;
  propDefinitionByName: Record<
    string,
    BasePropDefinition & { modifier: string }
  >;
};

type ClassNameFromPropConfig = ComposedConfig | MultipleClassesConfig;

type ExtractClassNameFromPropOptions<
  TConfig extends {
    propDefinitionByName: Record<string, { options: readonly any[] }>;
  },
  TPropName extends keyof TConfig['propDefinitionByName'],
> = TConfig['propDefinitionByName'][TPropName]['options'][number];

function processComposedConfig(
  config: ClassNameFromPropConfig,
  props: Record<string, any>,
  styles: Record<string, string> | undefined,
  handledPropNames: Record<string, boolean>,
  classes: string[],
) {
  const { baseClass, propDefinitionByName } = config;
  const combinedValues: (string | number)[] = [];

  for (const configPropName in propDefinitionByName) {
    if (
      !Object.prototype.hasOwnProperty.call(
        propDefinitionByName,
        configPropName,
      )
    )
      continue;

    handledPropNames[configPropName] = true;
    const propConfig = propDefinitionByName[configPropName];
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

function processMultipleConfig(
  config: ClassNameFromPropConfig,
  props: Record<string, any>,
  styles: Record<string, string> | undefined,
  handledPropNames: Record<string, boolean>,
  classes: string[],
) {
  const { baseClass, propDefinitionByName } = config;

  for (const configPropName in propDefinitionByName) {
    if (
      !Object.prototype.hasOwnProperty.call(
        propDefinitionByName,
        configPropName,
      )
    )
      continue;

    handledPropNames[configPropName] = true;
    const propConfig = propDefinitionByName[configPropName];
    const propValue =
      props[configPropName] !== undefined
        ? props[configPropName]
        : propConfig.defaultValue;

    if (propValue != null && propValue !== false) {
      const { modifier } = propConfig;
      let generatedClass = '';

      if (propValue === true) {
        generatedClass = modifier
          ? `${baseClass}--${modifier}`
          : `${baseClass}--${configPropName}`;
      } else {
        generatedClass = modifier
          ? `${baseClass}--${modifier}-${propValue}`
          : `${baseClass}--${propValue}`;
      }

      const resolvedClass = styles ? styles[generatedClass] : undefined;
      classes.push(resolvedClass || generatedClass);
    }
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
