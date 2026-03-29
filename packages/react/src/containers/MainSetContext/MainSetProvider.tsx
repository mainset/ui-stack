import React from 'react';

// NOTE: avoid loop dependency as MainSetProvider uses OverlayContainer
import { OverlayContainer } from '../Overlay/OverlayContainer.js';
import { MainSetContext, MainSetContextValue } from './MainSetContext.mjs';

type MainSetProviderState = Pick<
  MainSetContextValue,
  'isOverlayOpenById' | 'overlayStackIds'
>;

const MainSetProvider = ({ children }: React.PropsWithChildren) => {
  const [state, setState] = React.useState<MainSetProviderState>({
    isOverlayOpenById: {},
    overlayStackIds: [],
  });

  /*
  const setOverlayOpenById = React.useCallback((id: string, isOpen: boolean) => {
    setState((prevState) => {
      const isCurrentlyOpen = prevState.isOverlayOpenById[id] ?? false;
      if (isCurrentlyOpen === isOpen) return prevState;

      const newStack = isOpen
        ? prevState.overlayStackIds.includes(id)
          ? prevState.overlayStackIds
          : [...prevState.overlayStackIds, id]
        : prevState.overlayStackIds.filter((stackId) => stackId !== id);

      return {
        isOverlayOpenById: { ...prevState.isOverlayOpenById, [id]: isOpen },
        overlayStackIds: newStack,
      };
    });
  }, []);
  */

  const toggleOverlayOpenById = React.useCallback((id: string) => {
    setState((prevState) => {
      const isCurrentlyOpen = prevState.isOverlayOpenById[id] ?? false;
      const willBeOpen = !isCurrentlyOpen;

      const newStack = willBeOpen
        ? prevState.overlayStackIds.includes(id)
          ? prevState.overlayStackIds
          : [...prevState.overlayStackIds, id]
        : prevState.overlayStackIds.filter((stackId) => stackId !== id);

      return {
        isOverlayOpenById: { ...prevState.isOverlayOpenById, [id]: willBeOpen },
        overlayStackIds: newStack,
      };
    });
  }, []);

  const value = React.useMemo<MainSetContextValue>(
    () => ({
      isOverlayOpenById: state.isOverlayOpenById,
      overlayStackIds: state.overlayStackIds,
      // setOverlayOpenById,
      toggleOverlayOpenById,
    }),
    [
      state.isOverlayOpenById,
      state.overlayStackIds,
      // setOverlayOpenById,
      toggleOverlayOpenById,
    ],
  );

  return (
    <MainSetContext.Provider value={value}>
      <OverlayContainer />
      {children}
    </MainSetContext.Provider>
  );
};

export { MainSetProvider };
