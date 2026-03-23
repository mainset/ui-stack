type BaseStyleDefinition = {
  defaultValue?: string | boolean | number;
};

type ValueMappedStyleDefinition = BaseStyleDefinition & {
  cssVariableName: string;
  cssVariableNameModifierProp?: string;
  valueByModifier: Record<string, string | number>;
  modifiers?: never;
};

type PropExtractedStyleDefinition = BaseStyleDefinition & {
  modifiers: readonly string[];
  cssVariableName?: never;
  cssVariableNameModifierProp?: never;
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

function extractStyleObjFromProps(
  configs: StyleObjFromPropConfig[],
  props: Record<string, any>,
): [{ [key: string]: string | number }, Record<string, any>] {
  const styleVars: Record<string, string | number> = {};
  const restProps = { ...props };
  const handledPropNames: Record<string, boolean> = {};

  configs.forEach((config) => {
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
        // It provides the suffix, but the actual CSS variable assignment
        // happens when we process the value-mapped prop (spcSize).
        continue;
      }

      const valueDef = def as ValueMappedStyleDefinition;
      const propValue =
        props[propName] !== undefined ? props[propName] : valueDef.defaultValue;

      if (
        propValue !== undefined &&
        valueDef.valueByModifier[propValue as string] !== undefined
      ) {
        const mappedValue = valueDef.valueByModifier[propValue as string];

        if (valueDef.cssVariableNameModifierProp) {
          const modifierPropName = valueDef.cssVariableNameModifierProp;
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
  });

  // Clean up handled props from restProps
  for (const prop in handledPropNames) {
    delete restProps[prop];
  }

  return [styleVars, restProps];
}

export { extractStyleObjFromProps };
export type { ExtractStyleFromPropOptions, StyleObjFromPropConfig };
