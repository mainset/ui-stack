type StyleBasedPropDefinition = {
  defaultValue?: string | boolean | number;
};

type ValueMappedStyleDefinition = StyleBasedPropDefinition & {
  cssVariableName: string;
  cssVariableNameModifierFromProp?: string;
  valueMappedFromProp?: string;
  valueByModifier: Record<string, string | number>;
  modifiers?: never;
};

type PropExtractedStyleDefinition = StyleBasedPropDefinition & {
  modifiers: readonly string[];
  cssVariableName?: never;
  cssVariableNameModifierFromProp?: never;
  valueByModifier?: never;
};

type StyleDefinition =
  | ValueMappedStyleDefinition
  | PropExtractedStyleDefinition;

type StyleObjFromPropConfig = {
  styleDefinitionByPropName: Record<string, StyleDefinition>;
};

type ExtractStyleFromPropOptions<
  TConfig extends {
    styleDefinitionByPropName: Record<
      string,
      { valueByModifier?: Record<string, any>; modifiers?: readonly any[] }
    >;
  },
  TPropName extends keyof TConfig['styleDefinitionByPropName'],
> = TConfig['styleDefinitionByPropName'][TPropName]['modifiers'] extends readonly any[]
  ? TConfig['styleDefinitionByPropName'][TPropName]['modifiers'][number]
  : keyof TConfig['styleDefinitionByPropName'][TPropName]['valueByModifier'];

function processObjectStyleValue(
  valueDef: ValueMappedStyleDefinition,
  propValue: Record<string, any>,
  props: Record<string, any>,
  styleVars: Record<string, string | number>,
  handledPropNames: Record<string, boolean>,
) {
  for (const key in propValue) {
    if (!Object.prototype.hasOwnProperty.call(propValue, key)) {
      continue;
    }
    const val = propValue[key];
    const mappedValue = valueDef.valueByModifier[val as string];
    if (mappedValue !== undefined) {
      if (valueDef.cssVariableNameModifierFromProp) {
        const modifierPropName = valueDef.cssVariableNameModifierFromProp;
        handledPropNames[modifierPropName] = true;
        const modifierPropValue = props[modifierPropName];

        if (modifierPropValue) {
          // e.g. '--ms-spacing-size-' + 'm' + 'v'
          const finalVarName = `${valueDef.cssVariableName}-${modifierPropValue}${key}`;
          styleVars[finalVarName] = mappedValue;
        }
      }
    }
  }
}

function processPrimitiveStyleValue(
  valueDef: ValueMappedStyleDefinition,
  propValue: string | number | boolean,
  props: Record<string, any>,
  styleVars: Record<string, string | number>,
  handledPropNames: Record<string, boolean>,
) {
  const mappedValue = valueDef.valueByModifier[propValue as string];
  if (mappedValue !== undefined) {
    if (valueDef.cssVariableNameModifierFromProp) {
      const modifierPropName = valueDef.cssVariableNameModifierFromProp;
      handledPropNames[modifierPropName] = true;
      const modifierPropValue = props[modifierPropName];

      if (modifierPropValue) {
        const finalVarName = `${valueDef.cssVariableName}-${modifierPropValue}`;
        styleVars[finalVarName] = mappedValue;
      }
    } else {
      styleVars[valueDef.cssVariableName] = mappedValue;
    }
  }
}

function processStyleConfig(
  config: StyleObjFromPropConfig,
  props: Record<string, any>,
  styleVars: Record<string, string | number>,
  handledPropNames: Record<string, boolean>,
) {
  for (const propName in config.styleDefinitionByPropName) {
    if (
      !Object.prototype.hasOwnProperty.call(
        config.styleDefinitionByPropName,
        propName,
      )
    ) {
      continue;
    }

    const def = config.styleDefinitionByPropName[propName];
    handledPropNames[propName] = true;

    // Handle PropExtracted types (like spcType where it just needs to be validated/removed)
    if ('modifiers' in def && def.modifiers) {
      // We just track it to ensure it is removed from restProps.
      continue;
    }

    const valueDef = def as ValueMappedStyleDefinition;

    // If we are mapping this config entry from another prop's value (aliasing)
    const targetPropName = valueDef.valueMappedFromProp || propName;
    const propValue =
      props[targetPropName] !== undefined
        ? props[targetPropName]
        : valueDef.defaultValue;

    if (propValue !== undefined && propValue !== null) {
      // Handle object notation: spcSizes={{ v: 'xs', h: 'lg' }}
      if (typeof propValue === 'object' && !Array.isArray(propValue)) {
        processObjectStyleValue(
          valueDef,
          propValue,
          props,
          styleVars,
          handledPropNames,
        );
      }
      // Handle standard string notation: spcSize="xs"
      else {
        processPrimitiveStyleValue(
          valueDef,
          propValue as string | number | boolean,
          props,
          styleVars,
          handledPropNames,
        );
      }
    }
  }
}

function extractStyleObjFromProps(
  configs: StyleObjFromPropConfig[],
  props: Record<string, any>,
): [{ [key: string]: string | number }, Record<string, any>] {
  const styleVars: Record<string, string | number> = {};
  const restProps = { ...props };
  const handledPropNames: Record<string, boolean> = {};

  configs.forEach((config) => {
    processStyleConfig(config, props, styleVars, handledPropNames);
  });

  // Clean up handled props from restProps
  for (const prop in handledPropNames) {
    delete restProps[prop];
  }

  return [styleVars, restProps];
}

export { extractStyleObjFromProps };
export type { ExtractStyleFromPropOptions, StyleObjFromPropConfig };
