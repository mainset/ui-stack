import cn from 'classnames';
import React from 'react';
import { createPortal } from 'react-dom';

// * Helpers
const initialState = {
  isOverlayVisibleById: {
    // TODO: Add isShownByDefault prop support
  } as Record<string, boolean>,
};

const OverlayContext = React.createContext(initialState);

let overlayHook = {
  isInitialized: false,

  // TODO: remove workaround that fixes TS error
  toggleOverlay: (p: any) => {},
  overlay: initialState,
};

function initOverlayByIdToggler(overlayId: string, cb: () => void) {
  return () => {
    overlayHook.toggleOverlay({
      isOverlayVisibleById: {
        ...overlayHook.overlay.isOverlayVisibleById,
        [overlayId]: !overlayHook.overlay.isOverlayVisibleById[overlayId],
      },
    });

    if (cb) cb();
  };
}

// * Provider
interface OverlayProviderProps {
  children: React.ReactNode;
}

const OverlayProvider: React.FC<OverlayProviderProps> = ({ children }) => {
  const [overlay, toggleOverlay] = React.useState(initialState);

  overlayHook = { isInitialized: true, overlay, toggleOverlay };

  const overlayContextProvideValue = {
    ...overlay,

    actions: {
      initOverlayByIdToggler,
    },
  };

  return (
    <OverlayContext.Provider value={overlayContextProvideValue}>
      {children}
    </OverlayContext.Provider>
  );
};

interface OverlayBasicComponentProps extends React.HTMLAttributes<HTMLElement> {
  id: string;
}

type CnBuilderPropDef = {
  readonly propKey: string;
  readonly modifier?: string;
  readonly options: readonly string[];
  readonly defaultValue?: string | boolean;
};

type ExtractCnProps<T extends readonly CnBuilderPropDef[]> = {
  [P in T[number] as P['propKey']]?: P['options'] extends readonly (infer O)[]
    ? O extends string
      ? O
      : never
    : P['options'] extends boolean
      ? boolean
      : never;
};

interface CreateOverlayBasicComponentConfig<
  TCn extends readonly CnBuilderPropDef[],
> {
  BASIC_CLASS_NAME: string;
  cnBuilderProps?: TCn;
}

function createOverlayBasicComponent<
  const TCn extends readonly CnBuilderPropDef[] = [],
>({
  BASIC_CLASS_NAME,
  cnBuilderProps,
}: CreateOverlayBasicComponentConfig<TCn>) {
  const classNamePrefix = `${BASIC_CLASS_NAME}-`;

  type ComponentProps = OverlayBasicComponentProps & ExtractCnProps<TCn>;

  const OverlayBasicComponent = (props: ComponentProps) => {
    const { isOverlayVisibleById } = React.useContext(OverlayContext);
    const [overlayRoot, setOverlayRoot] = React.useState<HTMLElement | null>(
      null,
    );

    React.useEffect(() => {
      if (typeof window !== 'undefined') {
        setOverlayRoot(
          window.document.getElementById(`${BASIC_CLASS_NAME}-root`),
        );
      }
    }, []);

    const dynamicClassName = React.useMemo(() => {
      const classNameByComputedClassName: Record<string, any> = {};

      if (cnBuilderProps) {
        cnBuilderProps.forEach(
          ({ propKey, modifier, options, defaultValue }) => {
            const isPropBool = typeof options === 'boolean';

            const propValue = (props as any)[propKey];
            const modifierPrefix = modifier || propKey;
            const modifierValue = isPropBool
              ? ''
              : `-${propValue || defaultValue}`;

            const computedClassName = `${BASIC_CLASS_NAME}--${modifierPrefix}${modifierValue}`;
            classNameByComputedClassName[computedClassName] =
              propValue || defaultValue;
          },
        );
      }

      return classNameByComputedClassName;
    }, [props]);

    const { id, children, className } = props;
    const componentClassName = classNamePrefix + id;

    return (
      <OverlayContext.Consumer>
        {({
          isOverlayVisibleById,
          // actions,
        }) => {
          // @ts-ignore
          return isOverlayVisibleById[id] && overlayRoot
            ? createPortal(
                <div
                  id={id}
                  className={cn(
                    BASIC_CLASS_NAME,
                    dynamicClassName,
                    componentClassName,
                    className,
                  )}
                >
                  {children}
                </div>,
                overlayRoot, // overlayElement,
              )
            : null;
        }}
      </OverlayContext.Consumer>
    );
  };

  OverlayBasicComponent.config = {
    classNamePrefix,
  };

  OverlayBasicComponent.Actions = {
    // initOverlayByIdToggler: initOverlayByIdToggler,
  } as const;

  // * Shared
  // OverlayBasicComponent.Consumer = OverlayContext.Consumer;

  return OverlayBasicComponent;
}

export { createOverlayBasicComponent, initOverlayByIdToggler, OverlayProvider };
export type { OverlayBasicComponentProps };
