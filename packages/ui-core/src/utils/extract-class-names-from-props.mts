interface ClassNameFromPropConfig {
  baseClass: string;
  propDefinitionByName: Record<
    string,
    {
      modifier: string;
      options: readonly (string | boolean | number)[];
      defaultValue?: string | boolean | number;
    }
  >;
}

type ExtractClassNameFromPropOptions<
  TConfig extends {
    propDefinitionByName: Record<string, { options: readonly any[] }>;
  },
  TPropName extends keyof TConfig['propDefinitionByName'],
> = TConfig['propDefinitionByName'][TPropName]['options'][number];

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
    const { baseClass, propDefinitionByName } = config;

    // Add the base class for this config
    classes.push(styles ? styles[baseClass] || baseClass : baseClass);

    // Process all configured props for this config
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

      // Use prop value if provided, otherwise fall back to defaultValue
      const propValue =
        props[configPropName] !== undefined
          ? props[configPropName]
          : propConfig.defaultValue;

      // Only process if the value resolves to something truthy or `0`
      if (propValue != null && propValue !== false) {
        const { modifier } = propConfig;

        // Concat strings directly instead of let initialization (marginally faster in V8)
        const generatedClass =
          propValue === true
            ? `${baseClass}--${modifier}`
            : `${baseClass}--${modifier}-${propValue as string}`;

        const resolvedClass = styles ? styles[generatedClass] : undefined;
        classes.push(resolvedClass || generatedClass);
      }
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
